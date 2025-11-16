import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth, sanitizeInput } from "@/lib/api-utils";

// GET single news article
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return errorResponse("News article not found", 404);
    }

    // Only show published news for non-authenticated users
    const session = await requireAuth();
    if (session.error && news.status !== "PUBLISHED") {
      return errorResponse("News article not found", 404);
    }

    return successResponse(news);
  } catch (error: any) {
    console.error("News fetch error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    return errorResponse(error.message || "Failed to fetch news article", 500);
  }
}

// PATCH update news article
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

    if (body.title) {
      if (body.title.length < 5) {
        return errorResponse("Title must be at least 5 characters long");
      }
      updateData.title = sanitizeInput(body.title);
    }
    
    if (body.content) {
      if (body.content.length < 50) {
        return errorResponse("Content must be at least 50 characters long");
      }
      updateData.content = sanitizeInput(body.content);
    }
    
    if (body.category) updateData.category = sanitizeInput(body.category);
    if (body.status) updateData.status = body.status;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;

    const news = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    return successResponse(news);
  } catch (error: any) {
    console.error("News update error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    if (error.code === 'P2025') {
      return errorResponse("News article not found", 404);
    }
    
    return errorResponse(error.message || "Failed to update news article", 500);
  }
}

// DELETE news article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await requireAuth("ADMIN");
    if (error) return error;

    const { id } = await params;

    await prisma.news.delete({
      where: { id },
    });

    return successResponse({ message: "News article deleted successfully" });
  } catch (error: any) {
    console.error("News delete error:", error);
    
    if (error.code === 'P1001' || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }
    
    if (error.code === 'P2025') {
      return errorResponse("News article not found or already deleted", 404);
    }
    
    return errorResponse(error.message || "Failed to delete news article", 500);
  }
}
