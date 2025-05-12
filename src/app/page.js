"use client";
import React from "react";

export default function Home() {
  return (
    <div className="ml-[350px] p-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Portal</h1>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-blue-700 font-medium">System Status Update</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Module Status</h2>
          
          <div className="grid gap-4">
            {/* Vendor Management - Ready */}
            <div className="border border-green-200 bg-green-50 rounded-md p-4 flex items-center">
              <div className="rounded-full bg-green-500 w-10 h-10 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Vendor Management</h3>
                <p className="text-green-700">Ready to use</p>
                <p className="text-sm text-gray-600 mt-1">
                  Click on "Vendor Management" in the sidebar to access this module.
                </p>
              </div>
            </div>
            
            {/* Other modules - Under Development */}
            {["Dashboard", "Orders", "Payments", "Chat", "Product", "Operations"].map((module) => (
              <div key={module} className="border border-gray-200 bg-gray-50 rounded-md p-4 flex items-center">
                <div className="rounded-full bg-gray-400 w-10 h-10 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{module}</h3>
                  <p className="text-gray-600">Under development</p>
                  <p className="text-sm text-gray-500 mt-1">
                    This module is coming soon. Stay tuned for updates.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h3 className="font-medium text-yellow-800 mb-2">Need assistance?</h3>
          <p className="text-gray-700">
            If you have any questions or need help navigating the portal, please contact the admin team.
          </p>
        </div>
      </div>
    </div>
  );
}