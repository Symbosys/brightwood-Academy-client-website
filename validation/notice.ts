import { z } from "zod";

// Enums matching Prisma schema
export const NoticeCategoryEnum = z.enum([
    "ADMISSION",
    "EXAMINATION",
    "HOLIDAY",
    "EVENT",
    "ACADEMIC",
    "SPORTS",
    "CULTURAL",
    "GENERAL",
    "IMPORTANT",
    "RESULT",
    "FEE",
    "SCHOLARSHIP",
    "VACANCY",
    "TENDER",
]);

export const NoticePriorityEnum = z.enum([
    "LOW",
    "NORMAL",
    "HIGH",
    "URGENT",
]);

// Slug validation (URL-friendly)
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Notice Schema
export const noticeSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title must not exceed 200 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must not exceed 1000 characters"),

    content: z
        .string()
        .max(10000, "Content must not exceed 10000 characters")
        .optional()
        .nullable(),

    category: NoticeCategoryEnum,

    priority: NoticePriorityEnum.default("NORMAL"),

    publishDate: z.coerce.date().optional().default(() => new Date()),

    expiryDate: z.coerce.date().optional().nullable(),

    eventDate: z.coerce.date().optional().nullable(),

    isPublished: z.boolean().default(false),

    isPinned: z.boolean().default(false),

    isActive: z.boolean().default(true),

    author: z
        .string()
        .min(2, "Author name must be at least 2 characters")
        .max(100, "Author name must not exceed 100 characters"),

    slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(200, "Slug must not exceed 200 characters")
        .regex(slugRegex, "Slug must be URL-friendly (lowercase, numbers, hyphens only)"),
});

// Update Notice Schema
export const updateNoticeSchema = z.object({
    id: z.string().cuid("Invalid notice ID"),

    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(200, "Title must not exceed 200 characters")
        .optional(),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must not exceed 1000 characters")
        .optional(),

    content: z
        .string()
        .max(10000, "Content must not exceed 10000 characters")
        .optional()
        .nullable(),

    category: NoticeCategoryEnum.optional(),

    priority: NoticePriorityEnum.optional(),

    publishDate: z.coerce.date().optional(),

    expiryDate: z.coerce.date().optional().nullable(),

    eventDate: z.coerce.date().optional().nullable(),

    isPublished: z.boolean().optional(),

    isPinned: z.boolean().optional(),

    isActive: z.boolean().optional(),

    slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .max(200, "Slug must not exceed 200 characters")
        .regex(slugRegex, "Slug must be URL-friendly (lowercase, numbers, hyphens only)")
        .optional(),
});

// Notice Attachment Schema
export const noticeAttachmentSchema = z.object({
    noticeId: z.string().cuid("Invalid notice ID"),
    fileName: z
        .string()
        .min(1, "File name is required")
        .max(255, "File name must not exceed 255 characters"),
    fileUrl: z.string().url("Invalid file URL"),
    fileType: z
        .string()
        .min(1, "File type is required")
        .max(50, "File type must not exceed 50 characters"),
    fileSize: z.number().int().positive("File size must be positive"),
});

// Get Notices Query Schema
export const getNoticesQuerySchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    category: NoticeCategoryEnum.optional(),
    priority: NoticePriorityEnum.optional(),
    isPublished: z.boolean().optional(),
    isPinned: z.boolean().optional(),
    isActive: z.boolean().optional(),
    searchQuery: z.string().optional(), // Search by title or description
    sortBy: z.enum(["createdAt", "updatedAt", "publishDate", "views"]).default("publishDate"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Delete Notice Schema
export const deleteNoticeSchema = z.object({
    id: z.string().cuid("Invalid notice ID"),
});

// Get Notice by ID Schema
export const getNoticeByIdSchema = z.object({
    id: z.string().cuid("Invalid notice ID"),
});

// Get Notice by Slug Schema
export const getNoticeBySlugSchema = z.object({
    slug: z
        .string()
        .min(3, "Slug must be at least 3 characters")
        .regex(slugRegex, "Invalid slug format"),
});

// Increment Views Schema
export const incrementViewsSchema = z.object({
    id: z.string().cuid("Invalid notice ID"),
});

// Delete Attachment Schema
export const deleteAttachmentSchema = z.object({
    id: z.string().cuid("Invalid attachment ID"),
});

// Type exports
export type NoticeInput = z.infer<typeof noticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
export type NoticeAttachmentInput = z.infer<typeof noticeAttachmentSchema>;
export type GetNoticesQuery = z.infer<typeof getNoticesQuerySchema>;
export type DeleteNoticeInput = z.infer<typeof deleteNoticeSchema>;
export type GetNoticeByIdInput = z.infer<typeof getNoticeByIdSchema>;
export type GetNoticeBySlugInput = z.infer<typeof getNoticeBySlugSchema>;
export type IncrementViewsInput = z.infer<typeof incrementViewsSchema>;
export type DeleteAttachmentInput = z.infer<typeof deleteAttachmentSchema>;
