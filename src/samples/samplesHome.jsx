"use client";
import { useRouter } from "next/navigation";
import React from "react";

const sampleData = [
  {
    queryId: "Query ID",
    productId: "12345",
    productName: "Lorem ipsum elit in nulla",
    price: "$5-6/pc",
    shippingAddress: "Almacén General Lázaro Cardenas",
    modifications: "Yes, Lorem ipsum dolor sit amet consectetur. Neque sit quam mi tortor lacinia.",
  },
  {
    queryId: "Query ID",
    productId: "12345",
    productName: "Lorem ipsum elit in nulla",
    price: "$5-6/pc",
    shippingAddress: "Almacén General Lázaro Cardenas",
    modifications: "Yes, Lorem ipsum dolor sit amet consectetur. Neque sit quam mi tortor lacinia.",
  },
];

const SamplesHome = () => {
  const router = useRouter();

  const handleSendSample = () => {
    router.push("/send-sample"); // Route to the detailed send sample page (create this page later)
  };

  return (
    <div className="ml-[290px] mt-[75px] p-6 min-h-[calc(100vh-75px)] bg-[#F7FAFC] font-[Satoshi]">
      <div className="flex items-center justify-between">
        <div>
          <button>
            <img src="/LeftArrow.svg" alt="back" className="w-5 h-5 inline-block mr-2" />
          </button>
          <span className="text-[22px] font-semibold">Samples</span>
          <p className="text-gray-500 text-sm mt-1">Through app</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#E0EDFF] px-4 py-2 rounded-md text-center">
            <p className="text-[20px] font-semibold">16</p>
            <p className="text-sm text-gray-600">Sample requested</p>
          </div>
          <div className="bg-[#E0EDFF] px-4 py-2 rounded-md text-center">
            <p className="text-[20px] font-semibold">8</p>
            <p className="text-sm text-gray-600">Sample sent</p>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {sampleData.map((sample, index) => (
        <div
          key={index}
          className="bg-white border border-[#8A95A8] rounded-lg p-5 mb-6 "
        >
          <p className="text-[16px] font-medium mb-4">{sample.queryId}</p>

          <div className="flex flex-wrap items-start gap-4 mt-10">
            <div className="w-20 h-20 bg-gray-200 rounded-md" />

            <div className="flex-1 mb-4">
              <p><strong>Product ID:</strong> {sample.productId}</p>
              <p><strong>Product name:</strong> {sample.productName}</p>
              <p><strong>Price:</strong> {sample.price}</p>
              <p><strong>Shipping address:</strong> {sample.shippingAddress}</p>
              <p><strong>Modifications:</strong> {sample.modifications}</p>
            </div>

            
          </div>
          <button
              onClick={handleSendSample}
              className="bg-[#1570EF] font-[Satoshi] hover:bg-[#175cd3] text-[#F5FAFF] text-sm font-medium px-5 py-2 rounded-full mt-4 sm:mt-0"
            >
              Send sample
            </button>
        </div>
      ))}
    </div>
  );
};

export default SamplesHome;
