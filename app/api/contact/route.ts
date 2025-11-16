import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, validateEmail, sanitizeInput } from "@/lib/api-utils";

// POST create contact request (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return errorResponse("Missing required fields");
    }

    if (!validateEmail(email)) {
      return errorResponse("Invalid email format");
    }

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        phone: phone ? sanitizeInput(phone) : null,
        subject: sanitizeInput(subject),
        message: sanitizeInput(message),
      },
    });

    return successResponse(contactRequest, 201);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to submit contact request", 500);
  }
}
