// app/api/vendors/approve/route.js
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
      { status: 'approved' },
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
      message: 'Vendor approved successfully',
      data: {
        id: vendor._id,
        status: vendor.status
      }
    });
    
  } catch (error) {
    console.error('Error approving vendor:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to approve vendor',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';