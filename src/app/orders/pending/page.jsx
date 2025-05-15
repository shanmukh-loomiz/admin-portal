// app/pending-orders/page.js
import { Suspense } from 'react';
import dbConnect from '../../../lib/mongodb';
import Quote from '@/models/Quote';
import RFQReceived from '../../components/RFQRecieved';

// This function runs on the server side
async function fetchPendingQuotes() {
  await dbConnect();
  // Find all quotes with "Pending" status
  const pendingQuotes = await Quote.find({ status: "Pending" })
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
  const serializedQuotes = pendingQuotes.map(quote => ({
    ...quote,
    _id: quote._id.toString(),
    createdAt: quote.createdAt.toISOString(),
  }));

  return { quotes: serializedQuotes, stats };
}

export default async function PendingOrders() {
  // Fetch the data server-side
  const { quotes, stats } = await fetchPendingQuotes();
  
  return (
    <Suspense fallback={<div className='ml-[350px]'>Loading...</div>}>
      <RFQReceived initialQuotes={quotes} initialStats={stats} />
    </Suspense>
  );
}