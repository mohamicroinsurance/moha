import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET single report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const report = await prisma.whistleblowingReport.findUnique({
      where: { id: id },
    });

    if (!report) {
      return errorResponse("Report not found", 404);
    }

    return successResponse(report);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch report", 500);
  }
}

// PATCH update report
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
    if (body.priority) updateData.priority = body.priority;
    if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo || null;
    if (body.actionTaken !== undefined) updateData.actionTaken = body.actionTaken ? sanitizeInput(body.actionTaken) : null;
    if (body.investigationNotes !== undefined) updateData.investigationNotes = body.investigationNotes ? sanitizeInput(body.investigationNotes) : null;

    const report = await prisma.whistleblowingReport.update({
      where: { id: id },
      data: updateData,
    });

    return successResponse(report);
  } catch (error: any) {
    console.error("Whistleblowing report update error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    // Check for record not found
    if (error.code === 'P2025') {
      return errorResponse("Report not found", 404);
    }
    
    return errorResponse(error.message || "Failed to update report", 500);
  }
}

// DELETE report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth("ADMIN");
    if (error) return error;

    const { id } = await params;

    await prisma.whistleblowingReport.delete({
      where: { id: id },
    });

    return successResponse({ message: "Report deleted successfully" });
  } catch (error: any) {
    console.error("Whistleblowing report delete error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    // Check for record not found
    if (error.code === 'P2025') {
      return errorResponse("Report not found or already deleted", 404);
    }
    
    return errorResponse(error.message || "Failed to delete report", 500);
  }
}
