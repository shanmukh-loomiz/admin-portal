// app/api/orders/reject/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/Quote';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { quoteId, comments } = data; // Changed from rejectionReason to comments
    
    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'Quote ID is required' },
        { status: 400 }
      );
    }
    
    if (!comments || !comments.trim()) {
      return NextResponse.json(
        { success: false, error: 'Rejection comments are required' }, // Updated error message
        { status: 400 }
      );
    }
    
    // Find and update the quote status to "Rejected" with the comments
    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      { 
        status: "Rejected",
        comments: comments.trim() // Changed from rejectionReason to comments
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
    // such as sending notification emails, logging rejection comments, etc.
    
    return NextResponse.json({ 
      success: true,
      message: 'Quote successfully rejected',
      data: {
        _id: updatedQuote._id.toString(),
        status: updatedQuote.status,
        comments: updatedQuote.comments // Changed from rejectionReason to comments
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