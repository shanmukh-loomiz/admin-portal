// src/app/components/Companies.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Companies() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugRawResponse, setDebugRawResponse] = useState(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugRawResponse(null);

      let apiUrl = "/api/companies"; // backend route for fetching companies
      const queryParams = new URLSearchParams();
      if (statusFilter && statusFilter !== "All Status") queryParams.append("status", statusFilter);
      if (searchQuery) queryParams.append("search", searchQuery);

      if (queryParams.toString()) {
        apiUrl += `?${queryParams.toString()}`;
      }

      const res = await fetch(apiUrl, {
        method: "GET",
        // If your API requires cookies/auth, consider enabling credentials:
        // credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });

      // Helpful debug values
      const redirected = res.redirected;
      const status = res.status;
      const contentType = res.headers.get("content-type") || "";

      // If the response is not successful, try to read text to see what's returned (HTML error page or message)
      if (!res.ok) {
        const text = await res.text();
        console.error("Companies fetch failed", { apiUrl, status, redirected, contentType, text });
        setDebugRawResponse(text.slice(0, 1000)); // show first chunk for debugging
        throw new Error(`Request failed with status ${status}${redirected ? " (redirected)" : ""}`);
      }

      // If content-type indicates JSON, parse JSON. If not, surface text for debugging.
      if (contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Companies fetch JSON:", data);

        // Backend shape expected: { success: true, data: [...] }
        if (data && data.success && Array.isArray(data.data)) {
          setCompanies(data.data);
        } else if (Array.isArray(data)) {
          // In case backend returns raw array
          setCompanies(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setCompanies(data.data);
        } else {
          console.warn("Unexpected JSON shape:", data);
          setDebugRawResponse(JSON.stringify(data).slice(0, 1000));
          setCompanies([]);
          setError("Unexpected response shape from server (check console/debug).");
        }
      } else {
        // Non-JSON content type (likely HTML). Read it and surface for debugging.
        const text = await res.text();
        console.error("Expected JSON but got non-JSON response", { contentType, text });
        setDebugRawResponse(text.slice(0, 2000));
        throw new Error("Server returned non-JSON response (likely an HTML error or a redirect to login).");
      }
    } catch (err) {
      console.error("fetchCompanies error:", err);
      setError(err.message || "Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // initial load + when statusFilter changes (search remains manual via form)
  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800";
      case "Unverified":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="ml-[350px] mt-[60px] p-8 min-h-[calc(100vh-75px)] mr-[50px] bg-white rounded-[20px] mb-[50px]">
      <h1 className="text-[36px] font-[NSmedium] text-[#233B6E] mb-8">Companies</h1>

      {/* Filters */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              <option>All Status</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Search</label>
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search by name, GST ID, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l-md px-4 py-2 w-full"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-md">Search</button>
            </form>
          </div>
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="mb-4">
          <p className="text-red-500">{error}</p>
          <div className="mt-2">
            <button onClick={fetchCompanies} className="bg-gray-200 px-3 py-1 rounded mr-2">Retry</button>
            <button onClick={() => { setDebugRawResponse(null); setError(null); }} className="bg-gray-100 px-3 py-1 rounded">Clear</button>
          </div>
        </div>
      )}

      {/* Debug raw response (HTML / page snippet) */}
      {debugRawResponse && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <strong>Server returned non-JSON content (first bytes):</strong>
          <pre className="whitespace-pre-wrap text-xs mt-2">{debugRawResponse}</pre>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-10 w-10 border-2 border-gray-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No companies found
                  </td>
                </tr>
              ) : (
                companies.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{c.registeredCompanyName || c.name || "—"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(c.hasBeenVerified ? "Verified" : "Unverified")}`}>
                        {c.hasBeenVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="py-3 px-4">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => router.push(`/companies/${c._id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

