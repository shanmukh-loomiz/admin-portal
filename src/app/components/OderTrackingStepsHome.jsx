"use client";
import React, { useState } from "react";

const OrderTrackingStepsHome = () => {
  const trackingSteps = [
    "Sample Confirmation",
    "Fabric Inhoused",
    "Fabric Quality Check",
    "Production",
    "Packaging",
    "Quality Check",
    "Out For Delivery",
    "Confirm Payment Terms",
  ];

  const [statuses, setStatuses] = useState({
    "Sample Confirmation": { active: true, date: "12 Jan 2025, 12:00" },
    "Fabric Inhoused": { active: false, date: "--" },
    "Fabric Quality Check": { active: false, date: "--" },
    "Production": { active: false, date: "--" },
    "Packaging": { active: false, date: "--" },
    "Quality Check": { active: false, date: "--" },
    "Out For Delivery": { active: false, date: "--" },
    "Confirm Payment Terms": { active: false, date: "--" },
  });

  const [selectedStep, setSelectedStep] = useState("Sample Confirmation");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStep, setPendingStep] = useState(null);

  const handleUpdateClick = () => {
    setPendingStep(selectedStep);
    setShowConfirm(true);
  };

  const confirmUpdateStatus = () => {
    const currentDate = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setStatuses((prev) => ({
      ...prev,
      [pendingStep]: {
        active: true,
        date: pendingStep === "Query received"
          ? `Received on ${currentDate} IST`
          : currentDate,
      },
    }));

    setShowConfirm(false);
    setPendingStep(null);
  };

  const cancelUpdate = () => {
    setShowConfirm(false);
    setPendingStep(null);
  };

  const activeStepIndex = trackingSteps.findIndex((step) => statuses[step]?.active);

  return (
    <div className="ml-[290px] mt-[75px] p-10 bg-white font-[Satoshi]">
      <p className="text-lg font-semibold mb-6">Query ID</p>

      {/* Product Info */}
      <div className="flex gap-6 mb-8">
        <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0"></div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><span className="font-semibold text-[#1A1A1A] text-[16px]">Product ID</span></div>
          <div className="font-medium text-[#1A1A1A] text-[16px]">12345</div>

          <div><span className="font-semibold text-[#1A1A1A] text-[16px]">Product name</span></div>
          <div className="font-medium text-[#1A1A1A] text-[16px]">Lorem ipsum elit in nulla</div>

          <div><span className="font-semibold text-[#1A1A1A] text-[16px]">Price</span></div>
          <div className="font-medium text-[#1A1A1A] text-[16px]">$5-6/pc</div>

          <div><span className="font-semibold text-[#1A1A1A] text-[16px]">Shipping address</span></div>
          <div className="font-medium text-[#1A1A1A] text-[16px]">Almacén General Lázaro Cárdenas</div>

          <div><span className="font-semibold text-[#1A1A1A] text-[16px]">Modifications</span></div>
          <div className="flex flex-col">
            <span className="font-medium text-[#1A1A1A] text-[16px]">Yes, Lorem ipsum dolor sit amet consectetur.</span>
            <span className="font-medium text-[#1A1A1A] text-[16px]">Neque sit quam mi tortor lacinia.</span>
          </div>
        </div>
      </div>

      {/* Tracking Steps */}
      <div className="relative mb-10 mt-20">
        <div className="absolute top-3 left-10 right-10 h-0.5 bg-gray-300"></div>
        <div 
          className="absolute top-3 left-4 h-0.5 bg-green-500"
          style={{ width: `${activeStepIndex > 0 ? (activeStepIndex / (trackingSteps.length - 1)) * 100 : 0}%` }}
        ></div>

        <div className="flex justify-between relative">
          {trackingSteps.map((step) => (
            <div className="flex flex-col items-center" key={step}>
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10
                ${statuses[step]?.active ? "bg-green-500 text-white" : "bg-gray-200"}`}
              >
                {statuses[step]?.active && "✓"}
              </div>
              <p className="text-xs font-medium mt-2 text-center max-w-24">{step}</p>
              <p className="text-xs text-gray-500 mt-1">{statuses[step]?.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Update Section */}
      <div className="flex gap-3 items-center">
        <div className="relative">
          <select
            value={selectedStep}
            onChange={(e) => setSelectedStep(e.target.value)}
            className="appearance-none border border-gray-300 text-sm px-4 py-2 pr-8 rounded-full bg-white"
          >
            {trackingSteps.map((step) => (
              <option key={step} value={step}>{step}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        <button
          onClick={handleUpdateClick}
          className="bg-[#194185] hover:bg-blue-900 text-white text-sm px-10 py-2 rounded-full"
        >
          Update
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className=" ml-[290px] mt-[75px] p-6 min-h-[calc(100vh-75px)] bg-[#F7FAFC] font-[Satoshi] fixed inset-0 bg-black/20 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Update</h3>
            <p className="mb-6">Are you sure you want to update the status to <strong>{pendingStep}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelUpdate}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdateStatus}
                className="px-4 py-2 rounded bg-[#194185] hover:bg-blue-900 text-white text-sm"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingStepsHome;
