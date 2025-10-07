// app/api/save-product/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/productSchema';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();

    // Extract product data (trim strings)
    const productData = {
      productId: (formData.get('productId') || '').toString().trim(),
      productName: (formData.get('productName') || '').toString().trim(),
      description: (formData.get('description') || '').toString().trim(),
      primaryCategory: (formData.get('primaryCategory') || '').toString().trim(),
      secondaryCategory: (formData.get('secondaryCategory') || '').toString().trim(),
      priceRange: (formData.get('priceRange') || '').toString().trim(),
      quantityPerOrder: (formData.get('quantityPerOrder') || '').toString().trim(),
    };

    // Validation
    if (!productData.productId || !productData.productName) {
      return NextResponse.json(
        { success: false, error: 'Product ID and Product Name are required' },
        { status: 400 }
      );
    }
    if (!productData.primaryCategory) {
      return NextResponse.json(
        { success: false, error: 'Primary Category (Audience) is required' },
        { status: 400 }
      );
    }

    // Ensure unique productId
    const existingProduct = await Product.findOne({ productId: productData.productId });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'A product with this ID already exists' },
        { status: 409 }
      );
    }

    // Parse attributes
    let attributes = [];
    try {
      const attributesJSON = formData.get('attributes');
      if (attributesJSON) attributes = JSON.parse(attributesJSON);
    } catch (error) {
      console.error('Invalid attributes JSON:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid attributes format' },
        { status: 400 }
      );
    }

    // Upload product images
    const productImages = [];
    const productImageFiles = formData.getAll('productImages') || [];
    if (productImageFiles.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum of 5 product images allowed' },
        { status: 400 }
      );
    }
    for (const file of productImageFiles) {
      // In Next.js Edge runtime File exists; otherwise check for object containing buffer/url
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const imageUrl = await uploadToCloudinary(file, 'product_images');
        if (imageUrl) productImages.push(imageUrl);
      }
    }

    // Upload measurement specs (PDFs or images)
    const measurementSpecs = [];
    const measurementFiles = formData.getAll('measurementSpecs') || [];
    if (measurementFiles.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum of 5 measurement spec images allowed' },
        { status: 400 }
      );
    }
    for (const file of measurementFiles) {
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const fileUrl = await uploadToCloudinary(file, 'measurement_specs');
        if (fileUrl) measurementSpecs.push(fileUrl);
      }
    }

    // Save product
    const product = new Product({
      ...productData,
      productImages,
      measurementSpecs,
      attributes,
    });
    await product.save();

    return NextResponse.json(
      { success: true, message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save product' },
      { status: 500 }
    );
  }
}

/**
 * Upload file to Cloudinary with appropriate resource_type:
 * - PDFs (application/pdf) -> 'raw'
 * - Images (image/*) -> 'image'
 * - Fallback -> 'auto'
 *
 * Returns secure_url on success or null on failure.
 */
async function uploadToCloudinary(file, folder) {
  try {
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${fileBase64}`;

    const isPdf = file.type === 'application/pdf' || (file.name && file.name.toLowerCase().endsWith('.pdf'));
    const isImage = file.type && file.type.startsWith('image/');

    const resourceType = isPdf ? 'raw' : isImage ? 'image' : 'auto';

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri,
        {
          folder: folder || 'products',
          resource_type: resourceType,
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    // Cloudinary returns secure_url for both raw and image uploads.
    return result?.secure_url || null;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}
