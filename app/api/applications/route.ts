import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, validateEmail, sanitizeInput } from "@/lib/api-utils";

// GET all applications (authenticated only)
export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = status ? { status: status as any } : {};

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({ where }),
    ]);

    return successResponse({
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Applications fetch error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to fetch applications", 500);
  }
}

// POST create new application (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      applicantName,
      email,
      phone,
      position,
      experience,
      education,
      currentCompany,
      expectedSalary,
      availableFrom,
      coverLetter,
      skills,
      references,
      cvUrl,
    } = body;

    // Validation
    if (!applicantName || !email || !phone || !position || !experience || !education || !coverLetter || !availableFrom) {
      return errorResponse("Missing required fields");
    }

    if (!validateEmail(email)) {
      return errorResponse("Invalid email format");
    }

    // Validate field lengths
    if (coverLetter.length < 50) {
      return errorResponse("Cover letter must be at least 50 characters long");
    }

    const application = await prisma.application.create({
      data: {
        applicantName: sanitizeInput(applicantName),
        email: sanitizeInput(email),
        phone: sanitizeInput(phone),
        position: sanitizeInput(position),
        experience: sanitizeInput(experience),
        education: sanitizeInput(education),
        currentCompany: currentCompany ? sanitizeInput(currentCompany) : null,
        expectedSalary: expectedSalary ? sanitizeInput(expectedSalary) : null,
        availableFrom: new Date(availableFrom),
        coverLetter: sanitizeInput(coverLetter),
        skills: skills || [],
        references: references ? sanitizeInput(references) : null,
        cvUrl: cvUrl || null,
      },
    });

    return successResponse(application, 201);
  } catch (error: any) {
    console.error("Application creation error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to create application", 500);
  }
}
