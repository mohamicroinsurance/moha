import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET all news (public endpoint for published, auth required for drafts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    
    // Public endpoint shows only published news unless authenticated
    const session = await requireAuth();
    if (session.error) {
      where.status = "PUBLISHED";
    } else if (status) {
      where.status = status;
    }

    if (category) where.category = category;

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedDate: "desc" },
      }),
      prisma.news.count({ where }),
    ]);

    return successResponse({
      news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("News fetch error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to fetch news", 500);
  }
}

// POST create new news article
export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { title, content, category, status, imageUrl } = body;

    // Validation
    if (!title || !content || !category) {
      return errorResponse("Missing required fields");
    }

    // Validate title and content length
    if (title.length < 5) {
      return errorResponse("Title must be at least 5 characters long");
    }

    if (content.length < 50) {
      return errorResponse("Content must be at least 50 characters long");
    }

    const news = await prisma.news.create({
      data: {
        title: sanitizeInput(title),
        content: sanitizeInput(content),
        author: user!.name || "Admin",
        authorId: user!.id,
        category: sanitizeInput(category),
        status: status || "DRAFT",
        imageUrl: imageUrl || null,
      },
    });

    return successResponse(news, 201);
  } catch (error: any) {
    console.error("News creation error:", error);
    
    // Check for database connection errors
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to create news", 500);
  }
}
