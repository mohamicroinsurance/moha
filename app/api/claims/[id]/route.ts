import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET single claim
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const claim = await prisma.claim.findUnique({
      where: { id },
    });

    if (!claim) {
      return errorResponse("Claim not found", 404);
    }

    return successResponse(claim);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch claim", 500);
  }
}

// PUT update claim
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

    if (body.customerName) updateData.customerName = sanitizeInput(body.customerName);
    if (body.email) updateData.email = sanitizeInput(body.email);
    if (body.phone) updateData.phone = sanitizeInput(body.phone);
    if (body.type) updateData.type = sanitizeInput(body.type);
    if (body.amount) updateData.amount = parseFloat(body.amount);
    if (body.status) updateData.status = body.status;
    if (body.policyNumber) updateData.policyNumber = sanitizeInput(body.policyNumber);
    if (body.incidentDate) updateData.incidentDate = new Date(body.incidentDate);
    if (body.incidentLocation) updateData.incidentLocation = sanitizeInput(body.incidentLocation);
    if (body.description) updateData.description = sanitizeInput(body.description);
    if (body.notes !== undefined) updateData.notes = body.notes ? sanitizeInput(body.notes) : null;
    if (body.documents) updateData.documents = body.documents;

    const claim = await prisma.claim.update({
      where: { id },
      data: updateData,
    });

    return successResponse(claim);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update claim", 500);
  }
}

// DELETE claim
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth("ADMIN");
    if (error) return error;

    const { id } = await params;
    await prisma.claim.delete({
      where: { id },
    });

    return successResponse({ message: "Claim deleted successfully" });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete claim", 500);
  }
}
