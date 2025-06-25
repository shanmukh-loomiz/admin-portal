
import React from 'react';

const ProductionTrackingSection = ({ steps }) => {
  return (
    <>
      {steps.map((step, index) => (
        <div key={index}>
          <h3 className="col-span-1 mt-4 text-gray-900 font-semibold">{step.name}</h3>

          <div className="col-span-1 mb-4 w-35">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={step.date}
                onChange={(e) => step.setDate(e.target.value)}
                className="w-full appearance-none border border-gray-300 text-sm px-4 py-2 rounded-md bg-white text-gray-700"
              />
            </div>
          </div>

          <div className="col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <div className="relative">
              <textarea
                value={step.comment}
                onChange={(e) => step.setComment(e.target.value)}
                rows={4}
                placeholder="Enter your comment..."
                className="w-full appearance-none border border-gray-300 text-sm px-4 py-2 rounded-md bg-white text-gray-700 resize-none"
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductionTrackingSection;
