// app/track-order/[orderId]/page.js
import  dbConnect  from "@/lib/mongodb";
import mongoose from 'mongoose';
import OrderTrackingStepsHome from "@/app/components/OderTrackingStepsHome";
import Order from "@/models/Order";

// This is a server component that fetches data
export default async function TrackOrder({ params }) {
  const { id } = params;
  const orderId=id
  
  let order = null;
  let error = null;

  try {
    // Connect to the database
    await dbConnect();

    console.log("Connected to Database")
    
    
    
    // Find the order by ID or order number
    console.log(typeof(orderId))
    const orderData = await Order.findOne({quote:orderId}).lean();

    console.log("Order dats is:",orderData)
    
    if (orderData) {
      // Convert Mongoose document to a plain object
      order = JSON.parse(JSON.stringify(orderData));
      
      // Convert ObjectId to string
      if (order._id) {
        order._id = order._id.toString();
      }
      
      // Convert other ObjectId fields if present
      if (order.quote) {
        order.quote = order.quote.toString();
      }
    }
  } catch (err) {
    console.error("Error fetching order:", err);
    error = "Failed to load order data. Please try again later.";
  }

  // Show error message if something went wrong
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Show not found message if no order was found
  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">Order Not Found</h2>
          <p>The order you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  // Render the tracking component with the order data
  return (
    <div>
      <OrderTrackingStepsHome orderData={order} />
    </div>
  );
}