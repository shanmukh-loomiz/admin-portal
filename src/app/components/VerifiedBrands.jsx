// VerifiedBrands.jsx

import React from "react";

const brandData = [
  {
    brandName: "Brand name",
    companyName: "Company name",
    source: "Through app",
    status: "Verified",
    date: "12 Jan 2025",
  },
  {
    brandName: "Brand name",
    companyName: "Company name",
    source: "Through app",
    status: "Verified",
    date: "12 Jan 2025",
  },
  {
    brandName: "Brand name",
    companyName: "Company name",
    source: "Through app",
    status: "Verified",
    date: "12 Jan 2025",
  },
];

const VerifiedBrands = () => {
  return (
    <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-[#fff] rounded-[20px] mb-[50px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 ">
        <div className="flex">
          <img src="/LeftArrow.svg" alt="Back"  className="cursor-pointer"/>
          <div className="  gap-2 mt-2 ml-5">
          
            <h2 className="text-[28px] font-semibold ">Verified Brands</h2> 
            <p className="py-1 text-gray-500">
            All the verified brands through app and web are displayed here.
          </p>
          </div>
          
        </div>

        {/* Toggle Buttons */}
        <div className="flex border  rounded-full overflow-hidden ">
          <button className="px-6 py-2 text-sm text-gray-700 border-r cursor-pointer">From App</button>
          <button className="px-6 py-2 text-sm text-gray-700 cursor-pointer ">From Web</button>
        </div>
      </div>

      {/* Table Head */}
      <div className="grid grid-cols-4 px-4 py-2  font-semibold  border-b mt-20">
        <p>Brand Profile</p>
        <p>Status</p>
        <p>Verified on</p>
        <p className="text-right ">Actions</p>
      </div>

      {/* Table Rows */}
      {brandData.map((brand, index) => (
        <div
          key={index}
          className="grid grid-cols-4 px-4 py-4  items-center border-b border-gray-500 text-gray-800 mt-2 "
        >
          <div>
            <p className="font-medium  mb-1">{brand.brandName}</p>
            <p className="text-gray-600 mb-1">{brand.companyName}</p>
            <p className="text-gray-500 text-xs mt-1 mb-2 ">{brand.source}</p>
          </div>
          <p className="text-green-600 font-medium">{brand.status}</p>
          <p>{brand.date}</p>
          <div className="text-right">
            <button className="bg-[#1570EF] text-white px-6 py-2 rounded-full">
              View all
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerifiedBrands;
