import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/Quote';
import Order from '@/models/Order';
import { v4 as uuidv4 } from 'uuid';

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
    
    // Step 1: Accept the quote
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

    // Step 2: Check if Order already exists for this quote
    const existingOrder = await Order.findOne({ quote: quoteId });
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: 'Quote accepted, order already exists',
        orderId: existingOrder._id,
        orderNumber: existingOrder.orderNumber
      });
    }

    // Step 3: Create the Order
    const newOrder = new Order({
      quote: updatedQuote._id,
      orderNumber: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
      noOfPieces: updatedQuote.quantity,
      price: updatedQuote.targetPrice,
      leadTime: updatedQuote.leadTime,
      designImage: updatedQuote.productImagesFiles?.[0] || '',
      colours: [],
      sizes: [],
      productionSteps: {
        sampleConfirmation: "Not Started",
        fabricInhoused: "Not Started",
        fabricQualityCheck: "Not Started",
        production: "Not Started",
        packaging: "Not Started",
        qualityCheck: "Not Started",
        outForDelivery: "Not Started",
        confirmPaymentTerms: "Not Started"
      }
    });

    await newOrder.save();

    // Step 4: Return success
    return NextResponse.json({ 
      success: true, 
      message: 'Quote accepted and order created',
      data: {
        quoteId: updatedQuote._id.toString(),
        orderId: newOrder._id.toString(),
        orderNumber: newOrder.orderNumber
      }
    });

  } catch (error) {
    console.error('Error accepting quote and creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept quote or create order' },
      { status: 500 }
    );
  }
}
