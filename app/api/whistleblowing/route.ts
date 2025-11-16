import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET all reports
export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [reports, total] = await Promise.all([
      prisma.whistleblowingReport.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.whistleblowingReport.count({ where }),
    ]);

    return successResponse({
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch reports", 500);
  }
}

// POST create new report (public endpoint - no auth required for whistleblowing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      priority,
      isAnonymous,
      reporterName,
      reporterEmail,
      reporterPhone,
      description,
      location,
      witnessDetails,
      documents,
    } = body;

    // Validation
    if (!type || !description) {
      return errorResponse("Missing required fields");
    }

    // Validate description length
    if (description.length < 20) {
      return errorResponse("Please provide a more detailed description (minimum 20 characters)");
    }

    // For non-anonymous reports, email is optional but recommended
    if (!isAnonymous && reporterEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(reporterEmail)) {
        return errorResponse("Invalid email format");
      }
    }

    const report = await prisma.whistleblowingReport.create({
      data: {
        type: sanitizeInput(type),
        priority: priority || "MEDIUM",
        isAnonymous: Boolean(isAnonymous),
        reporterName: reporterName ? sanitizeInput(reporterName) : null,
        reporterEmail: reporterEmail ? sanitizeInput(reporterEmail) : null,
        reporterPhone: reporterPhone ? sanitizeInput(reporterPhone) : null,
        description: sanitizeInput(description),
        location: location ? sanitizeInput(location) : null,
        witnessDetails: witnessDetails ? sanitizeInput(witnessDetails) : null,
      },
    });

    return successResponse(report, 201);
  } catch (error: any) {
    console.error("Whistleblowing report creation error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to create report", 500);
  }
}
