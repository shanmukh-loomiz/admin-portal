"use client";
import React from "react";

const Navbar = () => {
  return (
    <nav className="h-[75px] bg-[#F9FAFB] flex justify-between items-center px-[50px] bg-white border-b border-[#e0e0e0] sticky top-0 z-[1000] shadow-md">
      <div className="flex items-center">
      <img
          src="/menu-open-rounded.svg"
          alt="Loomiz Logo"
          className="h-[48px] w-[48px] mr-2"
        />
        <img
          src="/LoomizLogoDarkBlue.svg"
          alt="Loomiz Logo"
          className="h-[38px] mr-2"
        />
      </div>

      <div className="flex items-center gap-5">
        
        <img
          src="/NavrbarNotificationLogo.svg"
          alt="Notifications"
          className="w-[22px] h-[22px] cursor-pointer"
        />
        <img
          src="/NavbarProfileLogo.svg"
          alt="User"
          className="w-[22px] h-[22px] cursor-pointer"
        />
        <img
          src="/NavbarHelpLogo.svg"
          alt="Help"
          className="w-[22px] h-[22px] cursor-pointer"
        />
      </div>
    </nav>
  );
};

export default Navbar;
