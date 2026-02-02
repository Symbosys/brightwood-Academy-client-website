import { z } from "zod";

export const GALLERY_CATEGORIES = [
    "ACADEMIC",
    "SPORTS",
    "CULTURAL",
    "EVENTS",
    "INFRASTRUCTURE",
    "ACHIEVEMENTS",
    "CELEBRATIONS",
    "OTHERS",
] as const;

export const galleryCategorySchema = z.enum(GALLERY_CATEGORIES);

export const createGalleryImageSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(500).optional().nullable(),
    imageUrl: z.string().url("Invalid image URL"),
    publicId: z.string().min(1, "Public ID is required"),
    thumbnailUrl: z.string().url("Invalid thumbnail URL").optional().nullable(),
    category: galleryCategorySchema,
    eventName: z.string().max(100).optional().nullable(),
    eventDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null),
    isPublished: z.boolean().default(true),
    order: z.number().int().default(0),
});

export const updateGalleryImageSchema = createGalleryImageSchema.partial().extend({
    id: z.string().min(1, "Image ID is required"),
});

export const getGalleryQuerySchema = z.object({
    category: galleryCategorySchema.optional(),
    isPublished: z.boolean().optional(),
    limit: z.number().int().positive().default(20),
    page: z.number().int().positive().default(1),
});

export type GalleryCategory = z.infer<typeof galleryCategorySchema>;
export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type GetGalleryQuery = z.infer<typeof getGalleryQuerySchema>;
