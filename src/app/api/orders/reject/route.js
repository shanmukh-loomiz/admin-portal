// app/api/orders/reject/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/Quote';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { quoteId, rejectionReason } = data;
    
    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'Quote ID is required' },
        { status: 400 }
      );
    }
    
    if (!rejectionReason || !rejectionReason.trim()) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required' },
        { status: 400 }
      );
    }
    
    // Find and update the quote status to "Rejected" with the reason
    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      { 
        status: "Rejected",
        rejectionReason: rejectionReason.trim()
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }
    
    // You could also perform additional operations here,
    // such as sending notification emails, logging rejection reasons, etc.
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quote successfully rejected',
      data: {
        _id: updatedQuote._id.toString(),
        status: updatedQuote.status,
        rejectionReason: updatedQuote.rejectionReason
      }
    });
  } catch (error) {
    console.error('Error rejecting quote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject quote' },
      { status: 500 }
    );
  }
}