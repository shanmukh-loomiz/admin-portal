// app/rejected-orders/page.js
import { Suspense } from 'react';
import dbConnect from '../../../lib/mongodb';
import Quote from '@/models/Quote';
import RejectedRFQs from '../../components/RejectedRFQs';

// This function runs on the server side
async function fetchRejectedQuotes() {
  await dbConnect();
  
  // Find all quotes with "Rejected" status
  const rejectedQuotes = await Quote.find({ status: "Rejected" })
    .sort({ createdAt: -1 }) // Sort by most recent first
    .lean(); // Convert to plain JavaScript objects for better performance
    
  // Also fetch the quote stats for displaying counters
  const total = await Quote.countDocuments();
  const pending = await Quote.countDocuments({ status: "Pending" });
  const accepted = await Quote.countDocuments({ status: "Accepted" });
  const rejected = await Quote.countDocuments({ status: "Rejected" });
    
  const stats = {
    total,
    pending,
    accepted,
    rejected
  };

  // Need to convert _id to string because it's an ObjectId
  const serializedQuotes = rejectedQuotes.map(quote => ({
    ...quote,
    _id: quote._id.toString(),
    createdAt: quote.createdAt.toISOString(),
    // Also serialize the rejectedAt date if it exists
    ...(quote.rejectedAt && { rejectedAt: quote.rejectedAt.toISOString() })
  }));

  return { quotes: serializedQuotes, stats };
}

export default async function RejectedOrders() {
  // Fetch the data server-side
  const { quotes, stats } = await fetchRejectedQuotes();
    
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RejectedRFQs initialQuotes={quotes} initialStats={stats} />
    </Suspense>
  );
}