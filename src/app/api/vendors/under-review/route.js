// app/api/vendors/under-review/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/vendorSchema';
import { isValidObjectId } from 'mongoose';

export async function POST(request) {
  try {
    await dbConnect();
    
    // Parse request body
    const body = await request.json();
    const { vendorId } = body;
    
    // Validate vendor ID
    if (!vendorId || !isValidObjectId(vendorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid vendor ID' },
        { status: 400 }
      );
    }
    
    // Find and update vendor status
    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { status: 'under-review' },
      { new: true }  // Return the updated document
    );
    
    // Check if vendor exists
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Vendor marked as under review',
      data: {
        id: vendor._id,
        status: vendor.status
      }
    });
    
  } catch (error) {
    console.error('Error setting vendor under review:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to set vendor under review',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';