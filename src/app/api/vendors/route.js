import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vendor from '@/models/vendorSchema';

// Helper function to determine verification status based on vendor data
function determineVerificationStatus(vendor) {
  if (vendor.status === 'approved') return 'Verified';
  if (vendor.status === 'pending') return 'Under Review';
  if (vendor.status === 'rejected' || vendor.status === 'incomplete') return 'Unverified';
  return 'Unverified';
}

// GET endpoint to fetch all vendors with their verification status
export async function GET(request) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get('status');
    const searchQuery = url.searchParams.get('search');
    
    let query = {};
    
    if (searchQuery) {
      query.$or = [
        { 'company.name': { $regex: searchQuery, $options: 'i' } },
        { 'primaryContact.email': { $regex: searchQuery, $options: 'i' } },
        { 'primaryContact.firstName': { $regex: searchQuery, $options: 'i' } },
        { 'primaryContact.lastName': { $regex: searchQuery, $options: 'i' } },
        { 'documents.gstNumber': { $regex: searchQuery, $options: 'i' } },
        { 'documents.panNumber': { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    if (statusFilter && statusFilter !== 'All Status') {
      if (statusFilter === 'Verified') {
        query.status = 'approved';
      } else if (statusFilter === 'Under Review') {
        query.status = 'pending';
      } else if (statusFilter === 'Unverified') {
        query.$or = [{ status: 'rejected' }, { status: 'incomplete' }];
      }
    }
    
    const vendors = await Vendor.find(query).sort({ createdAt: -1 });
    
    const formattedVendors = vendors.map(vendor => {
      const status = determineVerificationStatus(vendor);
      const submissionDate = vendor.createdAt ? 
        new Date(vendor.createdAt).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric' 
        }) : '-';

      const hasDocuments = vendor.documents && (
        vendor.documents.gstDocument || 
        vendor.documents.panDocument || 
        vendor.documents.msmeDocument || 
        (vendor.bankDetails && vendor.bankDetails.cancelledCheque) || 
        (vendor.address && vendor.address.addressProofDocument)
      );
      
      const documentUrls = {};
      
      if (vendor.documents) {
        if (vendor.documents.gstDocument) documentUrls.gstDocument = vendor.documents.gstDocument;
        if (vendor.documents.panDocument) documentUrls.panDocument = vendor.documents.panDocument;
        if (vendor.documents.msmeDocument) documentUrls.msmeDocument = vendor.documents.msmeDocument;
      }

      if (vendor.bankDetails?.cancelledCheque) {
        documentUrls.cancelledCheque = vendor.bankDetails.cancelledCheque;
      }

      if (vendor.address?.addressProofDocument) {
        documentUrls.addressProof = vendor.address.addressProofDocument;
      }

      if (vendor.documents?.certifications) {
        Object.entries(vendor.documents.certifications).forEach(([key, value]) => {
          if (value) {
            documentUrls[`certification_${key}`] = value;
          }
        });
      }

      return {
        id: vendor._id,
        name: vendor.company?.name || 'Unknown',
        status,
        submitted: submissionDate,
        documents: hasDocuments ? 'View Files' : 'No files',
        contactPerson: vendor.primaryContact ? 
          `${vendor.primaryContact.firstName} ${vendor.primaryContact.lastName}` : 'N/A',
        contactEmail: vendor.primaryContact?.email || 'N/A',
        contactPhone: vendor.primaryContact?.phoneNumber || 'N/A',
        gstNumber: vendor.documents?.gstNumber || 'N/A',
        panNumber: vendor.documents?.panNumber || 'N/A',
        country: vendor.address?.country || 'N/A',
        firmType: vendor.company?.firmType || 'N/A',
        documentUrls
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedVendors.length,
      data: formattedVendors
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch vendors',
      error: error.message
    }, { status: 500 });
  }
}
