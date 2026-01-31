import { z } from "zod";

// Enums matching Prisma schema
export const InquirySubjectEnum = z.enum([
    "ADMISSION_INQUIRY",
    "GENERAL_SUPPORT",
    "FEEDBACK",
    "COMPLAINT",
    "OTHERS",
]);

export const InquiryStatusEnum = z.enum([
    "NEW",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
]);

// Phone number validation (Indian format)
const phoneRegex = /^[6-9]\d{9}$/;

// Contact Inquiry Schema
export const contactInquirySchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(150, "Name must not exceed 150 characters"),

    email: z
        .string()
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters"),

    phone: z
        .string()
        .regex(phoneRegex, "Invalid phone number. Must be 10 digits starting with 6-9")
        .nullable()
        .optional()
        .or(z.literal("")),

    subject: InquirySubjectEnum,

    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(2000, "Message must not exceed 2000 characters"),
});

// Update Inquiry Status Schema
export const updateInquiryStatusSchema = z.object({
    id: z.string().cuid("Invalid inquiry ID"),
    status: InquiryStatusEnum,
    response: z
        .string()
        .max(2000, "Response must not exceed 2000 characters")
        .optional()
        .nullable(),
    respondedBy: z.string().min(1, "Responder name is required"),
});

// Get Inquiries Query Schema
export const getInquiriesQuerySchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    status: InquiryStatusEnum.optional(),
    subject: InquirySubjectEnum.optional(),
    searchQuery: z.string().optional(), // Search by name or email
    sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Delete Inquiry Schema
export const deleteInquirySchema = z.object({
    id: z.string().cuid("Invalid inquiry ID"),
});

// Get Inquiry by ID Schema
export const getInquiryByIdSchema = z.object({
    id: z.string().cuid("Invalid inquiry ID"),
});

// Type exports
export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
export type GetInquiriesQuery = z.infer<typeof getInquiriesQuerySchema>;
export type DeleteInquiryInput = z.infer<typeof deleteInquirySchema>;
export type GetInquiryByIdInput = z.infer<typeof getInquiryByIdSchema>;
