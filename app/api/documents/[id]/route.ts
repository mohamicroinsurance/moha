import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET single document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return errorResponse("Document not found", 404);
    }

    return successResponse(document);
  } catch (error: any) {
    console.error("Document fetch error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to fetch document", 500);
  }
}

// PUT update document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const updateData: any = {};

    if (body.title) {
      if (body.title.length < 3) {
        return errorResponse("Title must be at least 3 characters long");
      }
      updateData.title = sanitizeInput(body.title);
    }
    
    if (body.description) {
      if (body.description.length < 10) {
        return errorResponse("Description must be at least 10 characters long");
      }
      updateData.description = sanitizeInput(body.description);
    }
    
    if (body.category) updateData.category = sanitizeInput(body.category);

    const document = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    return successResponse(document);
  } catch (error: any) {
    console.error("Document update error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    if (error.code === 'P2025') {
      return errorResponse("Document not found", 404);
    }
    
    return errorResponse(error.message || "Failed to update document", 500);
  }
}

// PATCH increment download count
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.document.update({
      where: { id },
      data: {
        downloads: {
          increment: 1,
        },
      },
    });

    return successResponse(document);
  } catch (error: any) {
    console.error("Download count update error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    if (error.code === 'P2025') {
      return errorResponse("Document not found", 404);
    }
    
    return errorResponse(error.message || "Failed to update download count", 500);
  }
}

// DELETE document
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth("ADMIN");
    if (error) return error;

    const { id } = await params;
    await prisma.document.delete({
      where: { id },
    });

    return successResponse({ message: "Document deleted successfully" });
  } catch (error: any) {
    console.error("Document delete error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    if (error.code === 'P2025') {
      return errorResponse("Document not found or already deleted", 404);
    }
    
    return errorResponse(error.message || "Failed to delete document", 500);
  }
}
