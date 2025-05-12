"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  
  const mainItems = [
    { label: "Dashboard", icon: "/SidebarDashboardLogo.svg" },
    { label: "Orders", icon: "/SidebarOrderTrackingLogo.svg" },
    { label: "Payments", icon: "/SidebarPaymentLogo.svg" },
    { label: "Chat", icon: "/SidebarChatsLogo.svg" },
    { label: "Product", icon: "/SidebarProductLogo.svg" },
    { label: "Operations", icon: "/SidebarOperationsLogo.svg" },
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

              {expandedIndex === index && (
                <div className="ml-10 mt-2 text-sm text-gray-600">
                  {/* Placeholder for dropdown content */}
                  <p>Dropdown content for {item.label}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;