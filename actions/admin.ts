"use server";

import { prisma } from "@/config/prisma";
import {
    adminRegistrationSchema,
    adminLoginSchema,
    updateAdminSchema,
    changePasswordSchema,
    resetPasswordSchema,
    getAdminsQuerySchema,
    deleteAdminSchema,
    getAdminByIdSchema,
    getAdminByEmailSchema,
    toggleAdminStatusSchema,
    type AdminRegistrationInput,
    type AdminLoginInput,
    type UpdateAdminInput,
    type ChangePasswordInput,
    type ResetPasswordInput,
    type GetAdminsQuery,
} from "@/validation/admin";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { login, logout } from "@/lib/auth";

// ============================================
// REGISTER ADMIN
// ============================================

export async function registerAdmin(data: AdminRegistrationInput) {
    try {
        // Validate input data
        const validatedData = adminRegistrationSchema.parse(data);

        // Check if email already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: validatedData.email },
        });

        if (existingAdmin) {
            return {
                success: false,
                error: "An admin with this email already exists.",
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                role: validatedData.role,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/users");

        return {
            success: true,
            data: admin,
            message: "Admin registered successfully!",
        };
    } catch (error: any) {
        console.error("Error registering admin:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }

        if (error.code === "P2002") {
            return {
                success: false,
                error: "An admin with this email already exists.",
            };
        }

        return {
            success: false,
            error: "Failed to register admin. Please try again.",
        };
    }
}

// ============================================
// LOGIN ADMIN
// ============================================

export async function loginAdmin(data: AdminLoginInput) {
    try {
        // Validate input data
        const validatedData = adminLoginSchema.parse(data);

        // Find admin by email
        const admin = await prisma.admin.findUnique({
            where: { email: validatedData.email },
        });

        if (!admin) {
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        // Check if admin is active
        if (!admin.isActive) {
            return {
                success: false,
                error: "Your account has been deactivated. Please contact support.",
            };
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            validatedData.password,
            admin.password
        );

        if (!isPasswordValid) {
            return {
                success: false,
                error: "Invalid email or password",
            };
        }

        // Update last login
        await prisma.admin.update({
            where: { id: admin.id },
            data: { lastLogin: new Date() },
        });

        // Return admin data (without password)
        const { password, ...adminData } = admin;

        // Set session cookie
        await login(adminData);

        return {
            success: true,
            data: adminData,
            message: "Login successful!",
        };
    } catch (error: any) {
        console.error("Error logging in admin:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to login. Please try again.",
        };
    }
}

export async function logoutAdmin() {
    await logout();
    revalidatePath("/");
    return { success: true };
}


// ============================================
// UPDATE ADMIN
// ============================================

export async function updateAdmin(input: UpdateAdminInput) {
    try {
        // Validate input
        const validatedInput = updateAdminSchema.parse(input);
        const { id, ...updateData } = validatedInput;

        // If email is being updated, check if it already exists
        if (updateData.email) {
            const existingAdmin = await prisma.admin.findUnique({
                where: { email: updateData.email },
            });

            if (existingAdmin && existingAdmin.id !== id) {
                return {
                    success: false,
                    error: "An admin with this email already exists.",
                };
            }
        }

        // Update admin
        const admin = await prisma.admin.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/users");
        revalidatePath(`/admin/users/${id}`);

        return {
            success: true,
            data: admin,
            message: "Admin updated successfully!",
        };
    } catch (error: any) {
        console.error("Error updating admin:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        if (error.code === "P2002") {
            return {
                success: false,
                error: "An admin with this email already exists.",
            };
        }

        return {
            success: false,
            error: "Failed to update admin. Please try again.",
        };
    }
}

// ============================================
// CHANGE PASSWORD
// ============================================

export async function changeAdminPassword(input: ChangePasswordInput) {
    try {
        // Validate input
        const validatedInput = changePasswordSchema.parse(input);

        // Get admin
        const admin = await prisma.admin.findUnique({
            where: { id: validatedInput.id },
        });

        if (!admin) {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            validatedInput.currentPassword,
            admin.password
        );

        if (!isPasswordValid) {
            return {
                success: false,
                error: "Current password is incorrect",
            };
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(validatedInput.newPassword, 10);

        // Update password
        await prisma.admin.update({
            where: { id: validatedInput.id },
            data: { password: hashedPassword },
        });

        return {
            success: true,
            message: "Password changed successfully!",
        };
    } catch (error: any) {
        console.error("Error changing password:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to change password. Please try again.",
        };
    }
}

// ============================================
// RESET PASSWORD (Admin reset for other users)
// ============================================

export async function resetAdminPassword(input: ResetPasswordInput) {
    try {
        // Validate input
        const validatedInput = resetPasswordSchema.parse(input);

        // Hash new password
        const hashedPassword = await bcrypt.hash(validatedInput.newPassword, 10);

        // Update password
        await prisma.admin.update({
            where: { id: validatedInput.id },
            data: { password: hashedPassword },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/users");

        return {
            success: true,
            message: "Password reset successfully!",
        };
    } catch (error: any) {
        console.error("Error resetting password:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        return {
            success: false,
            error: "Failed to reset password. Please try again.",
        };
    }
}

// ============================================
// GET ALL ADMINS (WITH PAGINATION)
// ============================================

export async function getAllAdmins(query?: Partial<GetAdminsQuery>) {
    try {
        // Validate and set defaults
        const validatedQuery = getAdminsQuerySchema.parse(query);
        const { page, limit, role, isActive, searchQuery, sortBy, sortOrder } = validatedQuery;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (role) {
            where.role = role;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery } },
                { email: { contains: searchQuery } },
            ];
        }

        // Get total count for pagination
        const totalCount = await prisma.admin.count({ where });

        // Get admins (without passwords)
        const admins = await prisma.admin.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            success: true,
            data: admins,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPreviousPage,
            },
        };
    } catch (error: any) {
        console.error("Error fetching admins:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid query parameters",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch admins. Please try again.",
        };
    }
}

