"use client";

import { useState, useRef } from "react";

export default function AddProduct() {
  const [attributeRows, setAttributeRows] = useState([
    {
      pattern: "",
      waistline: "",
      embellishments: "",
      style: "",
      silhouette: "",
      sleeves: "",
      features: "",
      occasion: "",
    },
  ]);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [measurementFiles, setMeasurementFiles] = useState([]);

  const productInputRef = useRef(null);
  const measurementInputRef = useRef(null);

  const addAttributeRow = () => {
    setAttributeRows([
      ...attributeRows,
      {
        pattern: "",
        waistline: "",
        embellishments: "",
        style: "",
        silhouette: "",
        sleeves: "",
        features: "",
        occasion: "",
      },
    ]);
  };

  const removeAttributeRow = (index) => {
    const updated = [...attributeRows];
    updated.splice(index, 1);
    setAttributeRows(updated);
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/svg+xml", "application/pdf"].includes(file.type)
    );

    const previews = validFiles.slice(0, 5).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      name: file.name,
      type: file.type,
    }));

    if (type === "product") {
      setUploadedImages((prev) => [...prev, ...previews].slice(0, 5));
    } else {
      setMeasurementFiles((prev) => [...prev, ...previews].slice(0, 5));
    }
  };

  const removeFile = (index, type) => {
    if (type === "product") {
      const updated = [...uploadedImages];
      updated.splice(index, 1);
      setUploadedImages(updated);
    } else {
      const updated = [...measurementFiles];
      updated.splice(index, 1);
      setMeasurementFiles(updated);
    }
  };

  const renderUploadedFiles = (files, type) => (
    <div className="grid grid-cols-5 gap-4 mt-4">
      {files.map((fileObj, index) => (
        <div
          key={index}
          className="relative border border-gray-300 rounded-md p-2 flex items-center justify-center h-[80px] bg-gray-50"
        >
          {fileObj.preview ? (
            <img src={fileObj.preview} alt="preview" className="h-full object-contain" />
          ) : (
            <span className="text-sm text-center">{fileObj.name}</span>
          )}
          <button
            className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            onClick={() => removeFile(index, type)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px] text-[#1A1A1A]">
      <div className="flex mb-10 mx-10">
        <img src="/LeftArrow.svg" alt="" />
        <h2 className="text-[32px] font-semibold ml-5">Add new product</h2>
      </div>

      <div className="grid grid-cols-12 gap-[48px] mx-10">
        {/* Left Section */}
        <div className="col-span-6 space-y-6">
          <h3 className="text-[24px] font-semibold">Basic Details</h3>
          {["Product ID", "Product Name"].map((label) => (
            <div key={label}>
              <label className="text-sm font-semibold">{label}</label>
              <input
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px]"
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold">Product Description</label>
            <textarea
              rows={3}
              placeholder="Add description of 200–250 characters"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Category</label>
            <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px]">
              <option>Select</option>
            </select>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-6 space-y-10">
          {/* Product Images Upload */}
          <div>
            <h3 className="text-[24px] font-semibold mb-2">Product Images</h3>
            <h4 className="font-semibold mb-2">Upload Images</h4>
            <div className="border border-gray-300 rounded-md p-10 space-y-4">
              {uploadedImages.length < 5 && (
                <button
                  className="mx-auto bg-gray-400 text-sm text-gray-800 py-3 px-6 rounded-[20px] flex gap-4"
                  onClick={() => productInputRef.current.click()}
                >
                  <img src="/DocUploadLogo.svg" alt="" /> Upload from browser/drive
                </button>
              )}
              <input
                type="file"
                ref={productInputRef}
                onChange={(e) => handleImageUpload(e, "product")}
                className="hidden"
                accept="image/jpeg, image/png, image/svg+xml, application/pdf"
                multiple
              />
              <p className="text-xs text-gray-600 text-center">
                You can upload up to 5 files in jpg, png, svg, pdf formats
              </p>
              {renderUploadedFiles(uploadedImages, "product")}
            </div>
          </div>

          {/* Measurement Specs Upload */}
          <div>
            <h3 className="text-[24px] font-semibold mb-2">Measurement specs</h3>
            <h4 className="font-semibold mb-2">Upload Images</h4>
            <div className="border border-gray-300 rounded-md p-10 space-y-4">
              {measurementFiles.length < 5 && (
                <button
                  className="mx-auto bg-gray-400 text-sm text-gray-800 py-3 px-6 rounded-[20px] flex gap-4"
                  onClick={() => measurementInputRef.current.click()}
                >
                  <img src="/DocUploadLogo.svg" alt="" /> Upload from browser/drive
                </button>
              )}
              <input
                type="file"
                ref={measurementInputRef}
                onChange={(e) => handleImageUpload(e, "measurement")}
                className="hidden"
                accept="image/jpeg, image/png, image/svg+xml, application/pdf"
                multiple
              />
              <p className="text-xs text-gray-600 text-center">
                You can upload up to 5 files in jpg, png, svg, pdf formats
              </p>
              {renderUploadedFiles(measurementFiles, "measurement")}
            </div>
          </div>
        </div>
      </div>

      {/* Attributes */}
      <div className="mt-10 mx-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[24px] font-semibold">Attributes</h3>
          <button onClick={addAttributeRow} className="text-blue-600 cursor-pointer">
            + Add new
          </button>
        </div>
        <div className="space-y-6">
          {attributeRows.map((_, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className=" font-semibold text-[18px]">Attribute {index + 1}</h4>
                {attributeRows.length > 1 && (
                  <button
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeAttributeRow(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-[48px]">
                <div className="space-y-4">
                  {["Pattern", "Waistline", "Embellishments", "Style"].map((label) => (
                    <div key={label}>
                      <label className="text-sm font-semibold">{label}</label>
                      <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px]">
                        <option>Select</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {["Silhouette", "Sleeves", "Special Features", "Occasion Type"].map((label) => (
                    <div key={label}>
                      <label className="text-sm font-semibold">{label}</label>
                      <select className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px]">
                        <option>Select</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price and Submit */}
      <div className="flex justify-between items-end mt-10 mx-10">
        <div className="w-[50%] space-y-4">
          <h3 className="text-[24px] font-semibold mb-2">Price</h3>
          <div>
            <label className="text-sm font-semibold">Price range</label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Number of pieces per order</label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Enter quantity"
            />
          </div>
        </div>
        <div className="w-[35%] flex justify-end">
          <button className="bg-[#416CB4] text-[#E2E2E2] px-30 py-2 mt-6 rounded-[100px]">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
