import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { UserRole } from "@prisma/client";

// DELETE user (authenticated users, cannot delete self)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    // unwrap async params
    const { id: userId } = await context.params;

    if (!userId || typeof userId !== 'string') {
      return errorResponse("User id is required", 400);
    }

    // Prevent self-deletion
    if (userId === user!.id) {
      return errorResponse("Cannot delete your own account", 403);
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return errorResponse("User not found", 404);
    }

    // SUPER_ADMIN can delete anyone
    // ADMIN can only delete USER role accounts
    if (user!.role === UserRole.ADMIN) {
      if (targetUser.role === UserRole.ADMIN || targetUser.role === UserRole.SUPER_ADMIN) {
        return errorResponse("Admins cannot delete other admin accounts", 403);
      }
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return successResponse({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete user error:", error);

    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }

    if (error.code === "P2025") {
      return errorResponse("User not found", 404);
    }

    return errorResponse(error.message || "Failed to delete user", 500);
  }
}

// PATCH user (toggle active status, authenticated users, cannot deactivate self)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { error, user } = await requireAuth();
    if (error) return error;

    // unwrap async params
    const { id: userId } = await context.params;
    const body = await request.json();
    const { isActive } = body;

    if (!userId || typeof userId !== 'string') {
      return errorResponse("User id is required", 400);
    }

    // Prevent self-deactivation
    if (userId === user!.id) {
      return errorResponse("Cannot deactivate your own account", 403);
    }

    // Validate input
    if (typeof isActive !== "boolean") {
      return errorResponse("Invalid isActive value. Must be a boolean.", 400);
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return errorResponse("User not found", 404);
    }

    // SUPER_ADMIN can modify anyone
    // ADMIN can only modify USER role accounts
    if (user!.role === UserRole.ADMIN) {
      if (targetUser.role === UserRole.ADMIN || targetUser.role === UserRole.SUPER_ADMIN) {
        return errorResponse("Admins cannot modify other admin accounts", 403);
      }
    }

    // Update user status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error: any) {
    console.error("Update user error:", error);

    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return errorResponse("Database connection error. Please try again later.", 503);
    }

    if (error.code === "P2025") {
      return errorResponse("User not found", 404);
    }

    return errorResponse(error.message || "Failed to update user", 500);
  }
}
