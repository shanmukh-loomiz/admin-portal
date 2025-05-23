// app/api/pending-quotes/route.js
import dbConnect from '../../../lib/mongodb';
import Quote from '@/models/Quote';

export async function GET() {
  try {
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

    return Response.json({ quotes: serializedQuotes, stats });
  } catch (error) {
    console.error('Error fetching pending quotes:', error);
    return Response.json(
      { error: 'Failed to fetch pending quotes' },
      { status: 500 }
    );
  }
}