// app/api/accepted-quotes/route.js
import dbConnect from '../../../lib/mongodb';
import Quote from '@/models/Quote';

export async function GET() {
  try {
    await dbConnect();
    
    const acceptedQuotes = await Quote.find({ status: "Accepted" })
      .sort({ createdAt: -1 })
      .lean();
    
    const total = await Quote.countDocuments();
    const pending = await Quote.countDocuments({ status: "Pending" });
    const accepted = await Quote.countDocuments({ status: "Accepted" });
    const rejected = await Quote.countDocuments({ status: "Rejected" });
    
    const stats = { total, pending, accepted, rejected };
    
    const serializedQuotes = acceptedQuotes.map(quote => ({
      ...quote,
      _id: quote._id.toString(),
      createdAt: quote.createdAt.toISOString(),
    }));
    
    return Response.json({ quotes: serializedQuotes, stats });
  } catch (error) {
    console.error('Error fetching accepted quotes:', error);
    return Response.json(
      { error: 'Failed to fetch accepted quotes' },
      { status: 500 }
    );
  }
}