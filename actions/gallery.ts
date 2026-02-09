"use server";

import cloudinary, { uploadToCloudinary } from "@/config/cloudinary";
import { prisma } from "@/config/prisma";
import {
    createGalleryImageSchema,
    getGalleryQuerySchema,
    updateGalleryImageSchema,
    type GetGalleryQuery
} from "@/validation/gallery";
import { revalidatePath } from "next/cache";

/**
 * Server action to upload an image to Cloudinary
 */
export async function uploadImageAction(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) throw new Error("No file uploaded");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadToCloudinary(buffer, "brightwood/gallery", file.type);
        return { success: true, ...result };
    } catch (error: any) {
        console.error("Gallery Upload Error Details:", {
            message: error.message,
            stack: error.stack,
            error
        });
        return { success: false, error: error.message || "Upload failed" };
    }
}

/**
 * Create a new gallery image record
 */
export async function createGalleryImage(data: any) {
    try {
        // Transform incoming data if needed (e.g. date strings to Date objects)
        const validatedData = createGalleryImageSchema.parse(data);

        const image = await prisma.galleryImage.create({
            data: {
                ...validatedData,
                uploadedBy: "",
            },
        });

        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");

        return {
            success: true,
            data: image,
            message: "Image added to gallery successfully!",
        };
    } catch (error: any) {
        console.error("Error creating gallery image:", error);
        return {
            success: false,
            error: error.name === "ZodError" ? "Validation failed" : error.message || "Failed to add image",
            details: error.errors,
        };
    }
}

/**
 * Update an existing gallery image
 */
export async function updateGalleryImage(data: any) {
    try {
        const validatedData = updateGalleryImageSchema.parse(data);
        const { id, ...updateData } = validatedData;

        const updatedImage = await prisma.galleryImage.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");

        return {
            success: true,
            data: updatedImage,
            message: "Gallery image updated successfully!",
        };
    } catch (error: any) {
        console.error("Error updating gallery image:", error);
        return {
            success: false,
            error: error.name === "ZodError" ? "Validation failed" : error.message || "Failed to update image",
        };
    }
}

/**
 * Delete a gallery image and its Cloudinary counterpart
 */
export async function deleteGalleryImage(id: string) {
    try {
        // 1. Get the image record to get the publicId
        const image = await prisma.galleryImage.findUnique({
            where: { id },
        });

        if (!image) {
            return { success: false, error: "Image not found" };
        }

        // 2. Delete from Cloudinary
        if (image.publicId) {
            try {
                await cloudinary.uploader.destroy(image.publicId);
            } catch (clError) {
                console.error("Cloudinary deletion error:", clError);
                // Continue with DB deletion even if Cloudinary fails (or maybe don't? depends on policy)
            }
        }

        // 3. Delete from database
        await prisma.galleryImage.delete({
            where: { id },
        });

        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");

        return {
            success: true,
            message: "Image deleted successfully!",
        };
    } catch (error: any) {
        console.error("Error deleting gallery image:", error);
        return {
            success: false,
            error: error.message || "Failed to delete image",
        };
    }
}

/**
 * Fetch gallery images with pagination and filtering
 */
export async function getGalleryImages(query: Partial<GetGalleryQuery> = {}) {
    try {
        const validatedQuery = getGalleryQuerySchema.parse(query);
        const { category, isPublished, limit, page } = validatedQuery;

        const skip = (page - 1) * limit;

        const where: any = {};
        if (category) where.category = category;
        if (isPublished !== undefined) where.isPublished = isPublished;

        const [images, totalCount] = await Promise.all([
            prisma.galleryImage.findMany({
                where,
                orderBy: [
                    { order: "asc" },
                    { createdAt: "desc" }
                ],
                skip,
                take: limit,
            }),
            prisma.galleryImage.count({ where }),
        ]);

        return {
            success: true,
            data: images,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page,
                limit,
            },
        };
    } catch (error: any) {
        console.error("Error fetching gallery images:", error);
        return {
            success: false,
            error: "Failed to fetch gallery images",
        };
    }
}

/**
 * Toggle visibility of a gallery image
 */
export async function toggleImageVisibility(id: string) {
    try {
        const image = await prisma.galleryImage.findUnique({
            where: { id },
            select: { isPublished: true },
        });

        if (!image) return { success: false, error: "Image not found" };

        const updated = await prisma.galleryImage.update({
            where: { id },
            data: { isPublished: !image.isPublished },
        });

        revalidatePath("/gallery");
        revalidatePath("/admin/gallery");

        return {
            success: true,
            data: updated,
            message: `Image ${updated.isPublished ? "published" : "hidden"} successfully!`,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to toggle visibility",
        };
    }
}
