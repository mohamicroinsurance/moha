import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { UserRole } from "@prisma/client";

// GET all users (authenticated users)
export async function GET(request: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;


    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Role filter
    if (role) {
      where.role = role as UserRole;
    }

    // Status filter
    if (status) {
      where.isActive = status === "active";
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
          phone: true,
          image: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return successResponse({
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Admin users fetch error:", error);

    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }

    return errorResponse(error.message || "Failed to fetch users", 500);
  }
}
