// src/app/api/tracking/order-status/[id]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function PUT(request, { params }) {
  const id = params.id;
  
  try {
    await dbConnect();
    
    // Parse the request body
    const body = await request.json();
    const { step, status } = body;
    
    if (!step || !status) {
      return NextResponse.json(
        { success: false, message: 'Step and status are required' },
        { status: 400 }
      );
    }
    
    // Validate the status
    const validStatuses = ["Not Started", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Create update object
    const updateData = {
      [`productionSteps.${step}`]: status
    };
    
    // If the step is being marked as "Completed", we might want to update the order's overall status
    // based on which steps are completed
    let newOrderStatus = null;
    
    if (status === "Completed") {
      // Get the current order to check all steps
      const order = await Order.findById(id);
      
      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Count completed steps
      const productionSteps = order.productionSteps;
      const totalSteps = Object.keys(productionSteps).length;
      
      // Include the step we're updating now
      const updatedSteps = { ...productionSteps, [step]: status };
      const completedSteps = Object.values(updatedSteps).filter(s => s === "Completed").length;
      
      // Update order status based on completed steps
      if (completedSteps === totalSteps) {
        newOrderStatus = "Completed";
      } else if (completedSteps > 0) {
        newOrderStatus = "In Production";
      }
      
      if (newOrderStatus) {
        updateData.status = newOrderStatus;
      }
    }
    
    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true, 
      data: updatedOrder,
      message: `Production step "${step}" updated to "${status}"${newOrderStatus ? ` and order status updated to "${newOrderStatus}"` : ''}`
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Optionally add GET method to retrieve status
export async function GET(request, { params }) {
  const id = params.id;
  
  try {
    await dbConnect();
    
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        productionSteps: order.productionSteps
      }
    });
    
  } catch (error) {
    console.error('Error retrieving order status:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}