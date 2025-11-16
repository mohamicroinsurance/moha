import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET all documents (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = category ? { category } : {};

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.document.count({ where }),
    ]);

    return successResponse({
      documents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Documents fetch error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to fetch documents", 500);
  }
}

// POST create new document
export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { title, description, category, fileUrl, fileSize, fileType } = body;

    // Validation
    if (!title || !description || !category || !fileUrl || !fileSize || !fileType) {
      return errorResponse("Missing required fields");
    }

    // Validate title and description length
    if (title.length < 3) {
      return errorResponse("Title must be at least 3 characters long");
    }

    if (description.length < 10) {
      return errorResponse("Description must be at least 10 characters long");
    }

    const document = await prisma.document.create({
      data: {
        title: sanitizeInput(title),
        description: sanitizeInput(description),
        category: sanitizeInput(category),
        fileUrl,
        fileSize,
        fileType,
        uploadedBy: user!.name || "Admin",
        uploaderId: user!.id,
      },
    });

    return successResponse(document, 201);
  } catch (error: any) {
    console.error("Document creation error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to create document", 500);
  }
}
