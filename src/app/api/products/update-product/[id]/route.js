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
    
    // Extract basic product data
    const productData = {
      productId: formData.get('productId'),
      productName: formData.get('productName'),
      description: formData.get('description') || '',
      category: formData.get('category') || '',
      priceRange: formData.get('priceRange') || '',
      quantityPerOrder: formData.get('quantityPerOrder') || '',
    };

    // Validate required fields
    if (!productData.productId || !productData.productName) {
      return NextResponse.json({
        success: false,
        error: 'Product ID and Product Name are required'
      }, { status: 400 });
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

    // Handle existing images
    let existingProductImages = [];
    let existingMeasurementImages = [];
    
    const existingProductImagesString = formData.get('existingProductImages');
    const existingMeasurementImagesString = formData.get('existingMeasurementImages');
    
    if (existingProductImagesString) {
      try {
        existingProductImages = JSON.parse(existingProductImagesString);
      } catch (error) {
        console.error('Error parsing existing product images:', error);
      }
    }
    
    if (existingMeasurementImagesString) {
      try {
        existingMeasurementImages = JSON.parse(existingMeasurementImagesString);
      } catch (error) {
        console.error('Error parsing existing measurement images:', error);
      }
    }

    // Handle product images upload (limit to 5 total including existing)
    const newProductImages = [];
    const productImageFiles = formData.getAll('productImages');
    
    // Check total product images limit
    if (existingProductImages.length + productImageFiles.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum of 5 product images allowed'
      }, { status: 400 });
    }
    
    // Process new product images
    for (const file of productImageFiles) {
      if (file instanceof File) {
        const imageUrl = await uploadToCloudinary(file, 'product_images');
        if (imageUrl) {
          newProductImages.push(imageUrl);
        }
      }
    }
    
    // Handle measurement specs upload (limit to 5 total including existing)
    const newMeasurementSpecs = [];
    const measurementFiles = formData.getAll('measurementSpecs');
    
    // Check total measurement specs limit
    if (existingMeasurementImages.length + measurementFiles.length > 5) {
      return NextResponse.json({
        success: false,
        error: 'Maximum of 5 measurement spec images allowed'
      }, { status: 400 });
    }
    
    // Process new measurement specs
    for (const file of measurementFiles) {
      if (file instanceof File) {
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
      ...productData,
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

// Helper function to upload file to Cloudinary (same as add-product)
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