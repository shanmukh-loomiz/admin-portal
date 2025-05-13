'use client';
import React, { useState } from 'react';

const RFQReceived = () => {
  const [showPopup, setShowPopup] = useState(false); // popup state (you'll build the UI later)
  const [popupType, setPopupType] = useState(''); // "Accept" or "Reject"

  const handleActionClick = (type) => {
    setPopupType(type);
    setShowPopup(true);
    console.log(`${type} clicked`); // Placeholder
  };

  const rfqData = [
    {
      price: "$10/pc",
      quantity: "2000 pcs",
      sampleRequired: true,
      timeline: "45 days",
      fabric: "GSM",
      documents: [
        { name: "Design.pdf", size: "3.5 MB" },
        { name: "Design.pdf", size: "3.5 MB" },
      ],
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
            <h2 className="text-xl font-semibold">RFQ received</h2>
            <p className="text-gray-500 text-sm">Through web</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#1570EF26] shadow-sm rounded-md px-4 py-2 text-center">
            <p className="text-[24px] font-semibold">24</p>
            <p className="text-gray-500">RFQ received</p>
          </div>
          <div className="bg-[#1570EF26] shadow-sm rounded-md px-8 py-2 text-center">
            <p className="text-[24px] font-semibold">16</p>
            <p className="text-gray-500">Accepted</p>
          </div>
          <div className="bg-[#1570EF26] shadow-sm rounded-md px-8 py-2 text-center">
            <p className="text-[24px] font-semibold">8</p>
            <p className="text-gray-500">Rejected</p>
          </div>
        </div>
      </div>

      {/* RFQ Cards */}
      {rfqData.map((rfq, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[20px] shadow-sm mt-20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">RFQ ID</h3>
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

          <div className="text-blue-600 font-semibold text-[20px] mb-4">{rfq.price}</div>
          <ul className="text-gray-700 text-sm space-y-2 mb-6">
            <li>{rfq.quantity}</li>
            <li>{rfq.sampleRequired ? "Sample required" : "No sample required"}</li>
            <li>Timeline: {rfq.timeline}</li>
            <li>Fabric: {rfq.fabric}</li>
          </ul>

          <button className="text-white bg-[#1570EF] px-8 py-2 rounded-full mb-6">View all</button>

          <div>
            <p className="font-medium text-sm mb-2">Documents uploaded</p>
            <div className="flex gap-4 flex-wrap">
              {rfq.documents.map((doc, i) => (
                <div key={i} className="border border-gray-200 bg-[#F9FAFB] rounded-md p-4 text-sm text-center w-[287px] h-[116px]">
                  <p className="text-gray-800">{doc.name}</p>
                  <p className="text-gray-500">{doc.size}</p>
                  <a href="#" className="text-blue-600 mt-2 inline-block">View file</a>
                </div>
              ))}
            </div>
          </div>

          <p className="text-right text-xs text-gray-500 mt-4 italic">
            Submitted on {rfq.submitted}
          </p>
        </div>
      ))}

      {/* Placeholder Popup (to be replaced with actual UI) */}
      {showPopup && (
  <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-white/30">
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

export default RFQReceived;
