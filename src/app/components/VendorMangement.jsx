"use client";
import { useState } from "react";

export default function VendorManagement() {
  const [mainImage, setMainImage] = useState(null);
  const [smallImages, setSmallImages] = useState([null, null, null]);
  const [uploadedCertificates, setUploadedCertificates] = useState({});

  const certificates = ["Sedex", "BSCI", "FAMA", "OCS", "ISO", "BCI", "FA8000", "GOTS", "GRS", "CT-PAT", "WRAP", "QMS"];

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setMainImage(URL.createObjectURL(file));
  };

  const handleSmallImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...smallImages];
      newImages[index] = URL.createObjectURL(file);
      setSmallImages(newImages);
    }
  };

  const handleCertificateUpload = (name, e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedCertificates((prev) => ({
        ...prev,
        [name]: { url: URL.createObjectURL(file), filename: file.name },
      }));
    }
  };

  const handleCertificateDelete = (name) => {
    setUploadedCertificates((prev) => {
      const newCerts = { ...prev };
      delete newCerts[name];
      return newCerts;
    });
  };

  return (
    <div className="ml-[340px] mt-[75px] p-6 bg-[#fff] min-h-[calc(100vh-75px)] mr-[50px]  rounded-[20px] mb-[50px]">

      {/* Title */}
      <div className="flex items-start justify-between ">
        <h1 className="text-[36px] font-[NSmedium] text-[#233B6E]">XYZ FACILITY</h1>
      </div>

      {/* Main Section */}
      <div className="flex mt-6 gap-6">

        {/* Left Side */}
        <div className="flex flex-col items-center w-2/5">

          {/* Large Image Upload */}
          <div className="relative w-[410px] h-[410px] rounded-md mb-4 flex items-center justify-center overflow-hidden bg-white ">
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
              <div key={index} className="relative w-[120px] h-[120px] rounded-md overflow-hidden flex items-center justify-center bg-white ">
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
            <button className="border border-gray-300 py-2 rounded-md hover:bg-gray-100 ">Approve Manufacturer</button>
            <button className="border border-gray-300 py-2 rounded-md hover:bg-gray-100">Reject Manufacturer</button>
            <button className="border border-gray-300 py-2 rounded-md hover:bg-gray-100">Manufacturer Under Review</button>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-3/5">

          {/* Status Buttons */}
          <div className="flex gap-2 mb-6 font-[NSregular] text-[14px] text-[#262626]">
            <button className="px-3 py-1 rounded-[20px] bg-[#E5E7EB]">Verified Vendor</button>
            <button className="px-3 py-1 rounded-[20px] bg-[#E5E7EB]">Assigned Order</button>
            <button className="px-3 py-1 rounded-[20px] bg-[#E5E7EB]">In Production</button>
          </div>

          {/* Supplier Details */}
          <div className="mt-6">
            <h2 className="font-semibold text-[#233B6E] mb-2 font-[NSmedium]">Supplier Details</h2>
            <div className="grid grid-cols-2 gap-y-4 ">
              {/* Details Grid */}
              <div className="flex">
                <div className="font-semibold w-32 ">Contact Person:</div>
                <div>Ram</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Contact No.:</div>
                <div>+91 9876543210</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Facility Code:</div>
                <div>FAC1234</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Location:</div>
                <div>New Delhi, India</div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-6">
            <h2 className="font-bold text-[#1C3366] mb-2">About</h2>
            <div className="grid grid-cols-2 gap-y-4 ">
              <div className="flex">
                <div className="font-semibold w-32">Established:</div>
                <div>1999</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Machines:</div>
                <div>150</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Capacity:</div>
                <div>5000 pcs/day</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Turn Over:</div>
                <div>₹5 Crores</div>
              </div>
              <div className="flex">
                <div className="font-semibold w-32">Occupied:</div>
                <div>80%</div>
              </div>
            </div>
          </div>

          {/* Current Customers */}
          <div className="mt-6">
            <h2 className="font-bold text-[#1C3366] mb-2">Current Customers</h2>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((_, idx) => (
                <div key={idx} className="w-20 h-20 border border-gray-300 rounded-md flex items-center justify-center bg-[#D9D9D9]">
                  <span className="text-gray-400 text-xs"></span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          {/* Certificates */}
<div className="mt-6">
  <h2 className="font-bold text-[#1C3366] mb-2">Certificates</h2>
  <div className="grid grid-cols-3 gap-5">
    {certificates.map((cert) => (
      <div key={cert} className="flex flex-col items-center justify-center border border-gray-300 rounded-md p-2 text-center text-sm relative">
        <div className="flex items-center justify-between w-full mb-1">
          <div className="text-left">{cert}</div>
          {/* Upload or Cross */}
          {uploadedCertificates[cert] ? (
            <button onClick={() => handleCertificateDelete(cert)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 11-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 11-1.414-1.414L8.586 10 3.636 5.05a1 1 0 111.414-1.414L10 8.586z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <label className="cursor-pointer">
              <img src="/UploadLogo.svg" alt="Upload" className="w-4 h-4 object-cover" />
              <input type="file" className="hidden" onChange={(e) => handleCertificateUpload(cert, e)} />
            </label>
          )}
        </div>
        {/* Uploaded file name */}
        {uploadedCertificates[cert] && (
          <div className="text-gray-500 text-[10px] truncate max-w-[90px]">{uploadedCertificates[cert].filename}</div>
        )}
      </div>
    ))}
  </div>
</div>


        </div>

      </div>
    </div>
  );
}
