// app/api/products/update-product/[id]/route.js

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/productSchema';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request, { params }) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get product ID from params
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required'
      }, { status: 400 });
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid product ID format'
      }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 });
    }

    // Get form data with files
    const formData = await request.formData();
    
    // Extract basic product data (use new primary/secondary categories)
    const productData = {
      productId: (formData.get('productId') || '').toString().trim(),
      productName: (formData.get('productName') || '').toString().trim(),
      description: (formData.get('description') || '').toString().trim(),
      primaryCategory: (formData.get('primaryCategory') || '').toString().trim(),
      secondaryCategory: (formData.get('secondaryCategory') || '').toString().trim(),
      priceRange: (formData.get('priceRange') || '').toString().trim(),
      quantityPerOrder: (formData.get('quantityPerOrder') || '').toString().trim(),
    };

    // Validate required fields
    if (!productData.productId || !productData.productName) {
      return NextResponse.json({
        success: false,
        error: 'Product ID and Product Name are required'
      }, { status: 400 });
    }

    // Require primaryCategory (since schema marks it required)
    if (!productData.primaryCategory) {
      return NextResponse.json({
        success: false,
        error: 'Primary Category (Audience) is required'
      }, { status: 400 });
    }

    // If productId has changed, ensure uniqueness (exclude current document)
    if (productData.productId !== existingProduct.productId) {
      const duplicate = await Product.findOne({ productId: productData.productId });
      if (duplicate) {
        return NextResponse.json({
          success: false,
          error: 'Another product with this productId already exists'
        }, { status: 409 });
      }
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
      return NextResponse.json({
        success: false,
        error: 'Invalid attributes format'
      }, { status: 400 });
    }

    // Handle existing images (passed from frontend as JSON arrays)
    let existingProductImages = [];
    let existingMeasurementImages = [];
    
    const existingProductImagesString = formData.get('existingProductImages');
    const existingMeasurementImagesString = formData.get('existingMeasurementImages');
    
    if (existingProductImagesString) {
      try {
        existingProductImages = JSON.parse(existingProductImagesString);
        if (!Array.isArray(existingProductImages)) existingProductImages = [];
      } catch (error) {
        console.error('Error parsing existing product images:', error);
        existingProductImages = [];
      }
    } else if (Array.isArray(existingProduct.productImages)) {
      // fallback to DB values if frontend didn't pass them
      existingProductImages = existingProduct.productImages.slice();
    }
    
    if (existingMeasurementImagesString) {
      try {
        existingMeasurementImages = JSON.parse(existingMeasurementImagesString);
        if (!Array.isArray(existingMeasurementImages)) existingMeasurementImages = [];
      } catch (error) {
        console.error('Error parsing existing measurement images:', error);
        existingMeasurementImages = [];
      }
    } else if (Array.isArray(existingProduct.measurementSpecs)) {
      existingMeasurementImages = existingProduct.measurementSpecs.slice();
    }

    // Handle product images upload (limit to 5 total including existing)
    const newProductImages = [];
    const productImageFiles = formData.getAll('productImages') || [];
    
    // Check total product images limit
    if (existingProductImages.length + productImageFiles.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum of 5 product images allowed'
      }, { status: 400 });
    }
    
    // Process new product images
    for (const file of productImageFiles) {
      // ensure file-like object (works in Next runtimes)
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const imageUrl = await uploadToCloudinary(file, 'product_images');
        if (imageUrl) {
          newProductImages.push(imageUrl);
        }
      }
    }
    
    // Handle measurement specs upload (limit to 5 total including existing)
    const newMeasurementSpecs = [];
    const measurementFiles = formData.getAll('measurementSpecs') || [];
    
    // Check total measurement specs limit
    if (existingMeasurementImages.length + measurementFiles.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum of 5 measurement spec images allowed'
      }, { status: 400 });
    }
    
    // Process new measurement specs
    for (const file of measurementFiles) {
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const imageUrl = await uploadToCloudinary(file, 'measurement_specs');
        if (imageUrl) {
          newMeasurementSpecs.push(imageUrl);
        }
      }
    }

    // Combine existing and new images
    const allProductImages = [...existingProductImages, ...newProductImages];
    const allMeasurementImages = [...existingMeasurementImages, ...newMeasurementSpecs];

    // Prepare update data
    const updateData = {
      productId: productData.productId,
      productName: productData.productName,
      description: productData.description,
      primaryCategory: productData.primaryCategory,
      secondaryCategory: productData.secondaryCategory || undefined,
      priceRange: productData.priceRange,
      quantityPerOrder: productData.quantityPerOrder,
      productImages: allProductImages,
      measurementSpecs: allMeasurementImages,
      attributes,
      updatedAt: new Date()
    };

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        errors: validationErrors
      }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Product with this ID already exists'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update product'
    }, { status: 500 });
  }
}

// Helper function to upload file to Cloudinary.
// - PDFs => resource_type: 'raw'
// - Images => resource_type: 'image'
// - fallback => resource_type: 'auto'
async function uploadToCloudinary(file, folder) {
  try {
    // Convert the file to buffer
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${fileBase64}`;

    const isPdf = (file.type === 'application/pdf') || (file.name && file.name.toLowerCase().endsWith('.pdf'));
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

    return result?.secure_url || null;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
