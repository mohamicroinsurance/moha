import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, validateEmail, sanitizeInput } from "@/lib/api-utils";

// GET all quotes
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

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.quote.count({ where }),
    ]);

    return successResponse({
      quotes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch quotes", 500);
  }
}

// POST create new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      productType,
      amount,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleRegNo,
      notes,
      expiryDate,
    } = body;

    // Validation
    if (!customerName || !email || !phone || !productType || !amount || !expiryDate) {
      return errorResponse("Missing required fields");
    }

    if (!validateEmail(email)) {
      return errorResponse("Invalid email format");
    }

    const quote = await prisma.quote.create({
      data: {
        customerName: sanitizeInput(customerName),
        email: sanitizeInput(email),
        phone: sanitizeInput(phone),
        productType: sanitizeInput(productType),
        amount: parseFloat(amount),
        vehicleMake: vehicleMake ? sanitizeInput(vehicleMake) : null,
        vehicleModel: vehicleModel ? sanitizeInput(vehicleModel) : null,
        vehicleYear: vehicleYear ? sanitizeInput(vehicleYear) : null,
        vehicleRegNo: vehicleRegNo ? sanitizeInput(vehicleRegNo) : null,
        notes: notes ? sanitizeInput(notes) : null,
        expiryDate: new Date(expiryDate),
      },
    });

    return successResponse(quote, 201);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create quote", 500);
  }
}
