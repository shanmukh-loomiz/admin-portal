import React from 'react';

const WebsiteData = () => {
  return (
    <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-[#F2F4F7] rounded-[20px] mb-[50px]">
      {/* Title and Description */}
      <h2 className="text-[32px] font-semibold text-[#1570EF] mb-1">Website Data</h2>
      <p className=" text-[#1A1A1A] mb-6">These leads are through the Loomiz website</p>

      {/* Profiles Section */}
      <div className="mb-6 ">
        <h3 className="text-[20px] font-[Smedium]  font-semibold text-[#0E1C2F] mb-3">Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card title="Unverified profile" count="8" />
          <Card title="Verified brands" count="16" />
        </div>
      </div>

      {/* RFQs Section */}
      <div className="mb-6">
        <h3 className="text-[20px] font-[Smedium]  font-semibold text-[#0E1C2F] mb-3">RFQs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card title="Quote received" count="8" />
          <Card title="Orders approved" count="16" />
          <Card title="Rejected" count="9" />
        </div>
      </div>

      {/* Samples and Shipments Section */}
      <div>
        <h3 className="text-[20px] font-[Smedium]  font-semibold text-[#0E1C2F] mb-3">Samples and Shipments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card title="Samples Sent" count="8" />
          <Card title="Ready for shipment" count="16" />
        </div>
      </div>
    </div>
  );
};

// Card Component
const Card = ({ title, count }) => (
  <div className="bg-white rounded-lg p-5 shadow-sm flex justify-between items-start">
    <div>
      <p className=" text-[#1A1A1A] font-semibold font-medium mb-2 text-[18px]">{title}</p>
      <p className="text-4xl text-[#1570EF] font-semibold font-[Sbold]">{count}</p>
    </div>
    <button className="text-[#194185] text-sm font-medium">View all</button>
  </div>
);

export default WebsiteData;
