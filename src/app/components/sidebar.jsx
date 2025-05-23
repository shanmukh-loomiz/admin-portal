"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const mainItems = [
    {
      label: "Dashboard",
      icon: "/SidebarDashboardLogo.svg",
      hasDropdown: false
    },
    {
      label: "Orders",
      icon: "/SidebarOrderTrackingLogo.svg",
      hasDropdown: true,
      subRoutes: [
        { name: "Accepted Orders", path: "/orders/accepted" },
        { name: "Rejected Orders", path: "/orders/rejected" },
        { name: "Pending Orders", path: "/orders/pending" },
      ],
    },
    {
      label: "Payments",
      icon: "/SidebarPaymentLogo.svg",
      hasDropdown: false
    },
    {
      label: "Chat",
      icon: "/SidebarChatsLogo.svg",
      hasDropdown: false
    },
    {
      label: "Product",
      icon: "/SidebarProductLogo.svg",
      hasDropdown: true,
      subRoutes: [
        { name: "Product List", path: "/products/productlist" },
        { name: "Add Product", path: "/products/addproduct" },
      ],
    },
    {
      label: "Operations",
      icon: "/SidebarOperationsLogo.svg",
      hasDropdown: false
    },
    {
      label: "Vendor Management",
      icon: "/SidebarVendorLogo.svg",
      route: "/vendors",
      hasDropdown: false
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDropdown = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleItemClick = (item, index) => {
    if (item.route) {
      router.push(item.route);
    } else if (!item.hasDropdown) {
      // You can define default behavior for items without routes or dropdowns
    } else {
      toggleDropdown(index);
    }
  };

  return (
    <div className="fixed top-[75px] left-0 w-[290px] h-[calc(100vh-65px)] bg-[#EDF5FF] p-5 flex flex-col justify-start">
      <div className="flex-1 flex flex-col justify-between mt-5">
        <ul className="list-none px-3 m-0">
          {mainItems.map((item, index) => (
            <li key={index} className="mb-2">
              <div
                className="flex justify-between items-center py-3 px-2 text-[18px] text-[#060B14] font-[Sregular] hover:bg-[#dbe9ff] rounded-md transition cursor-pointer"
                onClick={() => handleItemClick(item, index)}
              >
                <div className="flex items-center">
                  <img
                    src={item.icon}
                    alt={`${item.label} icon`}
                    className="w-[24px] h-[24px] mr-3"
                  />
                  <span>{item.label}</span>
                </div>
                {/* Only show dropdown button for items that have dropdowns */}
                {item.hasDropdown !== false && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent from being clicked
                      toggleDropdown(index);
                    }}
                    className="focus:outline-none"
                  >
                    <img
                      src="/DropdownButton.svg"
                      alt="Expand"
                      className={`w-[24px] h-[24px] transition-transform ${
                        expandedIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
              {expandedIndex === index && item.subRoutes && (
                <ul className="mt-1 pl-8 border-l-2 border-[#5A6474] ml-4">
                  {item.subRoutes.map((sub, i) => (
                    <li
                      key={i}
                      className="py-2 pl-3 mb-1 relative text-[15px] text-[#5A6474] hover:text-[#0066FF] cursor-pointer transition-colors hover:bg-[#e8f0fd] rounded-md"
                      onClick={() => router.push(sub.path)}
                    >
                      <div className="absolute left-[-14px] top-1/2 w-3 h-[2px] bg-[#5A6474]"></div>
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar