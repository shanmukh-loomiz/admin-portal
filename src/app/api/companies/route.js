// src/app/api/companies/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import Company from "../../../models/Company";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query = {};

    // status filter
    if (status && status !== "All Status") {
      query.hasBeenVerified = status === "Verified";
    }

    // search filter (company name, GST, PAN)
    if (search) {
      query.$or = [
        { registeredCompanyName: { $regex: search, $options: "i" } },
        { gstNumber: { $regex: search, $options: "i" } },
        { panNumber: { $regex: search, $options: "i" } },
      ];
    }

    const companies = await Company.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: companies });
  } catch (err) {
    console.error("/api/companies GET error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch companies", error: String(err) },
      { status: 500 }
    );
  }
}
