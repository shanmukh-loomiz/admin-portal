'use client';
import { useRouter } from 'next/navigation';

export default function ProductList() {
  const router = useRouter();

  const products = [
    { name: 'Top face covering in black', code: '234-5343', price: '$2-4/pc' },
    { name: 'Top face covering in black', code: '234-5343', price: '$2-4/pc' },
    { name: 'Top face covering in black', code: '234-5343', price: '$2-4/pc' },
    { name: 'Top face covering in black', code: '234-5343', price: '$2-4/pc' },
  ];

  return (
    <div className="ml-[290px] mt-[65px] bg-[#F8FAFC] min-h-screen p-6  font-[Satoshi]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src="/LeftArrow.svg"
            alt="Back"
            className="h-8 w-8 cursor-pointer"
            onClick={() => router.push('/products/productlist')}
          />
          <h1 className="text-4xl font-semibold ">Product List</h1>
        </div>
        <button
          onClick={() => router.push('/products/addproduct')}
          className="bg-[#344054] text-white px-12 py-4 rounded-full font-medium font-[Satoshi] cursor-pointer"
        >
          +   Add new product
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-white rounded shadow-sm"
          >
            {/* Product Info */}
            <div>
              <h2 className="font-semibold text-lg ">{product.name}</h2>
              <p className="text-[16px] text-gray-500">{product.code}</p>
              <p className="text-[18px] text-[#8098F9] font-medium">{product.price}</p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button className="bg-[#344054] text-[#F5FAFF] px-18 py-2 rounded-full cursor-pointer">
                Edit
              </button>
              <button className="border border-[#344054] text-[#344054] px-18 py-2 rounded-full cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
