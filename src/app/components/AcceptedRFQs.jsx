'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const AcceptedRFQs = ({ initialQuotes = [], initialStats = { total: 0, pending: 0, accepted: 0, rejected: 0 } }) => {
  const router = useRouter();
  const [acceptedQuotes, setAcceptedQuotes] = useState(initialQuotes);
  const [stats, setStats] = useState(initialStats);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [expandedQuoteId, setExpandedQuoteId] = useState(null);

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Function to navigate to production tracking page
  const navigateToTracking = (quoteId) => {
    router.push(`/track/${quoteId}`);
  };

  // Function to handle back button click
  const handleBackClick = () => {
    router.back();
  };

  // Function to format file size for display
  const formatFileSize = (url) => {
    // In a real app, you'd calculate the actual file size
    // For now, we'll return a placeholder
    return "3.5 MB";
  };

  // Function to extract filename from URL
  const getFileName = (url) => {
    if (!url) return 'No file';
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  // Function to get all files for a quote
  const getAllFiles = (quote) => {
    const files = [];
    
    if (quote.techpackFile) {
      files.push({ 
        name: getFileName(quote.techpackFile),
        type: 'Tech Pack', 
        size: formatFileSize(quote.techpackFile),
        url: quote.techpackFile
      });
    }
    
    if (quote.productImagesFiles && quote.productImagesFiles.length > 0) {
      quote.productImagesFiles.forEach((url) => {
        files.push({ 
          name: getFileName(url),
          type: 'Product Image', 
          size: formatFileSize(url),
          url
        });
      });
    }
    
    if (quote.colorSwatchFiles && quote.colorSwatchFiles.length > 0) {
      quote.colorSwatchFiles.forEach((url) => {
        files.push({ 
          name: getFileName(url),
          type: 'Color Swatch', 
          size: formatFileSize(url),
          url
        });
      });
    }
    
    if (quote.fabricFiles && quote.fabricFiles.length > 0) {
      quote.fabricFiles.forEach((url) => {
        files.push({ 
          name: getFileName(url),
          type: 'Fabric', 
          size: formatFileSize(url),
          url
        });
      });
    }
    
    if (quote.miscellaneousFiles && quote.miscellaneousFiles.length > 0) {
      quote.miscellaneousFiles.forEach((url) => {
        files.push({ 
          name: getFileName(url),
          type: 'Miscellaneous', 
          size: formatFileSize(url),
          url
        });
      });
    }
    
    return files;
  };
  
  // Toggle expanded state for a quote
  const toggleQuoteExpand = (quoteId) => {
    if (expandedQuoteId === quoteId) {
      setExpandedQuoteId(null); // Collapse if already expanded
    } else {
      setExpandedQuoteId(quoteId); // Expand this quote
    }
  };

  return (
    <div className="ml-[340px] mt-[75px] p-8 min-h-[calc(100vh-75px)] mr-[50px] bg-[#F8F9FB] rounded-lg mb-[50px]">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === 'error' ? '❌' : '✅'}
            </span>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}
      
      {/* Header Section */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">Accepted RFQs</h2>
        </div>

        <div className="flex gap-5">
          <div className="bg-[#19418526] shadow-sm rounded-md px-6 py-3 text-center">
            <p className="text-[24px] font-semibold text-gray-800">{stats.total}</p>
            <p className="text-gray-600 font-medium text-sm">Total RFQs</p>
          </div>
          <div className="bg-[#19418526] shadow-sm rounded-md px-6 py-3 text-center">
            <p className="text-[24px] font-semibold text-gray-800">{stats.pending}</p>
            <p className="text-gray-600 font-medium text-sm">Pending</p>
          </div>
          <div className="bg-[#19418526] shadow-sm rounded-md px-6 py-3 text-center">
            <p className="text-[24px] font-semibold text-gray-800">{stats.accepted}</p>
            <p className="text-gray-600 font-medium text-sm">Accepted</p>
          </div>
          <div className="bg-[#19418526] shadow-sm rounded-md px-6 py-3 text-center">
             <p className="text-[24px] font-semibold text-gray-800">{stats.rejected}</p>
            <p className="text-gray-600 font-medium text-sm">Rejected</p>
          </div>
        </div>
      </div>

      {/* RFQ Cards */}
      {acceptedQuotes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm mt-6 text-center flex flex-col items-center justify-center min-h-[200px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="15"></line>
            <line x1="15" y1="9" x2="9" y2="15"></line>
          </svg>
          <p className="text-gray-500 mt-4 text-lg">No accepted RFQs found</p>
          <p className="text-gray-400 text-sm mt-2">All your accepted requests for quotes will appear here</p>
        </div>
      ) : (
        acceptedQuotes.map((quote) => {
          const files = getAllFiles(quote);
          
          return (
            <div key={quote._id} className="bg-white p-7 rounded-lg shadow-sm mt-6 mb-6 transition-all duration-300 ease-in-out hover:shadow-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-[#333333] text-lg">RFQ ID: <span className="text-[#194185]">{quote._id.substring(0, 8)}</span></h3>
                <button
                  className="bg-[#194185] text-white px-6 py-2 rounded-full hover:bg-[#0f2d60] transition-colors text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194185]"
                  onClick={() => navigateToTracking(quote._id)}
                >
                  <span>Production Tracking</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>

              <div className="text-[#194185] font-semibold text-[24px] mb-5">
                <span className="text-[16px] text-gray-500 mr-1">Price:</span>${quote.targetPrice}<span className="text-[16px] text-gray-500">/pc</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-500 text-sm block mb-1">Quantity</span>
                  <span className="font-medium text-gray-800">{quote.quantity} pcs</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-500 text-sm block mb-1">Sample</span>
                  <span className="font-medium text-gray-800">{quote.orderSample ? "Required" : "Not required"}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-500 text-sm block mb-1">Timeline</span>
                  <span className="font-medium text-gray-800">{quote.leadTime} days</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-500 text-sm block mb-1">Fabric</span>
                  <span className="font-medium text-gray-800">{quote.fabricComposition} - {quote.gsm}</span>
                </div>
              </div>

              <button 
                className={`text-white ${expandedQuoteId === quote._id ? 'bg-gray-600' : 'bg-[#194185]'} px-6 py-2 rounded-full transition-colors flex items-center gap-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#194185]`}
                onClick={() => toggleQuoteExpand(quote._id)}
              >
                {expandedQuoteId === quote._id ? 'View less' : 'View all details'}
                {expandedQuoteId === quote._id ? 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                  </svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                  </svg>
                }
              </button>
              
              {/* Documents section - Only show in collapsed view */}
              {expandedQuoteId !== quote._id && (
                <div className="mt-6">
                  <p className="font-medium text-sm mb-4 text-[#333333]">Documents uploaded</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.slice(0, 3).map((file, i) => (
                      <div key={i} className="border border-gray-200 bg-[#F9FAFB] rounded-md p-4 text-sm text-center h-[130px] flex flex-col justify-between">
                        <div>
                          <p className="text-gray-800 font-medium truncate">{file.name}</p>
                          <p className="text-gray-500 mt-1">{file.size}</p>
                        </div>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#194185] mt-2 inline-block hover:underline border border-[#194185] rounded-full px-3 py-1 text-xs font-medium hover:bg-[#19418510] transition-colors"
                        >
                          View file
                        </a>
                      </div>
                    ))}
                    {files.length === 0 && (
                      <div className="border border-gray-200 bg-[#F9FAFB] rounded-md p-4 text-sm text-center">
                        <p className="text-gray-800">No documents uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Expanded section with all details */}
              {expandedQuoteId === quote._id && (
                <div className="mt-6 transition-all animate-fadeIn">
                  <h4 className="font-semibold mb-6 text-[#333333] text-lg border-b pb-2">Complete RFQ Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    <div>
                      <h5 className="font-medium text-[#194185] border-b border-gray-100 pb-2 mb-3">Product Information</h5>
                      <ul className="mt-2 space-y-2 text-gray-700">
                        <li className="flex"><span className="font-medium w-40">Price:</span> <span>${quote.targetPrice}/pc</span></li>
                        <li className="flex"><span className="font-medium w-40">Quantity:</span> <span>{quote.quantity} pcs</span></li>
                        <li className="flex"><span className="font-medium w-40">Sample Required:</span> <span>{quote.orderSample ? "Yes" : "No"}</span></li>
                        {quote.sampleCount > 0 && (
                          <li className="flex"><span className="font-medium w-40">Sample Count:</span> <span>{quote.sampleCount}</span></li>
                        )}
                        <li className="flex"><span className="font-medium w-40">Lead Time:</span> <span>{quote.leadTime} days</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-[#194185] border-b border-gray-100 pb-2 mb-3">Fabric Details</h5>
                      <ul className="mt-2 space-y-2 text-gray-700">
                        <li className="flex"><span className="font-medium w-40">Composition:</span> <span>{quote.fabricComposition}</span></li>
                        <li className="flex"><span className="font-medium w-40">GSM:</span> <span>{quote.gsm}</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-[#194185] border-b border-gray-100 pb-2 mb-3">Shipping Information</h5>
                      <p className="mt-2 text-gray-700">{quote.shippingAddress}</p>
                    </div>
                    
                    {quote.orderNotes && (
                      <div>
                        <h5 className="font-medium text-[#194185] border-b border-gray-100 pb-2 mb-3">Additional Notes</h5>
                        <p className="mt-2 text-gray-700">{quote.orderNotes}</p>
                      </div>
                    )}
                    
                    {/* Production status information */}
                    <div className="col-span-2">
                      <h5 className="font-medium text-[#194185] border-b border-gray-100 pb-2 mb-3">Production Status</h5>
                      <div className="bg-green-50 p-4 rounded-md border border-green-100">
                        <p className="text-green-700 font-medium">Order accepted and ready for production</p>
                        <p className="text-sm text-gray-700 mt-1">
                          Click "Production Tracking" to view detailed progress of this order
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="font-medium text-[#194185] mb-4 border-b border-gray-100 pb-2">All Documents</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {files.map((file, i) => (
                      <div key={i} className="border border-gray-200 bg-[#F9FAFB] rounded-md p-4 text-sm hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[#194185] font-medium px-2 py-1 bg-[#19418515] rounded-md text-xs">{file.type}</span>
                        </div>
                        <p className="text-gray-800 break-words font-medium mb-1">{file.name}</p>
                        <p className="text-gray-500 mb-3">{file.size}</p>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#194185] inline-block hover:underline border border-[#194185] rounded-full px-3 py-1 text-xs font-medium hover:bg-[#19418510] transition-colors"
                        >
                          View file
                        </a>
                      </div>
                    ))}
                    {files.length === 0 && (
                      <div className="border border-gray-200 bg-[#F9FAFB] rounded-md p-6 text-sm col-span-full text-center">
                        <p className="text-gray-800">No documents uploaded with this RFQ</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-right text-xs text-gray-500 mt-5 italic">
                Submitted on <span className="font-medium">{format(new Date(quote.createdAt), 'dd MMM, yyyy')} </span> 
                <span className="text-[#194185]">{format(new Date(quote.createdAt), 'HH:mm')}</span>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AcceptedRFQs;