'use client';

import { useState } from 'react';

export default function BrandVerification() {
  const [statusFilter, setStatusFilter] = useState('All Status');

  const suppliers = [
    { name: 'Nike Sports', status: 'Verified', submitted: 'Jan 15, 2025', documents: 'View Files' },
    { name: 'Adidas', status: 'Under Review', submitted: 'Feb 1, 2025', documents: 'View Files' },
    { name: 'Puma', status: 'Unverified', submitted: '-', documents: 'No files' },
  ];

  return (
    <div className="ml-[340px] mt-[75px] p-6 bg-[#F9F9F9] min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px]">
      {/* Filter and Search */}
      <div className="flex items-center gap-10 mb-4 ">
        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        >
          <option>All Status</option>
          <option>Verified</option>
          <option>Under Review</option>
          <option>Unverified</option>
        </select>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search brands..."
          className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left mt-10 ">
          <thead className="text-gray-500 border-b border-gray-400 ">
            <tr>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4">Documents</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4 px-4 flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  {supplier.name}
                </td>
                <td className="py-4 px-4 ">
                  <span className={`px-4 py-2 rounded-full  font-medium
                    ${supplier.status === 'Verified' ? 'bg-gray-100 text-gray-700'
                      : supplier.status === 'Under Review' ? 'bg-gray-100 text-gray-700'
                      : 'bg-gray-100 text-gray-700'}`}>
                    {supplier.status}
                  </span>
                </td>
                <td className="py-4 px-4 ">{supplier.submitted}</td>
                <td className="py-4 px-4  text-[#525252]  cursor-pointer">{supplier.documents}</td>
                <td className="py-4 px-4  text-[#525252]">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
