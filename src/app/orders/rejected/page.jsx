// app/rejected-orders/page.js
'use client';
import { useState, useEffect } from 'react';
import RejectedRFQs from '../../components/RejectedRFQs';
import Loader from '../../components/Loader';

export default function RejectedOrders() {
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRejectedQuotes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/orders/rejected-quotes');
        
        if (!response.ok) {
          throw new Error('Failed to fetch rejected quotes');
        }
        
        const data = await response.json();
        setQuotes(data.quotes);
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching rejected quotes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRejectedQuotes();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="ml-[340px] mt-[75px] p-8 min-h-[calc(100vh-75px)] mr-[50px] bg-[#F8F9FB] rounded-lg mb-[50px]">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center flex flex-col items-center justify-center min-h-[200px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <p className="text-red-500 mt-4 text-lg">Error loading rejected RFQs</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-[#194185] text-white px-6 py-2 rounded-full hover:bg-[#0f2d60] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <RejectedRFQs initialQuotes={quotes} initialStats={stats} />;
}