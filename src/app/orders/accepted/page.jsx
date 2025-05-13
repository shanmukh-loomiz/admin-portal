// app/accepted-orders/page.js
import { Suspense } from 'react';
import dbConnect from '../../../lib/mongodb';
import Quote from '@/models/Quote';
// Make sure this import path is correct - it should point to where your AcceptedRFQs component is defined
import AcceptedRFQs from '../../components/AcceptedRFQs';

// This function runs on the server side
async function fetchAcceptedQuotes() {
  await dbConnect();
  
  // Find all quotes with "Accepted" status
  const acceptedQuotes = await Quote.find({ status: "Accepted" })
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
  const serializedQuotes = acceptedQuotes.map(quote => ({
    ...quote,
    _id: quote._id.toString(),
    createdAt: quote.createdAt.toISOString(),
  }));

  return { quotes: serializedQuotes, stats };
}

export default async function AcceptedOrders() {
  // Fetch the data server-side
  const { quotes, stats } = await fetchAcceptedQuotes();
    
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptedRFQs initialQuotes={quotes} initialStats={stats} />
    </Suspense>
  );
}