import { NextRequest } from "next/server";
import { successResponse, errorResponse, requireAuth } from "@/lib/api-utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "moha-insurance";
    const isPublic = formData.get("public") === "true";

    if (!file) {
      return errorResponse("No file provided");
    }

    // For public uploads (whistleblowing, applications, contact forms), enforce stricter limits
    if (isPublic || folder.includes("whistleblowing") || folder.includes("applications")) {
      // Check file size (max 10MB for public uploads)
      if (file.size > 10 * 1024 * 1024) {
        return errorResponse("File size exceeds 10MB limit for public uploads");
      }

      // Validate file type for public uploads
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        return errorResponse("Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX");
      }
    } else {
      // For authenticated uploads, require auth and allow larger files
      const { error } = await requireAuth();
      if (error) return error;

      // Check file size (max 10MB for authenticated uploads)
      if (file.size > 10 * 1024 * 1024) {
        return errorResponse("File size exceeds 10MB limit");
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, folder);

    return successResponse({
      url: result.url,
      publicId: result.publicId,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    
    // Check for Cloudinary-specific errors
    if (error.message?.includes("Cloudinary")) {
      return errorResponse("Failed to upload file to storage service", 500);
    }

    return errorResponse(error.message || "Failed to upload file", 500);
  }
}
