import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/vendorSchema';
import { isValidObjectId } from 'mongoose';

// GET handler - properly accessing params in Next.js App Router
export async function GET(request, context) {
  try {
    await dbConnect();

    // Directly use the ID from params without the helper function
    const params = context.params;
    // Access the id property only after ensuring params is ready
    const vendorId = params ? params.id : null;

    // If no ID in params, try to get it from query parameters
    if (!vendorId) {
      const url = new URL(request.url);
      const queryId = url.searchParams.get('id');
      
      if (!queryId) {
        return NextResponse.json(
          { success: false, message: 'Vendor ID is required' },
          { status: 400 }
        );
      }
      
      if (!isValidObjectId(queryId)) {
        return NextResponse.json(
          { success: false, message: 'Invalid vendor ID format' },
          { status: 400 }
        );
      }
      
      // Use the query ID instead
      const vendor = await Vendor.findById(queryId);
      
      if (!vendor) {
        return NextResponse.json(
          { success: false, message: 'Vendor not found' },
          { status: 404 }
        );
      }
      
      // Process vendor data
      return formatVendorResponse(vendor);
    }

    // If we have a path parameter ID
    if (!isValidObjectId(vendorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid vendor ID format' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    return formatVendorResponse(vendor);
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch vendor details',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Helper function to format the vendor response
function formatVendorResponse(vendor) {
  const submissionDate = vendor.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '-';

  const documentUrls = {};

  if (vendor.documents?.gstDocument)
    documentUrls.gstDocument = vendor.documents.gstDocument;
  if (vendor.documents?.panDocument)
    documentUrls.panDocument = vendor.documents.panDocument;
  if (vendor.documents?.msmeDocument)
    documentUrls.msmeDocument = vendor.documents.msmeDocument;
  if (vendor.bankDetails?.cancelledCheque)
    documentUrls.cancelledCheque = vendor.bankDetails.cancelledCheque;
  if (vendor.address?.addressProofDocument)
    documentUrls.addressProof = vendor.address.addressProofDocument;

  if (vendor.documents?.certifications) {
    Object.entries(vendor.documents.certifications).forEach(([key, value]) => {
      if (value) {
        documentUrls[`certification_${key}`] = value;
      }
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: vendor._id,
      primaryContact: vendor.primaryContact || {},
      company: vendor.company || {},
      address: vendor.address || {},
      documents: vendor.documents || {},
      bankDetails: vendor.bankDetails || {},
      status: vendor.status,
      submissionDate,
      documentUrls,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    },
  });
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';