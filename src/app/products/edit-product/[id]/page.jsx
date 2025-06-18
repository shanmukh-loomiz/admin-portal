"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Loader from '../../../components/Loader';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form data state
  const [productData, setProductData] = useState({
    productId: "",
    productName: "",
    description: "",
    category: "",
    priceRange: "",
    quantityPerOrder: ""
  });

  // Show input for new field
  const [showFieldInput, setShowFieldInput] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  
  // Initial attribute with fields
  const [attributeRows, setAttributeRows] = useState([
    {
      fields: {
        pattern: "",
        waistline: "",
        embellishments: "",
        style: "",
        silhouette: "",
        sleeves: "",
        features: "",
        occasion: ""
      },
    },
  ]);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [measurementFiles, setMeasurementFiles] = useState([]);
  const [existingProductImages, setExistingProductImages] = useState([]);
  const [existingMeasurementImages, setExistingMeasurementImages] = useState([]);

  const productInputRef = useRef(null);
  const measurementInputRef = useRef(null);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/get-product/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        
        const result = await response.json();
        const product = result.data;
        
        // Set basic product data
        setProductData({
          productId: product.productId || "",
          productName: product.productName || "",
          description: product.description || "",
          category: product.category || "",
          priceRange: product.priceRange || "",
          quantityPerOrder: product.quantityPerOrder || ""
        });
        
        // Set attributes
        if (product.attributes && product.attributes.length > 0) {
          setAttributeRows(product.attributes);
        }
        
        // Set existing images
        if (product.productImages && product.productImages.length > 0) {
          setExistingProductImages(product.productImages);
        }
        
        if (product.measurementSpecs && product.measurementSpecs.length > 0) {
          setExistingMeasurementImages(product.measurementSpecs);
        }
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching product:', err);
        toast.error('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  // Handle changes to basic product data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // We remove the add attribute row functionality, but keep the remove function
  const removeAttributeRow = (index) => {
    const updated = [...attributeRows];
    updated.splice(index, 1);
    setAttributeRows(updated);
  };

  // Handle changes to fields (both default and custom)
  const handleFieldChange = (attributeIndex, fieldName, value) => {
    const updated = [...attributeRows];
    updated[attributeIndex].fields[fieldName] = value;
    setAttributeRows(updated);
  };

  // Add custom field to a specific attribute row
  const addCustomField = (attributeIndex) => {
    if (showFieldInput && !newFieldName.trim()) {
      setShowFieldInput(false);
      return;
    }
    
    if (!showFieldInput) {
      setShowFieldInput(true);
      return;
    }
    
    const updated = [...attributeRows];
    updated[attributeIndex].fields[newFieldName] = "";
    setAttributeRows(updated);
    
    setNewFieldName("");
    setShowFieldInput(false);
  };

  // Remove field from attribute row
  const removeField = (attributeIndex, fieldName) => {
    const updated = [...attributeRows];
    delete updated[attributeIndex].fields[fieldName];
    setAttributeRows(updated);
  };

  // Handle Enter key for adding new field
  const handleKeyPress = (e, attributeIndex) => {
    if (e.key === 'Enter') {
      if (showFieldInput && newFieldName.trim()) {
        const updated = [...attributeRows];
        updated[attributeIndex].fields[newFieldName] = "";
        setAttributeRows(updated);
        
        setNewFieldName("");
        setShowFieldInput(false);
      }
    }
  };

  const handleImageUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/svg+xml", "application/pdf"].includes(file.type)
    );

    if (validFiles.length === 0) {
      toast.error("Please upload valid file formats (jpg, png, svg, pdf)");
      return;
    }
    
    // Calculate how many more images can be added (including existing images)
    const currentCount = type === "product" 
      ? uploadedImages.length + existingProductImages.length 
      : measurementFiles.length + existingMeasurementImages.length;
    const remainingSlots = 5 - currentCount;
    
    if (remainingSlots <= 0) {
      toast.error(`Maximum of 5 ${type === "product" ? "product" : "measurement"} images allowed.`);
      return;
    }
    
    // Only take as many files as there are remaining slots
    const filesToAdd = validFiles.slice(0, remainingSlots);
    
    const previews = filesToAdd.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      name: file.name,
      type: file.type,
    }));

    if (type === "product") {
      setUploadedImages((prev) => [...prev, ...previews]);
      
      if (validFiles.length > remainingSlots) {
        toast.info(`Only ${remainingSlots} product images added. Maximum of 5 images allowed.`);
      }
    } else {
      setMeasurementFiles((prev) => [...prev, ...previews]);
      
      if (validFiles.length > remainingSlots) {
        toast.info(`Only ${remainingSlots} measurement images added. Maximum of 5 images allowed.`);
      }
    }
  };

  const removeFile = (index, type) => {
    if (type === "product") {
      const updated = [...uploadedImages];
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      setUploadedImages(updated);
    } else {
      const updated = [...measurementFiles];
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      setMeasurementFiles(updated);
    }
  };

  const removeExistingImage = (index, type) => {
    if (type === "product") {
      const updated = [...existingProductImages];
      updated.splice(index, 1);
      setExistingProductImages(updated);
    } else {
      const updated = [...existingMeasurementImages];
      updated.splice(index, 1);
      setExistingMeasurementImages(updated);
    }
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedImages.forEach(item => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
      measurementFiles.forEach(item => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!productData.productId.trim() || !productData.productName.trim()) {
      toast.error("Product ID and Name are required");
      return;
    }

    if (uploadedImages.length === 0 && existingProductImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Add basic product data
      Object.entries(productData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Add attributes as JSON string
      formData.append('attributes', JSON.stringify(attributeRows));
      
      // Add existing images to keep
      formData.append('existingProductImages', JSON.stringify(existingProductImages));
      formData.append('existingMeasurementImages', JSON.stringify(existingMeasurementImages));
      
      // Add new product images
      uploadedImages.forEach(img => {
        formData.append('productImages', img.file);
      });
      
      // Add new measurement files
      measurementFiles.forEach(img => {
        formData.append('measurementSpecs', img.file);
      });
      
      // Send the form data to our update API
      const response = await fetch(`/api/products/update-product/${productId}`, {
        method: 'PUT',
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product');
      }
      
      toast.success('Product updated successfully');
      router.push('/'); // Redirect to products page after success
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderExistingImages = (images, type) => (
    <div className="grid grid-cols-5 gap-4 mt-4">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className="relative border border-gray-300 rounded-md p-2 flex items-center justify-center h-[80px] bg-gray-50"
        >
          <img src={imageUrl} alt="existing" className="h-full object-contain" />
          <button
            className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            onClick={() => removeExistingImage(index, type)}
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

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
            type="button"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  // Handle loading state
  if (loading) {
    return <Loader />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px] text-[#1A1A1A]">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ml-[340px] mt-[75px] p-6 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px] text-[#1A1A1A]">
      <div className="flex mb-10 mx-10">
        <button type="button" onClick={() => router.back()} className="flex items-center">
          <img src="/LeftArrow.svg" alt="Back" />
          <h2 className="text-[32px] font-semibold ml-5">Edit product</h2>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-[48px] mx-10">
        {/* Left Section */}
        <div className="col-span-6 space-y-6">
          <h3 className="text-[24px] font-semibold">Basic Details</h3>
          <div>
            <label className="text-sm font-semibold">Product ID</label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px]"
              placeholder="Enter product id"
              name="productId"
              value={productData.productId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Product Name</label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px]"
              placeholder="Enter product name"
              name="productName"
              value={productData.productName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Product Description</label>
            <textarea
              rows={3}
              placeholder="Add description of 200–250 characters"
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              name="description"
              value={productData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Category</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px]"
              name="category"
              value={productData.category}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="dresses">Dresses</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="outerwear">Outerwear</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-6 space-y-10">
          {/* Product Images Upload */}
          <div>
            <h3 className="text-[24px] font-semibold mb-2">Product Images</h3>
            <h4 className="font-semibold mb-2">Existing Images</h4>
            {existingProductImages.length > 0 && renderExistingImages(existingProductImages, "product")}
            
            <h4 className="font-semibold mb-2 mt-4">Upload New Images</h4>
            <div className="border border-gray-300 rounded-md p-10 space-y-4">
              {(uploadedImages.length + existingProductImages.length) < 5 && (
                <button
                  type="button"
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
            <h4 className="font-semibold mb-2">Existing Images</h4>
            {existingMeasurementImages.length > 0 && renderExistingImages(existingMeasurementImages, "measurement")}
            
            <h4 className="font-semibold mb-2 mt-4">Upload New Images</h4>
            <div className="border border-gray-300 rounded-md p-10 space-y-4">
              {(measurementFiles.length + existingMeasurementImages.length) < 5 && (
                <button
                  type="button"
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
        <h3 className="text-[24px] font-semibold mb-3">Attributes</h3>
        <div className="space-y-6">
          {attributeRows.map((attributeRow, attributeIndex) => (
            <div key={attributeIndex} className="border border-gray-200 p-4 rounded-md space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-[18px]">Attribute {attributeIndex + 1}</h4>
                {attributeRows.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeAttributeRow(attributeIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {/* Fields in two columns */}
              <div className="grid grid-cols-2 gap-[48px]">
                {/* Left column */}
                <div className="space-y-4">
                  {Object.entries(attributeRow.fields)
                    .filter((_, index) => index % 2 === 0)
                    .map(([fieldName, fieldValue]) => (
                      <div key={fieldName} className="relative">
                        <label className="text-sm font-semibold capitalize">{fieldName}</label>
                        <div className="relative">
                          <input
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px] pr-10"
                            value={fieldValue}
                            placeholder={`Enter ${fieldName.toLowerCase()}`}
                            onChange={(e) => handleFieldChange(attributeIndex, fieldName, e.target.value)}
                          />
                          {/* Only show remove button for custom fields */}
                          {!["pattern", "waistline", "embellishments", "style", "silhouette", "sleeves", "features", "occasion"].includes(fieldName) && (
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-base font-bold"
                              onClick={() => removeField(attributeIndex, fieldName)}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* Right column */}
                <div className="space-y-4">
                  {Object.entries(attributeRow.fields)
                    .filter((_, index) => index % 2 === 1)
                    .map(([fieldName, fieldValue]) => (
                      <div key={fieldName} className="relative">
                        <label className="text-sm font-semibold capitalize">{fieldName}</label>
                        <div className="relative">
                          <input
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px] pr-10"
                            value={fieldValue}
                            placeholder={`Enter ${fieldName.toLowerCase()}`}
                            onChange={(e) => handleFieldChange(attributeIndex, fieldName, e.target.value)}
                          />
                          {/* Only show remove button for custom fields */}
                          {!["pattern", "waistline", "embellishments", "style", "silhouette", "sleeves", "features", "occasion"].includes(fieldName) && (
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-base font-bold"
                              onClick={() => removeField(attributeIndex, fieldName)}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Add Custom Field Section */}
              <div className="mt-6">
                {showFieldInput ? (
                  <div className="flex-1 relative">
                    <input
                      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm h-[48px] pr-[120px]"
                      placeholder="Enter new field name"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, attributeIndex)}
                      autoFocus
                    />
                    <div className="absolute right-2 top-[10px] flex space-x-2">
                      <button
                        type="button"
                        onClick={() => addCustomField(attributeIndex)}
                        className="text-blue-600 cursor-pointer px-2"
                      >
                        Add
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={() => setShowFieldInput(false)}
                        className="text-gray-500 cursor-pointer px-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => addCustomField(attributeIndex)}
                    className="text-blue-600 cursor-pointer font-medium"
                  >
                    + Add field
                  </button>
                )}
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
              name="priceRange"
              value={productData.priceRange}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Number of pieces per order</label>
            <input
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
              placeholder="Enter quantity"
              name="quantityPerOrder"
              value={productData.quantityPerOrder}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="w-[35%] flex justify-end">
          <button 
            type="submit" 
            className="bg-[#416CB4] text-[#E2E2E2] px-8 py-3 mt-6 rounded-[100px] w-[120px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </form>
  );
}