// ============================================
// GET ADMIN BY ID
// ============================================

export async function getAdminById(id: string) {
    try {
        // Validate input
        const validatedInput = getAdminByIdSchema.parse({ id });

        // Get admin (without password)
        const admin = await prisma.admin.findUnique({
            where: { id: validatedInput.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!admin) {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        return {
            success: true,
            data: admin,
        };
    } catch (error: any) {
        console.error("Error fetching admin:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid admin ID",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch admin. Please try again.",
        };
    }
}

// ============================================
// GET ADMIN BY EMAIL
// ============================================

export async function getAdminByEmail(email: string) {
    try {
        // Validate input
        const validatedInput = getAdminByEmailSchema.parse({ email });

        // Get admin (without password)
        const admin = await prisma.admin.findUnique({
            where: { email: validatedInput.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!admin) {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        return {
            success: true,
            data: admin,
        };
    } catch (error: any) {
        console.error("Error fetching admin by email:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid email address",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch admin. Please try again.",
        };
    }
}

// ============================================
// DELETE ADMIN
// ============================================

export async function deleteAdmin(id: string) {
    try {
        // Validate input
        const validatedInput = deleteAdminSchema.parse({ id });

        // Check if admin exists and is not the last super admin
        const admin = await prisma.admin.findUnique({
            where: { id: validatedInput.id },
        });

        if (!admin) {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        // Prevent deleting the last super admin
        if (admin.role === "SUPER_ADMIN") {
            const superAdminCount = await prisma.admin.count({
                where: { role: "SUPER_ADMIN" },
            });

            if (superAdminCount <= 1) {
                return {
                    success: false,
                    error: "Cannot delete the last Super Admin",
                };
            }
        }

        // Delete admin
        await prisma.admin.delete({
            where: { id: validatedInput.id },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/users");

        return {
            success: true,
            message: "Admin deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting admin:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid admin ID",
                details: error.errors,
            };
        }

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        return {
            success: false,
            error: "Failed to delete admin. Please try again.",
        };
    }
}

// ============================================
// TOGGLE ADMIN STATUS
// ============================================

export async function toggleAdminStatus(id: string) {
    try {
        // Validate input
        const validatedInput = toggleAdminStatusSchema.parse({ id });

        // Get current admin
        const admin = await prisma.admin.findUnique({
            where: { id: validatedInput.id },
            select: { isActive: true, role: true },
        });

        if (!admin) {
            return {
                success: false,
                error: "Admin not found",
            };
        }

        // Prevent deactivating the last active super admin
        if (admin.role === "SUPER_ADMIN" && admin.isActive) {
            const activeSuperAdminCount = await prisma.admin.count({
                where: { role: "SUPER_ADMIN", isActive: true },
            });

            if (activeSuperAdminCount <= 1) {
                return {
                    success: false,
                    error: "Cannot deactivate the last active Super Admin",
                };
            }
        }

        // Toggle status
        const updatedAdmin = await prisma.admin.update({
            where: { id: validatedInput.id },
            data: {
                isActive: !admin.isActive,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/users");

        return {
            success: true,
            data: updatedAdmin,
            message: `Admin ${updatedAdmin.isActive ? "activated" : "deactivated"} successfully`,
        };
    } catch (error: any) {
        console.error("Error toggling admin status:", error);
        return {
            success: false,
            error: "Failed to toggle admin status. Please try again.",
        };
    }
}

// ============================================
// GET ADMIN STATISTICS
// ============================================

export async function getAdminStatistics() {
    try {
        const [
            totalAdmins,
            activeAdmins,
            inactiveAdmins,
            superAdmins,
            admins,
            editors,
            viewers,
        ] = await Promise.all([
            prisma.admin.count(),
            prisma.admin.count({ where: { isActive: true } }),
            prisma.admin.count({ where: { isActive: false } }),
            prisma.admin.count({ where: { role: "SUPER_ADMIN" } }),
            prisma.admin.count({ where: { role: "ADMIN" } }),
            prisma.admin.count({ where: { role: "EDITOR" } }),
            prisma.admin.count({ where: { role: "VIEWER" } }),
        ]);

        return {
            success: true,
            data: {
                totalAdmins,
                activeAdmins,
                inactiveAdmins,
                byRole: {
                    superAdmin: superAdmins,
                    admin: admins,
                    editor: editors,
                    viewer: viewers,
                },
            },
        };
    } catch (error: any) {
        console.error("Error fetching admin statistics:", error);
        return {
            success: false,
            error: "Failed to fetch statistics. Please try again.",
        };
    }
}

// ============================================
// BULK DELETE ADMINS
// ============================================

export async function bulkDeleteAdmins(ids: string[]) {
    try {
        if (!ids || ids.length === 0) {
            return {
                success: false,
                error: "No admins selected",
            };
        }

        // Check if any of the admins to delete are super admins
        const superAdminsToDelete = await prisma.admin.count({
            where: {
                id: { in: ids },
                role: "SUPER_ADMIN",
            },
        });

        if (superAdminsToDelete > 0) {
            const totalSuperAdmins = await prisma.admin.count({
                where: { role: "SUPER_ADMIN" },
            });

            if (totalSuperAdmins - superAdminsToDelete < 1) {
                return {
                    success: false,
                    error: "Cannot delete all Super Admins. At least one must remain.",
                };
            }
        }

        // Delete multiple admins
        const result = await prisma.admin.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/users");

        return {
            success: true,
            data: { count: result.count },
            message: `${result.count} admin(s) deleted successfully`,
        };
    } catch (error: any) {
        console.error("Error bulk deleting admins:", error);
        return {
            success: false,
            error: "Failed to delete admins. Please try again.",
        };
    }
}
