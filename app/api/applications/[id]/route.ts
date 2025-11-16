import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET single application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const application = await prisma.application.findUnique({
      where: { id: id },
    });

    if (!application) {
      return errorResponse("Application not found", 404);
    }

    return successResponse(application);
  } catch (error: any) {
    console.error("Application fetch error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to fetch application", 500);
  }
}

// PATCH update application
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const body = await request.json();
    const updateData: any = {};

    if (body.status) updateData.status = body.status;
    if (body.interviewDate !== undefined) updateData.interviewDate = body.interviewDate ? new Date(body.interviewDate) : null;
    if (body.interviewNotes !== undefined) updateData.interviewNotes = body.interviewNotes ? sanitizeInput(body.interviewNotes) : null;

    const application = await prisma.application.update({
      where: { id: id },
      data: updateData,
    });

    return successResponse(application);
  } catch (error: any) {
    console.error("Application update error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    if (error.code === 'P2025') {
      return errorResponse("Application not found", 404);
    }
    
    return errorResponse(error.message || "Failed to update application", 500);
  }
}

// DELETE application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth("ADMIN");
    if (error) return error;

    const { id } = await params;

    await prisma.application.delete({
      where: { id: id },
    });

    return successResponse({ message: "Application deleted successfully" });
  } catch (error: any) {
    console.error("Application delete error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    if (error.code === 'P2025') {
      return errorResponse("Application not found or already deleted", 404);
    }
    
    return errorResponse(error.message || "Failed to delete application", 500);
  }
}
