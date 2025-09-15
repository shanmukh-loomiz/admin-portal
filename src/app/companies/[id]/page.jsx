// src/app/companies/[id]/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CompanyReviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/companies/${id}`, { headers: { Accept: "application/json" } });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to fetch (${res.status}): ${txt.slice(0, 200)}`);
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch company");
      setCompany(data.data);
    } catch (err) {
      console.error("fetchCompany error:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const patchStatus = async (newStatus, setVerified = false) => {
    if (!company) return;
    try {
      setActioning(true);
      setError(null);
      setMessage(null);

      const body = { status: newStatus };
      if (setVerified) body.hasBeenVerified = true;
      // Optionally add verifiedAt or verifier id if you implement on server
      const res = await fetch(`/api/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({ success: false, message: "Invalid JSON from server" }));
      if (!res.ok || !data.success) {
        throw new Error(data.message || `Status ${res.status}`);
      }

      setCompany(data.data);
      setMessage(`Status updated to "${newStatus}"`);
    } catch (err) {
      console.error("patchStatus error:", err);
      setError(String(err));
    } finally {
      setActioning(false);
    }
  };

  const handleApprove = () => {
    if (!confirm("Approve this company? This will mark it as verified.")) return;
    patchStatus("Approved", true);
  };

  const handleUnderReview = () => {
    patchStatus("Under Review", false);
  };

  const handleReject = () => {
    if (!confirm("Reject this company? This action is reversible only by updating status again. Proceed?")) return;
    patchStatus("Rejected", false);
  };

  if (loading) {
    return (
      <div className="ml-[350px] mt-[60px] p-8 min-h-[calc(100vh-75px)]">
        <div className="flex justify-center p-12">
          <div className="animate-spin h-10 w-10 border-2 border-gray-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-[350px] mt-[60px] p-8 min-h-[calc(100vh-75px)]">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button onClick={fetchCompany} className="bg-gray-200 px-4 py-2 rounded">Retry</button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="ml-[350px] mt-[60px] p-8 min-h-[calc(100vh-75px)]">
        <p>No company found.</p>
      </div>
    );
  }

  // Helper to display file links; adapt property names if backend uses different keys
  const fileLink = (url) => {
    if (!url) return <span className="text-gray-400">—</span>;
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        View / Download
      </a>
    );
  };

  // layout styles (kept from buyer form to match)
  const headingStyle = "font-['NSmedium'] text-[28px] leading-[64px] tracking-normal align-middle font-variant-small-caps text-gray-800";
  const subheadingStyle = "font-['NSmedium'] text-[20px] leading-[64px] tracking-normal align-middle text-gray-700";
  const labelStyle = "block font-['NSmedium'] text-[14px] leading-[100%] tracking-normal align-middle text-gray-700 mb-3";
  const fieldStyle = "border border-gray-200 rounded p-3 bg-gray-50 text-gray-800";

  return (
    <div className="ml-[350px] mt-[60px] p-8 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-[NSmedium] text-[#233B6E]">{company.registeredCompanyName || company.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Submitted: {company.createdAt ? new Date(company.createdAt).toLocaleString() : "—"}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm ${company.hasBeenVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>
            {company.hasBeenVerified ? "Verified" : (company.status || "Unverified")}
          </span>

          <button onClick={() => router.push("/companies")} className="bg-gray-100 text-gray-800 px-3 py-2 rounded">
            Back
          </button>
        </div>
      </div>

      {/* show admin messages */}
      {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{error}</div>}

      {/* ACTIONS */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={handleApprove}
          disabled={actioning}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {actioning ? "Processing..." : "Approve"}
        </button>

        <button
          onClick={handleUnderReview}
          disabled={actioning}
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {actioning ? "Processing..." : "Under Review"}
        </button>

        <button
          onClick={handleReject}
          disabled={actioning}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {actioning ? "Processing..." : "Reject"}
        </button>

        <button
          onClick={() => {
            // refresh
            fetchCompany();
          }}
          className="bg-gray-100 text-gray-800 px-3 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {/* Read-only form layout — Person of Contact */}
      <div className="mb-8">
        <h2 className={headingStyle}>PERSON OF CONTACT</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelStyle}>Contact Person Name</label>
            <div className={fieldStyle}>{company.contactPersonName || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>Phone No.</label>
            <div className={fieldStyle}>{company.contactPhoneNo || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>Email</label>
            <div className={fieldStyle}>{company.contactEmail || "—"}</div>
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <div className="mb-8">
        <h2 className={headingStyle}>COMPANY PROFILE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2">
            <label className={labelStyle}>Registered company name</label>
            <div className={fieldStyle}>{company.registeredCompanyName || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>GST/Tax Id</label>
            <div className={fieldStyle}>{company.gstTaxId || company.gstNumber || "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className={labelStyle}>Tax registration certificate</label>
            <div className={fieldStyle}>{fileLink(company.taxRegistrationCertUrl || company.taxRegistrationCert)}</div>
          </div>

          <div>
            <label className={labelStyle}>Business No.</label>
            <div className={fieldStyle}>{company.businessNo || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>Country of Incorporation</label>
            <div className={fieldStyle}>{company.countryOfIncorporation || "—"}</div>
          </div>
        </div>
      </div>

      {/* Address Detail */}
      <div className="mb-8">
        <h2 className={headingStyle}>ADDRESS DETAIL</h2>
        <div className="mb-4">
          <div className={subheadingStyle}>Registered Company Address</div>
        </div>

        <div className="mb-4">
          <label className={labelStyle}>Apartment No/Street Address</label>
          <div className={fieldStyle}>{company.address || "—"}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelStyle}>State</label>
            <div className={fieldStyle}>{company.addressState || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>Country</label>
            <div className={fieldStyle}>{company.addressCountry || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>Postcode/Zip</label>
            <div className={fieldStyle}>{company.addressPostcode || "—"}</div>
          </div>
        </div>
      </div>

      {/* Financial Detail */}
      <div className="mb-8">
        <h2 className={headingStyle}>FINANCIAL DETAIL</h2>
        <div className="mb-4">
          <div className={subheadingStyle}>Bank Details</div>
        </div>

        <div className="mb-4">
          <label className={labelStyle}>Branch Name</label>
          <div className={fieldStyle}>{company.bankBranchName || "—"}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelStyle}>State</label>
            <div className={fieldStyle}>{company.bankState || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>Country</label>
            <div className={fieldStyle}>{company.bankCountry || "—"}</div>
          </div>

          <div>
            <label className={labelStyle}>Postcode/Zip</label>
            <div className={fieldStyle}>{company.bankPostcode || "—"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Bank Certificate</label>
            <div className={fieldStyle}>{fileLink(company.bankCertificateUrl || company.bankCertificate)}</div>
          </div>

          <div>
            <label className={labelStyle}>Import/Export License</label>
            <div className={fieldStyle}>{fileLink(company.importExportLicenseUrl || company.importExportLicense)}</div>
          </div>
        </div>
      </div>

      {/* Admin actions footer */}
      <div className="mt-8 flex items-center justify-end gap-4">
        <button
          onClick={handleApprove}
          disabled={actioning}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {actioning ? "Processing..." : "Approve"}
        </button>

        <button
          onClick={handleUnderReview}
          disabled={actioning}
          className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {actioning ? "Processing..." : "Under Review"}
        </button>

        <button
          onClick={handleReject}
          disabled={actioning}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {actioning ? "Processing..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
