// app/api/orders/accept/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/Quote';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    const { quoteId } = data;
    
    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: 'Quote ID is required' },
        { status: 400 }
      );
    }
    
    // Find and update the quote status to "Accepted"
    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      { status: "Accepted" },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      );
    }
    
    // You could also perform additional operations here,
    // such as creating an order record, sending notifications, etc.
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quote successfully accepted',
      data: {
        _id: updatedQuote._id.toString(),
        status: updatedQuote.status
      }
    });
  } catch (error) {
    console.error('Error accepting quote:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept quote' },
      { status: 500 }
    );
  }
}