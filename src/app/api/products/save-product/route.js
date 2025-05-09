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
    
    // Get form data with files
    const formData = await request.formData();
    
    // Extract basic product data
    const productData = {
      productId: formData.get('productId'),
      productName: formData.get('productName'),
      description: formData.get('description'),
      category: formData.get('category'),
      priceRange: formData.get('priceRange'),
      quantityPerOrder: formData.get('quantityPerOrder'),
    };
    
    // Validate required fields
    if (!productData.productId || !productData.productName) {
      return NextResponse.json(
        { success: false, error: 'Product ID and Product Name are required' },
        { status: 400 }
      );
    }
    
    // Check if product with the same ID already exists
    const existingProduct = await Product.findOne({ productId: productData.productId });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'A product with this ID already exists' },
        { status: 409 }
      );
    }

    // Get attributes data
    let attributes = [];
    try {
      const attributesJSON = formData.get('attributes');
      if (attributesJSON) {
        attributes = JSON.parse(attributesJSON);
      }
    } catch (error) {
      console.error('Error parsing attributes:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid attributes format' },
        { status: 400 }
      );
    }
    
    // Handle product images upload (limit to 5)
    const productImages = [];
    const productImageFiles = formData.getAll('productImages');
    
    // Ensure maximum of 5 product images
    if (productImageFiles.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum of 5 product images allowed' },
        { status: 400 }
      );
    }
    
    // Process product images
    for (const file of productImageFiles) {
      if (file instanceof File) {
        const imageUrl = await uploadToCloudinary(file, 'product_images');
        if (imageUrl) {
          productImages.push(imageUrl);
        }
      }
    }
    
    // Handle measurement specs upload (limit to 5)
    const measurementSpecs = [];
    const measurementFiles = formData.getAll('measurementSpecs');
    
    // Ensure maximum of 5 measurement specs
    if (measurementFiles.length > 5) {
      return NextResponse.json(
        { success: false, error: 'Maximum of 5 measurement spec images allowed' },
        { status: 400 }
      );
    }
    
    // Process measurement specs
    for (const file of measurementFiles) {
      if (file instanceof File) {
        const imageUrl = await uploadToCloudinary(file, 'measurement_specs');
        if (imageUrl) {
          measurementSpecs.push(imageUrl);
        }
      }
    }
    
    // Create new product with all data
    const product = new Product({
      ...productData,
      productImages,
      measurementSpecs,
      attributes
    });
    
    // Save to database
    await product.save();
    
    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save product' },
      { status: 500 }
    );
  }
}

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(file, folder) {
  try {
    // Convert the file to buffer
    const fileBuffer = await file.arrayBuffer();
    
    // Convert to base64 for Cloudinary
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${fileBase64}`;
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri,
        {
          folder: folder || 'products',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}