"use client";
import React, { useState, useEffect } from "react";
import ProductionTrackingSection from './order-tracking/ProductionTracking'

const OrderTrackingStepsHome = ({ orderData }) => {

const [productionSteps, setProductionSteps] = useState({
  cutting: { date: '', comment: '' },
  stitching: { date: '', comment: '' },
  washing: { date: '', comment: '' },
  finishing: { date: '', comment: '' },
});

  
 const steps = ["cutting", "stitching", "washing", "finishing"].map((step) => ({
  name: step.charAt(0).toUpperCase() + step.slice(1),
  date: productionSteps[step].date,
  setDate: (date) =>
    setProductionSteps((prev) => ({
      ...prev,
      [step]: { ...prev[step], date },
    })),
  comment: productionSteps[step].comment,
  setComment: (comment) =>
    setProductionSteps((prev) => ({
      ...prev,
      [step]: { ...prev[step], comment },
    })),
}));
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

  // Status mapping
  const statusMapping = {
    "Not Started": { color: "bg-gray-200", textColor: "text-gray-500", icon: "○" },
    "In Progress": { color: "bg-blue-100", textColor: "text-blue-600", icon: "◔" },
    "Completed": { color: "bg-green-100", textColor: "text-green-600", icon: "●" }
  };

  // Initialize statuses from orderData or default values
  const [statuses, setStatuses] = useState(() => {
    if (!orderData) {
      return {
        "Sample Confirmation": { status: "Not Started", date: "--" },
        "Fabric Inhoused": { status: "Not Started", date: "--" },
        "Fabric Quality Check": { status: "Not Started", date: "--" },
        "Production": { status: "Not Started", date: "--" },
        "Packaging": { status: "Not Started", date: "--" },
        "Quality Check": { status: "Not Started", date: "--" },
        "Out For Delivery": { status: "Not Started", date: "--" },
        "Confirm Payment Terms": { status: "Not Started", date: "--" },
      };
    }

    // Initialize from orderData if available
    const initialStatuses = {};
    
    // Convert from snake_case to display format
    const stepMapping = {
      "sampleConfirmation": "Sample Confirmation",
      "fabricInhoused": "Fabric Inhoused",
      "fabricQualityCheck": "Fabric Quality Check",
      "production": "Production",
      "packaging": "Packaging",
      "qualityCheck": "Quality Check",
      "outForDelivery": "Out For Delivery",
      "confirmPaymentTerms": "Confirm Payment Terms"
    };

    // Create status object based on production steps
    trackingSteps.forEach(step => {
      const dbStepKey = Object.keys(stepMapping).find(key => stepMapping[key] === step);
      
      const status = orderData.productionSteps && 
                    orderData.productionSteps[dbStepKey] || "Not Started";
      
      // Generate dates for steps based on their status
      let dateStr = "--";
      if (status !== "Not Started") {
        // For active steps, create a date string based on createdAt plus some days
        const stepIndex = trackingSteps.indexOf(step);
        const baseDate = new Date(orderData.createdAt);
        baseDate.setDate(baseDate.getDate() + stepIndex * 2); // Add 2 days per step
        
        dateStr = baseDate.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }
      
      initialStatuses[step] = { status, date: dateStr };
    });

    return initialStatuses;
  });

  const [selectedStep, setSelectedStep] = useState("Sample Confirmation");
  const [selectedStatus, setSelectedStatus] = useState("Not Started");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStep, setPendingStep] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update selected status when selected step changes
  useEffect(() => {
    if (statuses[selectedStep]) {
      setSelectedStatus(statuses[selectedStep].status);
    }
  }, [selectedStep, statuses]);

  const handleUpdateClick = () => {
    setPendingStep(selectedStep);
    setPendingStatus(selectedStatus);
    setShowConfirm(true);
  };

  const confirmUpdateStatus = async () => {
 setProductionSteps({
  cutting: { date: '', comment: '' },
  stitching: { date: '', comment: '' },
  washing: { date: '', comment: '' },
  finishing: { date: '', comment: '' },
  });
    const currentDate = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    setIsLoading(true);

    try {
      // Update the database
      if (orderData && orderData._id) {
        // Convert step name to the database field name
        const stepKeyMapping = {
          "Sample Confirmation": "sampleConfirmation",
          "Fabric Inhoused": "fabricInhoused",
          "Fabric Quality Check": "fabricQualityCheck",
          "Production": "production",
          "Packaging": "packaging",
          "Quality Check": "qualityCheck",
          "Out For Delivery": "outForDelivery",
          "Confirm Payment Terms": "confirmPaymentTerms"
        };

        const dbStepKey = stepKeyMapping[pendingStep];
        
        // Update the order in the database
        const response = await fetch(`/api/tracking/order-status/${orderData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            step: dbStepKey,
            status: pendingStatus,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update order status');
        }

        // Parse response
        const result = await response.json();
        
        // If successful, update UI
        if (result.success) {
          // Only update date if status is changing from "Not Started"
          const previousStatus = statuses[pendingStep].status;
          let newDate = statuses[pendingStep].date;
          
          if (previousStatus === "Not Started" && pendingStatus !== "Not Started") {
            newDate = currentDate;
          }
          
          setStatuses((prev) => ({
            ...prev,
            [pendingStep]: {
              status: pendingStatus,
              date: newDate,
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
      setPendingStep(null);
      setPendingStatus(null);
    }
  };

  const cancelUpdate = () => {
    setShowConfirm(false);
    setPendingStep(null);
    setPendingStatus(null);
  };

  if (!orderData) {
    return <div className="ml-[290px] mt-[75px] p-10 bg-white font-[Satoshi]">Loading order data...</div>;
  }

  return (
    <div className="ml-[340px] mt-[75px] p-8 min-h-[calc(100vh-75px)] mr-[50px] bg-[#F8F9FB] rounded-lg mb-[50px]">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Order #{orderData.orderNumber || "N/A"}</h1>
        <div className="px-3 py-1 rounded text-sm font-medium bg-blue-50 text-blue-700">
          {orderData.status || "Processing"}
        </div>
      </div>

      {/* Product Info */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-medium mb-4">Order Details</h2>
        <div className="flex gap-6">
          <div className="w-20 h-20 bg-white rounded-md flex-shrink-0 border">
            {orderData.designImage && (
              <img 
                src={orderData.designImage} 
                alt="Product design" 
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm flex-grow">
            <div className="flex justify-between md:block border-b md:border-0 py-2 md:py-0">
              <span className="font-semibold text-gray-600">Product ID</span>
              <span className="font-medium">{orderData._id || "N/A"}</span>
            </div>

            <div className="flex justify-between md:block border-b md:border-0 py-2 md:py-0">
              <span className="font-semibold text-gray-600">Date Accepted</span>
              <span className="font-medium">{orderData.Completed || "N/A"}</span>
            </div>

            <div className="flex justify-between md:block border-b md:border-0 py-2 md:py-0">
              <span className="font-semibold text-gray-600">Price</span>
              <span className="font-medium">{orderData.price ? `${orderData.price}/pc` : "N/A"}</span>
            </div>

            <div className="flex justify-between md:block border-b md:border-0 py-2 md:py-0">
              <span className="font-semibold text-gray-600">Number Of Pieces</span>
              <span className="font-medium">{orderData.noOfPieces || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Steps Table */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Production Status</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">Step</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 border-b">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {trackingSteps.map((step, index) => {
                const stepStatus = statuses[step]?.status || "Not Started";
                const statusStyle = statusMapping[stepStatus];
                
                return (
                  <tr 
                    key={step} 
                    className={`border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                      selectedStep === step ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedStep(step)}
                  >
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center 
                          text-lg mr-3 ${statusStyle.textColor}`}>
                          {statusStyle.icon}
                        </div>
                        <span>{step}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.color} ${statusStyle.textColor}`}>
                        {stepStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {statuses[step]?.date || "--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Form */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Update Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Step</label>
            <div className="relative">
              <select
                value={selectedStep}
                onChange={(e) => setSelectedStep(e.target.value)}
                className="w-full appearance-none border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md bg-white"
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
          </div>
          
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full appearance-none border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md bg-white"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          </div>
      { selectedStep=="Production" &&     <ProductionTrackingSection steps={steps}/> }
          
          <div className="flex items-end mt-4" >
            <button
              onClick={handleUpdateClick}
              className="bg-[#194185] hover:bg-blue-800 text-white px-6 py-2 rounded-md text-sm font-medium w-full"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Status"}
            </button>         
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Update</h3>
            <p className="mb-6">
              Are you sure you want to update <strong>{pendingStep}</strong> to <strong>{pendingStatus}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelUpdate}
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmUpdateStatus}
                className="px-4 py-2 rounded-md bg-[#194185] hover:bg-blue-800 text-white text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Confirm Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingStepsHome;
