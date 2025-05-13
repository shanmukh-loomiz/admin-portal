"use client";
import React from "react";

import BrandVerification from "../components/BrandVerification";
import AddProduct from "../components/AddProduct";
import RFQReceived from "../components/RFQRecieved";
import WebsiteData from "../components/WebsiteData";
import AppData from "../components/AppData";
import Queries from "../components/Queries";
import VerifiedBrands from "../components/VerifiedBrands";

export default function NewPages() {
  return (
    <div>

        <BrandVerification />
<AddProduct /> 

{/* For Web  */}
 <WebsiteData />
<RFQReceived /> 


  {/* For App */}
  <AppData />
  <Queries /> 

  <VerifiedBrands />
        </div>
    
  );
}