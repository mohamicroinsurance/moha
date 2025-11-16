import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET single quote
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      return errorResponse("Quote not found", 404);
    }

    return successResponse(quote);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch quote", 500);
  }
}

// PUT update quote
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

    // Only update provided fields
    if (body.customerName) updateData.customerName = sanitizeInput(body.customerName);
    if (body.email) updateData.email = sanitizeInput(body.email);
    if (body.phone) updateData.phone = sanitizeInput(body.phone);
    if (body.productType) updateData.productType = sanitizeInput(body.productType);
    if (body.amount) updateData.amount = parseFloat(body.amount);
    if (body.status) updateData.status = body.status;
    if (body.vehicleMake !== undefined) updateData.vehicleMake = body.vehicleMake ? sanitizeInput(body.vehicleMake) : null;
    if (body.vehicleModel !== undefined) updateData.vehicleModel = body.vehicleModel ? sanitizeInput(body.vehicleModel) : null;
    if (body.vehicleYear !== undefined) updateData.vehicleYear = body.vehicleYear ? sanitizeInput(body.vehicleYear) : null;
    if (body.vehicleRegNo !== undefined) updateData.vehicleRegNo = body.vehicleRegNo ? sanitizeInput(body.vehicleRegNo) : null;
    if (body.notes !== undefined) updateData.notes = body.notes ? sanitizeInput(body.notes) : null;
    if (body.expiryDate) updateData.expiryDate = new Date(body.expiryDate);

    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
    });

    return successResponse(quote);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update quote", 500);
  }
}

// DELETE quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth("ADMIN");
    if (error) return error;

    const { id } = await params;
    await prisma.quote.delete({
      where: { id },
    });

    return successResponse({ message: "Quote deleted successfully" });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete quote", 500);
  }
}
