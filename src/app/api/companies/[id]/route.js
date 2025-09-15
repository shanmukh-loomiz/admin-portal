// src/app/api/companies/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Company from "../../../../models/Company";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const company = await Company.findById(id).lean();
    if (!company) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: company });
  } catch (err) {
    console.error("/api/companies/[id] GET error:", err);
    return NextResponse.json({ success: false, message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    // Build allowed update object
    const allowed = {};

    // existing allowed fields
    if (typeof body.hasBeenVerified === "boolean") allowed.hasBeenVerified = body.hasBeenVerified;
    if (typeof body.registeredCompanyName === "string") allowed.registeredCompanyName = body.registeredCompanyName;
    if (typeof body.gstNumber === "string") allowed.gstNumber = body.gstNumber;
    if (typeof body.panNumber === "string") allowed.panNumber = body.panNumber;
    // allow gstTaxId field name (since your model uses gstTaxId)
    if (typeof body.gstTaxId === "string") allowed.gstTaxId = body.gstTaxId;

    // New workflow fields
    if (typeof body.status === "string" && ['Pending','Under Review','Approved','Rejected'].includes(body.status)) {
      allowed.status = body.status;
      // If approved -> set verification audit fields
      if (body.status === "Approved") {
        allowed.hasBeenVerified = true;
        allowed.verifiedAt = new Date();
        if (typeof body.verifiedBy === "string") allowed.verifiedBy = body.verifiedBy;
      } else {
        // If not approved, optionally clear verifiedAt/verifiedBy when moving out of Approved
        if (body.status !== "Approved") {
          allowed.verifiedAt = undefined;
          allowed.verifiedBy = undefined;
          // Do not automatically flip hasBeenVerified to false unless explicitly provided.
          if (body.status === "Pending" || body.status === "Rejected" || body.status === "Under Review") {
            // If you want to force hasBeenVerified false on reject/unreview, uncomment:
            // allowed.hasBeenVerified = false;
          }
        }
      }
    }

    if (typeof body.rejectionReason === "string") {
      allowed.rejectionReason = body.rejectionReason;
      if (body.status === "Rejected") {
        allowed.verifiedAt = undefined;
        allowed.verifiedBy = undefined;
      }
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ success: false, message: "No valid fields to update" }, { status: 400 });
    }

    // Clean undefined keys (so we don't set fields to undefined in DB)
    Object.keys(allowed).forEach((k) => {
      if (typeof allowed[k] === "undefined") delete allowed[k];
    });

    const updated = await Company.findByIdAndUpdate(id, { $set: allowed }, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("/api/companies/[id] PATCH error:", err);
    return NextResponse.json({ success: false, message: "Server error", error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const deleted = await Company.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Company deleted" });
  } catch (err) {
    console.error("/api/companies/[id] DELETE error:", err);
    return NextResponse.json({ success: false, message: "Server error", error: String(err) }, { status: 500 });
  }
}
