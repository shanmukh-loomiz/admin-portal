"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VendorDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [mainImage, setMainImage] = useState(null);
  const [smallImages, setSmallImages] = useState([null, null, null]);
  const [successMessage, setSuccessMessage] = useState('');

  const certificates = ["Sedex", "BSCI", "FAMA", "OCS", "ISO", "BCI", "FA8000", "GOTS", "GRS", "CT-PAT", "WRAP", "QMS"];

  // API base URL - create an environment variable for this in production
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/vendors';

  // Fetch vendor data
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/vendors/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        
        const response = await res.json();
        console.log(response);
        
        if (response.success) {
          // Update the vendor state with the data from the response
          setVendor(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch vendor data');
        }
      } catch (err) {
        console.error('Fetch failed:', err);
        setError(err.message);
      } finally {
        // Make sure to set loading to false regardless of success or failure
        setLoading(false);
      }
    };
    
    if (id) {
      fetchVendor();
    }
  }, [id]);
  

  // Go back to vendors list
  const handleBackToList = () => {
    router.push('/vendors');
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show image preview immediately
      setMainImage(URL.createObjectURL(file));
      
      // Upload image to your existing backend
      const formData = new FormData();
      formData.append('mainImage', file);
      formData.append('vendorId', id);
      
      try {
        const response = await fetch(`${API_BASE_URL}/company/upload-main-image`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          let errorMessage = `Error: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If parsing JSON fails, use the default error message
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to upload image');
        }
        
        // Update with the real URL from server
        if (data.imageUrl) {
          setMainImage(data.imageUrl);
        }

        // Show success message
        setSuccessMessage('Main image uploaded successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error uploading image:', err);
        // You might want to show an error notification here
      }
    }
  };

  const handleSmallImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Show image preview immediately
      const newImages = [...smallImages];
      newImages[index] = URL.createObjectURL(file);
      setSmallImages(newImages);
      
      // Upload image to your existing backend
      const formData = new FormData();
      formData.append('smallImage', file);
      formData.append('vendorId', id);
      formData.append('index', index);
      
      try {
        const response = await fetch(`${API_BASE_URL}/company/upload-small-image`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          let errorMessage = `Error: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If parsing JSON fails, use the default error message
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Failed to upload image');
        }
        
        // Update with the real URL from server
        if (data.imageUrl) {
          const updatedImages = [...smallImages];
          updatedImages[index] = data.imageUrl;
          setSmallImages(updatedImages);
        }

        // Show success message
        setSuccessMessage('Image uploaded successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error uploading image:', err);
        // You might want to show an error notification here
      }
    }
  };
  
  // Updated to use specific API endpoints for each status
  const updateVendorStatus = async (status) => {
    try {
      // Use different endpoints based on status
      let endpoint = '';
      if (status === 'approved') {
        endpoint = '/api/vendors/approve';
      } else if (status === 'rejected') {
        endpoint = '/api/vendors/reject';
      } else if (status === 'under-review') {
        endpoint = '/api/vendors/under-review';
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          vendorId: id,
          status
        }),
      });
      
      if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use the default error message
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update vendor status');
      }
      
      // Update local state
      setVendor(prev => ({ ...prev, status }));
      
      // Show success message
      let statusMessage = 'Vendor status updated';
      if (status === 'approved') statusMessage = 'Vendor approved successfully';
      else if (status === 'rejected') statusMessage = 'Vendor rejected';
      else if (status === 'under-review') statusMessage = 'Vendor marked as under review';
      
      setSuccessMessage(statusMessage);
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Error updating vendor status:', err);
      // You might want to show an error notification here
    }
  };

  // Helper function to get status text
  const getStatusText = (status) => {
    if (!status || status === 'pending') return 'Pending';
    if (status === 'approved') return 'Vendor Verified';
    if (status === 'rejected') return 'Vendor Rejected';
    if (status === 'under-review') return 'Under Review';
    return status;
  };

  // Helper function to get production status text
  const getProductionStatusText = (status) => {
    if (!status || status === 'pending') return 'Production Not Started';
    return status;
  };

  // Helper function to get order status text
  const getOrderStatusText = (status) => {
    if (!status || status === 'pending') return 'Order Pending';
    return status;
  };

  if (loading) {
    return (
      <div className="ml-[340px] mt-[75px] p-6 flex justify-center items-center min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px]">
        <div className="text-center text-gray-500">No vendor found</div>
      </div>
    );
  }

  return (
    <div className="ml-[340px] mt-[75px] p-6 bg-[#fff] min-h-[calc(100vh-75px)] mr-[50px] rounded-[20px] mb-[50px]">

      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBackToList}
          className="mr-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-[36px] font-[NSmedium] text-[#233B6E]">
          {vendor.company?.name || "VENDOR FACILITY"}
        </h1>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Main Section */}
      <div className="flex mt-6 gap-6">

        {/* Left Side */}
        <div className="flex flex-col items-center w-2/5">

          {/* Large Image Upload */}
          <div className="relative w-[410px] h-[410px] rounded-md mb-4 flex items-center justify-center overflow-hidden bg-white">
            {mainImage ? (
              <img src={mainImage} alt="Main Upload" className="w-full h-full object-contain" />
            ) : (
              <img src="/VendorLogo.svg" alt="Default Large" className="w-[410px] h-[410px] object-contain" />
            )}
            <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" onChange={handleMainImageChange} />
          </div>

          {/* Small Images */}
          <div className="flex gap-4 mb-6">
            {smallImages.map((img, index) => (
              <div key={index} className="relative w-[120px] h-[120px] rounded-md overflow-hidden flex items-center justify-center bg-white">
                {img ? (
                  <img src={img} alt="Small Upload" className="w-full h-full object-contain" />
                ) : (
                  <img src="/VendorLogo.svg" alt="Default Small" className="w-[120px] h-[120px] object-contain" />
                )}
                <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleSmallImageChange(index, e)} />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full font-[NSregular] text-[16px] text-[#979797]">
            <button 
              className="border border-gray-300 py-2 rounded-md hover:bg-gray-100"
              onClick={() => updateVendorStatus('approved')}
            >
              Approve Manufacturer
            </button>
            <button 
              className="border border-gray-300 py-2 rounded-md hover:bg-gray-100"
              onClick={() => updateVendorStatus('rejected')}
            >
              Reject Manufacturer
            </button>
            <button 
              className="border border-gray-300 py-2 rounded-md hover:bg-gray-100"
              onClick={() => updateVendorStatus('under-review')}
            >
              Manufacturer Under Review
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-3/5">

          {/* Status Tabs - Display vendor status information */}
          <div className="flex gap-2 mb-6 font-[NSregular] text-[14px] text-[#262626]">
            <span className={`px-3 py-1 rounded-[20px] bg-[#E5E7EB]`}>
              {getStatusText(vendor.status)}
            </span>
            <span className={`px-3 py-1 rounded-[20px] bg-[#E5E7EB]`}>
              {getProductionStatusText(vendor.productionStatus)}
            </span>
            <span className={`px-3 py-1 rounded-[20px] bg-[#E5E7EB]`}>
              {getOrderStatusText(vendor.orderStatus)}
            </span>
          </div>

          {/* Supplier Details */}
          <div className="mt-6">
            <h2 className="font-semibold text-[#233B6E] mb-2 font-[NSmedium]">Supplier Details</h2>
            <div className="grid grid-cols-2 gap-y-4">
              {/* Details Grid */}
              <div className="flex">
                <div className="font-semibold w-32">Contact Person:</div>
                <div>{`${vendor.primaryContact?.firstName || ''} ${vendor.primaryContact?.lastName || ''}`}</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Contact No.:</div>
                <div>{vendor.primaryContact?.phoneNumber || 'N/A'}</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Facility Code:</div>
                <div>{vendor._id?.substring(0, 8).toUpperCase() || 'N/A'}</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Location:</div>
                <div>{`${vendor.company?.address?.city || ''}, ${vendor.company?.address?.country || ''}`}</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-6">
            <h2 className="font-bold text-[#1C3366] mb-2">About</h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div className="flex">
                <div className="font-semibold w-32">Established:</div>
                <div>{vendor.establishedYear || 'N/A'}</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Machines:</div>
                <div>{vendor.company?.numberOfMachines || 'N/A'}</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Capacity:</div>
                <div>{vendor.company?.utilizationCapacity || 'N/A'}</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Turn Over:</div>
                <div>₹{vendor.company?.turnover ? `${vendor.company.turnover} Crores` : 'N/A'}</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Occupied:</div>
                <div>{vendor.company?.utilizationCapacity === 'High' ? '80%' : 
                      vendor.company?.utilizationCapacity === 'Medium' ? '50%' : 
                      vendor.company?.utilizationCapacity === 'Low' ? '30%' : 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Current Customers */}
          <div className="mt-6">
            <h2 className="font-bold text-[#1C3366] mb-2">Current Customers</h2>
            <div className="flex gap-2">
              {(vendor.company?.prominentBrands || []).slice(0, 4).map((brand, idx) => (
                <div key={idx} className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center bg-white">
                  <span className="text-gray-600 text-xs text-center p-1">{brand}</span>
                </div>
              ))}
              {Array(Math.max(0, 4 - (vendor.company?.prominentBrands?.length || 0))).fill(0).map((_, idx) => (
                <div key={idx + 10} className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center bg-[#D9D9D9]">
                  <span className="text-gray-400 text-xs"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="mt-6">
            <h2 className="font-bold text-[#1C3366] mb-2">Certificates</h2>
            <div className="grid grid-cols-3 gap-5">
              {certificates.map((cert) => {
                // Check if this certificate exists in the vendor's certifications
                const hasCertificate = vendor.documents?.certifications && 
                                      vendor.documents.certifications[cert.toLowerCase()] !== null && 
                                      vendor.documents.certifications[cert.toLowerCase()] !== undefined;
                
                return (
                  <div 
                    key={cert} 
                    className={`flex flex-col items-center justify-center border border-gray-300 rounded-md p-2 text-center text-sm relative ${hasCertificate ? 'bg-green-50' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="text-left">{cert}</div>
                      {/* Show checkmark if certificate exists */}
                      {hasCertificate && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}