import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, sanitizeInput } from "@/lib/api-utils";

// POST create callback request (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, preferredTime, message } = body;

    // Validation
    if (!name || !phone) {
      return errorResponse("Missing required fields");
    }

    const callbackRequest = await prisma.callbackRequest.create({
      data: {
        name: sanitizeInput(name),
        phone: sanitizeInput(phone),
        email: email ? sanitizeInput(email) : null,
        preferredTime: preferredTime ? sanitizeInput(preferredTime) : null,
        message: message ? sanitizeInput(message) : null,
      },
    });

    return successResponse(callbackRequest, 201);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to submit callback request", 500);
  }
}
