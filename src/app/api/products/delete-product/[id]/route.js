// app/api/products/delete-product/[id]/route.js

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

export async function DELETE(request, { params }) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get product ID from params
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID format'
      }, { status: 400 });
    }

    // Find the product to get image URLs before deletion
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Extract image URLs to delete from Cloudinary
    const allImageUrls = [
      ...(product.productImages || []),
      ...(product.measurementSpecs || [])
    ];

    // Delete the product from database first
    await Product.findByIdAndDelete(id);

    // Delete images from Cloudinary (optional - you may want to keep them)
    const deletePromises = allImageUrls.map(async (imageUrl) => {
      try {
        // Extract public_id from Cloudinary URL
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image: ${publicId}`);
        }
      } catch (error) {
        console.error(`Failed to delete image: ${imageUrl}`, error);
        // Don't fail the entire deletion if image deletion fails
      }
    });

    // Wait for all image deletions to complete (with timeout)
    try {
      await Promise.allSettled(deletePromises);
    } catch (error) {
      console.error('Some images failed to delete from Cloudinary:', error);
      // Continue - product is already deleted from database
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    
    // Handle different types of errors
    if (error.name === 'CastError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID format'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete product'
    }, { status: 500 });
  }
}

// Helper function to extract public_id from Cloudinary URL
function extractPublicIdFromUrl(url) {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/{version}/{public_id}.{format}
    // or: https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/{public_id}.{format}
    
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1]; // Get the last part
    const publicId = fileName.split('.')[0]; // Remove file extension
    
    // Find the folder structure from the URL
    const resourceIndex = urlParts.findIndex(part => part === 'image' || part === 'video' || part === 'raw' || part === 'auto');
    if (resourceIndex !== -1 && resourceIndex < urlParts.length - 2) {
      const folderParts = urlParts.slice(resourceIndex + 1, -1);
      return folderParts.length > 0 ? `${folderParts.join('/')}/${publicId}` : publicId;
    }
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id from URL:', url, error);
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