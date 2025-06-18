'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products/get-all-products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log("Data is ", data);
        setProducts(data.data);
        console.log("Products are ", products);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete confirmation
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/products/delete-product/${productToDelete._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete product');
      }

      // Remove product from local state
      setProducts(products.filter(p => p._id !== productToDelete._id));
      toast.success('Product deleted successfully');
      
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Handle loading state
  if (loading) {
    return <Loader />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="ml-[290px] mt-[65px] bg-[#F8FAFC] min-h-screen p-6 font-[Satoshi]">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[290px] mt-[65px] bg-[#F8FAFC] min-h-screen p-6 font-[Satoshi]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src="/LeftArrow.svg"
            alt="Back"
            className="h-8 w-8 cursor-pointer"
            onClick={() => router.back()}
          />
          <h1 className="text-4xl font-semibold">Product List</h1>
        </div>
        <button
          onClick={() => router.push('/products/addproduct')}
          className="bg-[#344054] text-white px-12 py-4 rounded-full font-medium font-[Satoshi] cursor-pointer"
        >
          + Add new product
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-6">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. Add your first product to get started.
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={product._id || product.productId || index}
              className="flex justify-between items-center p-4 bg-white rounded shadow-sm"
            >
              {/* Product Info */}
              <div>
                <h2 className="font-semibold text-lg">{product.productName}</h2>
                <p className="text-[16px] text-gray-500">{product.productId}</p>
                <p className="text-[18px] text-[#8098F9] font-medium">
                  {product.priceRange || 'Price not available'}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button 
                  className="bg-[#344054] text-[#F5FAFF] px-18 py-2 rounded-full cursor-pointer"
                  onClick={() => {
                    router.push(`/products/edit-product/${product._id}`);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="border border-[#344054] text-[#344054] px-18 py-2 rounded-full cursor-pointer"
                  onClick={() => handleDeleteClick(product)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[500px]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-md font-semibold text-gray-700">
                Confirm Product Deletion
              </h3>
              <button 
                onClick={handleCancelDelete} 
                className="text-gray-500 hover:text-gray-700 text-lg"
                disabled={deleteLoading}
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-left space-y-3 text-gray-700 mb-6">
              <div>
                <span className="text-[#344054] font-medium">Product Details</span>
                <ul className="mt-2 space-y-1">
                  <li><span className="font-medium text-gray-600">Name:</span> {productToDelete?.productName}</li>
                  <li><span className="font-medium text-gray-600">ID:</span> {productToDelete?.productId}</li>
                  {productToDelete?.priceRange && (
                    <li><span className="font-medium text-gray-600">Price:</span> {productToDelete.priceRange}</li>
                  )}
                </ul>
              </div>
            </div>
            
            <p className="text-sm mb-4 text-red-600 bg-red-50 p-3 rounded-md">
              ⚠️ This action cannot be undone. The product and all its associated data will be permanently removed.
            </p>

            <div className="flex gap-4 mt-6 justify-between">
              <button 
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
                onClick={handleCancelDelete}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className={`bg-[#344054] text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm font-medium ${deleteLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2a3441] transition-colors'}`}
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}