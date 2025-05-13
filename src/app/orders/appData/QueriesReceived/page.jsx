'use client';
import React, { useState } from 'react';

const Queries = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState('');

  const handleActionClick = (type) => {
    setPopupType(type);
    setShowPopup(true);
    console.log(`${type} clicked`);
  };

  const rfqData = [
    {
      queryId: "QRY123",
      productId: "12345",
      productName: "Lorem ipsum elit in nulla",
      price: "$5–6/pc",
      targetPrice: "$4/pc",
      requestQuote: true,
      requestSamples: true,
      shippingAddress: "Almacén General Lázaro Cárdenas",
      modifications: "Yes, Lorem ipsum dolor sit amet consectetur. Neque sit quam mi tortor lacinia.",
      submitted: "12 Jan, 2025, 13:01",
    },
  ];

  return (
    <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-[#F2F4F7] rounded-[20px] mb-[50px]">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <img src="/LeftArrow.svg" alt="Back" />
          <div>
            <h2 className="text-xl font-semibold">Queries</h2>
            <p className="text-gray-500 text-sm">Through App</p>
          </div>
        </div>

        <div className="flex gap-4 ">
          {[
            { value: 24, label: "Queries received" },
            { value: 16, label: "Accepted" },
            { value: 8, label: "Samples Requests" },
            { value: 8, label: "Rejected" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#1570EF26] shadow-sm rounded-md px-6 py-2 text-center">
              <p className="text-[24px] font-semibold">{stat.value}</p>
              <p className="text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RFQ Cards */}
      {rfqData.map((rfq, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[20px] shadow-sm mt-20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Query ID</h3>
            <div className="flex gap-4">
              <button
                className="bg-[#1570EF] text-white px-8 py-1 rounded-full"
                onClick={() => handleActionClick('Accept')}
              >
                Accept
              </button>
              <button
                className="border text-gray-700 px-8 py-1 rounded-full"
                onClick={() => handleActionClick('Reject')}
              >
                Reject
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Product Image Placeholder */}
            <div className="w-[80px] h-[80px] bg-gray-200 rounded-md shrink-0" />

            {/* Details Section */}
            <div className="flex-1">
              <div className="gap-y-3 gap-x-6 text-sm text-gray-800 space-y-5">
                <p><span className="font-semibold">Product ID:</span> {rfq.productId}</p>
                <p><span className="font-semibold">Product name:</span> {rfq.productName}</p>
                <p><span className="font-semibold">Price:</span> {rfq.price}</p>
                <p><span className="font-semibold">Request for quote:</span> {rfq.requestQuote ? 'Yes' : 'No'}</p>
                <p><span className="font-semibold">Target price:</span> {rfq.targetPrice}</p>
                <p><span className="font-semibold">Request for samples:</span> {rfq.requestSamples ? 'Yes' : 'No'}</p>
                <p className="col-span-2">
                  <span className="font-semibold">Shipping address:</span> {rfq.shippingAddress}
                </p>
                <p className="col-span-2">
                  <span className="font-semibold">Modifications:</span> {rfq.modifications}
                </p>
              </div>

              <p className="text-right text-xs text-gray-500 mt-6 italic">
                Submitted on {rfq.submitted}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Popup */}
      {showPopup && (
        <div className=" ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px]  fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-white/30">
          <div className="bg-[#F2F4F7] rounded-xl p-6 shadow-lg w-[740px]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-md font-semibold text-gray-700">
                {popupType === 'Reject' ? 'Mention the reason for rejection' : 'Start Talking to the brand'}
              </h3>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700 text-lg">
                ✕
              </button>
            </div>

            {popupType === 'Reject' ? (
              <>
                <textarea
                  placeholder="Enter your comments here"
                  className="w-full p-4 border border-gray-300 rounded-md text-sm mb-4 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-[#0E1C2F] text-white px-6 py-2 rounded-full flex items-center gap-2">
                  Send <img src="/SendIcon.svg" alt="Send" />
                </button>
              </>
            ) : (
              <>
                <div className="text-sm text-left space-y-3 text-gray-700">
                  <div>
                    <span className="text-blue-600 font-medium">Brand Name</span>
                    <p>Max Collection</p>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Person of Contact</span>
                    <p>Wade Warren</p>
                    <p>COO</p>
                    <p>nevaeh.simmons@example.com</p>
                    <p>(209) 555-0104</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button className="bg-[#0E1C2F] text-white px-6 py-2 rounded-full flex items-center gap-2">
                    <img src="/CallLogo.svg" alt="Call" />
                    Make a call
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full flex items-center gap-2">
                    <img src="/EmailLogo.svg" alt="Email" />
                    Send email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;
