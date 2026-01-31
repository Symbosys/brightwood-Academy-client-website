import { z } from "zod";

// Enums matching Prisma schema
export const AdminRoleEnum = z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "EDITOR",
    "VIEWER",
]);

// Password validation (strong password)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Admin Registration Schema
export const adminRegistrationSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters")
        .toLowerCase(),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters")
        .regex(
            passwordRegex,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),

    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),

    role: AdminRoleEnum,
});

// Admin Login Schema
export const adminLoginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .toLowerCase(),

    password: z
        .string()
        .min(1, "Password is required"),
});

// Update Admin Schema
export const updateAdminSchema = z.object({
    id: z.string().cuid("Invalid admin ID"),

    email: z
        .string()
        .email("Invalid email address")
        .max(100, "Email must not exceed 100 characters")
        .toLowerCase()
        .optional()
        .or(z.literal("")),

    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .optional()
        .or(z.literal("")),

    role: AdminRoleEnum.optional(),

    isActive: z.boolean().optional(),
});

// Change Password Schema
export const changePasswordSchema = z.object({
    id: z.string().cuid("Invalid admin ID"),

    currentPassword: z
        .string()
        .min(1, "Current password is required"),

    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters"),

    confirmPassword: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

// Reset Password Schema (Admin reset for other users)
export const resetPasswordSchema = z.object({
    id: z.string().cuid("Invalid admin ID"),

    newPassword: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters"),
});

// Get Admins Query Schema
export const getAdminsQuerySchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    role: AdminRoleEnum.optional(),
    isActive: z.boolean().optional(),
    searchQuery: z.string().optional(), // Search by name or email
    sortBy: z.enum(["createdAt", "updatedAt", "name", "email", "lastLogin"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Delete Admin Schema
export const deleteAdminSchema = z.object({
    id: z.string().cuid("Invalid admin ID"),
});

// Get Admin by ID Schema
export const getAdminByIdSchema = z.object({
    id: z.string().cuid("Invalid admin ID"),
});

// Get Admin by Email Schema
export const getAdminByEmailSchema = z.object({
    email: z.string().email("Invalid email address").toLowerCase(),
});

// Toggle Admin Status Schema
export const toggleAdminStatusSchema = z.object({
    id: z.string().cuid("Invalid admin ID"),
});

// Type exports
export type AdminRegistrationInput = z.infer<typeof adminRegistrationSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type GetAdminsQuery = z.infer<typeof getAdminsQuerySchema>;
export type DeleteAdminInput = z.infer<typeof deleteAdminSchema>;
export type GetAdminByIdInput = z.infer<typeof getAdminByIdSchema>;
export type GetAdminByEmailInput = z.infer<typeof getAdminByEmailSchema>;
export type ToggleAdminStatusInput = z.infer<typeof toggleAdminStatusSchema>;
