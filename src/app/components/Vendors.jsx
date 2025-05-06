'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Vendors() {
  // Font classes from VendorManagement component
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch vendors from the API with filtering
  const fetchVendors = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (statusFilter !== 'All Status') {
        queryParams.append('status', statusFilter);
      }
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }
      
      // Make API call to the endpoint with query parameters
      let apiUrl = '/api/vendors';
      
      // Only add the query string if there are query parameters
      const queryString = queryParams.toString();
      if (queryString) {
        apiUrl += `?${queryString}`;
      }
      
      const response = await fetch(
        apiUrl,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setVendors(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch vendors');
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors();
  };

  // Navigate to vendor details page
  const navigateToVendorDetails = (vendorId) => {
    router.push(`/vendors/${vendorId}`);
  };

  // Fetch vendors when filters change
  useEffect(() => {
    fetchVendors();
  }, [statusFilter]); // Re-fetch when status filter changes
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchVendors();
  }, []); 

  // Status badge color mapping
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unverified':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="ml-[350px] mt-[60px] p-8 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px]">
      <div className="mb-8">
        <h1 className="text-[36px] font-[NSmedium] text-[#233B6E]">Vendors</h1>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-6">
          {/* Status Dropdown */}
          <div className="flex-shrink-0">
            <label htmlFor="status-filter" className="block text-[16px] font-[NSregular] text-gray-700 mb-2">Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white w-40"
            >
              <option>All Status</option>
              <option>Verified</option>
              <option>Under Review</option>
              <option>Unverified</option>
            </select>
          </div>

          {/* Search Bar */}
          <div className="flex-1">
            <label htmlFor="search-vendor" className="block text-[16px] font-[NSregular] text-gray-700 mb-2">Search</label>
            <form onSubmit={handleSearch} className="flex">
              <input
                id="search-vendor"
                type="text"
                placeholder="Search vendors by name, status, etc."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-l-md px-4 py-2 text-[16px] w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        /* Table */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4 text-[14px] font-[NSmedium] text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="py-3 px-4 text-[14px] font-[NSmedium] text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[14px] font-[NSmedium] text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="py-3 px-4 text-[14px] font-[NSmedium] text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr 
                    key={vendor.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigateToVendorDetails(vendor.id)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg mr-3">
                          {vendor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-[NSmedium] text-[16px] text-gray-800">{vendor.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClass(vendor.status)}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[16px] font-[NSregular] text-gray-600">{vendor.submitted}</td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => navigateToVendorDetails(vendor.id)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none text-[16px] font-[NSmedium]"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}