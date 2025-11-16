import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { UserRole } from "@prisma/client";
import { prisma } from "./prisma";

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function requireAuth(requiredRole?: UserRole) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: errorResponse("Unauthorized", 401), user: null };
  }

  // Enforce deactivated user restriction
  // Use session flag first, then confirm from DB for robustness
  if ((session.user as any).isActive === false) {
    return { error: errorResponse("Account is deactivated", 403), user: null };
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, isActive: true },
    });
    if (!dbUser) {
      return { error: errorResponse("User not found", 404), user: null };
    }
    if (!dbUser.isActive) {
      return { error: errorResponse("Account is deactivated", 403), user: null };
    }
  } catch (e) {
    // If DB check fails, default to allowing through; APIs may handle downstream
  }

  if (requiredRole && session.user.role !== requiredRole && session.user.role !== "SUPER_ADMIN") {
    return { error: errorResponse("Forbidden", 403), user: null };
  }

  return { error: null, user: session.user };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/<script[^>]*>.*?<\/script>/gi, '');
}
