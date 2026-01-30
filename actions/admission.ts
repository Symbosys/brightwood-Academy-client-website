"use server";

import { prisma } from "@/config/prisma";
import {
    admissionApplicationSchema,
    updateApplicationStatusSchema,
    getApplicationsQuerySchema,
    deleteApplicationSchema,
    getApplicationByIdSchema,
    type AdmissionApplicationInput,
    type UpdateApplicationStatusInput,
    type GetApplicationsQuery,
} from "@/validation/admission";
import { revalidatePath } from "next/cache";


// Helper function to generate unique application number
async function generateApplicationNumber(academicYear: string): Promise<string> {
    const year = academicYear.split("-")[0];
    const count = await prisma.admissionApplication.count({
        where: { academicYear },
    });
    const sequence = (count + 1).toString().padStart(4, "0");
    return `BW${year}${sequence}`;
}

// ============================================
// CREATE ADMISSION APPLICATION
// ============================================

export async function createAdmissionApplication(data: AdmissionApplicationInput) {
    try {
        // Validate input data
        const validatedData = admissionApplicationSchema.parse(data);

        // Generate unique application number
        const applicationNumber = await generateApplicationNumber(validatedData.academicYear);

        // Create admission application
        const application = await prisma.admissionApplication.create({
            data: {
                ...validatedData,
                applicationNumber,
                status: "PENDING",
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admissions");
        revalidatePath("/admin/applications");

        return {
            success: true,
            data: application,
            message: `Application submitted successfully! Your application number is ${applicationNumber}`,
        };
    } catch (error: any) {
        console.error("Error creating admission application:", error);

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
                error: "Duplicate entry. Aadhar number already exists.",
            };
        }

        return {
            success: false,
            error: "Failed to submit application. Please try again.",
        };
    }
}

// ============================================
// GET ALL ADMISSION APPLICATIONS (WITH PAGINATION)
// ============================================

export async function getAllAdmissionApplications(query?: Partial<GetApplicationsQuery>) {
    try {
        // Validate and set defaults
        const validatedQuery = getApplicationsQuerySchema.parse(query);
        const { page, limit, status, academicYear, classApplyingFor, searchQuery, sortBy, sortOrder } = validatedQuery;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (academicYear) {
            where.academicYear = academicYear;
        }

        if (classApplyingFor) {
            where.classApplyingFor = classApplyingFor;
        }

        if (searchQuery) {
            where.OR = [
                { studentFirstName: { contains: searchQuery } },
                { studentLastName: { contains: searchQuery } },
                { applicationNumber: { contains: searchQuery } },
                { fatherName: { contains: searchQuery } },
                { motherName: { contains: searchQuery } },
            ];
        }

        // Get total count for pagination
        const totalCount = await prisma.admissionApplication.count({ where });

        // Get applications
        const applications = await prisma.admissionApplication.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            success: true,
            data: applications,
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
        console.error("Error fetching admission applications:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid query parameters",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch applications. Please try again.",
        };
    }
}

// ============================================
// GET ADMISSION APPLICATION BY ID
// ============================================

export async function getAdmissionApplicationById(id: string) {
    try {
        // Validate input
        const validatedInput = getApplicationByIdSchema.parse({ id });

        // Get application
        const application = await prisma.admissionApplication.findUnique({
            where: { id: validatedInput.id },
        });

        if (!application) {
            return {
                success: false,
                error: "Application not found",
            };
        }

        return {
            success: true,
            data: application,
        };
    } catch (error: any) {
        console.error("Error fetching admission application:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid application ID",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch application. Please try again.",
        };
    }
}

// ============================================
// GET ADMISSION APPLICATION BY APPLICATION NUMBER
// ============================================

export async function getAdmissionApplicationByNumber(applicationNumber: string) {
    try {
        if (!applicationNumber || applicationNumber.trim() === "") {
            return {
                success: false,
                error: "Application number is required",
            };
        }

        const application = await prisma.admissionApplication.findUnique({
            where: { applicationNumber },
        });

        if (!application) {
            return {
                success: false,
                error: "Application not found",
            };
        }

        return {
            success: true,
            data: application,
        };
    } catch (error: any) {
        console.error("Error fetching admission application by number:", error);
        return {
            success: false,
            error: "Failed to fetch application. Please try again.",
        };
    }
}

// ============================================
// UPDATE ADMISSION APPLICATION STATUS
// ============================================

export async function updateAdmissionApplicationStatus(input: UpdateApplicationStatusInput) {
    try {
        // Validate input
        const validatedInput = updateApplicationStatusSchema.parse(input);

        // Update application
        const application = await prisma.admissionApplication.update({
            where: { id: validatedInput.id },
            data: {
                status: validatedInput.status,
                remarks: validatedInput.remarks,
                reviewedBy: validatedInput.reviewedBy,
                reviewedAt: new Date(),
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/applications");
        revalidatePath(`/admin/applications/${validatedInput.id}`);

        return {
            success: true,
            data: application,
            message: "Application status updated successfully",
        };
    } catch (error: any) {
        console.error("Error updating application status:", error);

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
                error: "Application not found",
            };
        }

        return {
            success: false,
            error: "Failed to update application status. Please try again.",
        };
    }
}

// ============================================
// DELETE ADMISSION APPLICATION
// ============================================

export async function deleteAdmissionApplication(id: string) {
    try {
        // Validate input
        const validatedInput = deleteApplicationSchema.parse({ id });

        // Delete application
        await prisma.admissionApplication.delete({
            where: { id: validatedInput.id },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/applications");

        return {
            success: true,
            message: "Application deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting admission application:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid application ID",
                details: error.errors,
            };
        }

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Application not found",
            };
        }

        return {
            success: false,
            error: "Failed to delete application. Please try again.",
        };
    }
}

// ============================================
// GET APPLICATION STATISTICS
// ============================================

export async function getAdmissionStatistics(academicYear?: string) {
    try {
        const where = academicYear ? { academicYear } : {};

        const [
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            admittedApplications,
        ] = await Promise.all([
            prisma.admissionApplication.count({ where }),
            prisma.admissionApplication.count({ where: { ...where, status: "PENDING" } }),
            prisma.admissionApplication.count({ where: { ...where, status: "APPROVED" } }),
            prisma.admissionApplication.count({ where: { ...where, status: "REJECTED" } }),
            prisma.admissionApplication.count({ where: { ...where, status: "ADMITTED" } }),
        ]);

        return {
            success: true,
            data: {
                totalApplications,
                pendingApplications,
                approvedApplications,
                rejectedApplications,
                admittedApplications,
            },
        };
    } catch (error: any) {
        console.error("Error fetching admission statistics:", error);
        return {
            success: false,
            error: "Failed to fetch statistics. Please try again.",
        };
    }
}

// ============================================
// BULK UPDATE APPLICATION STATUS
// ============================================

export async function bulkUpdateApplicationStatus(
    ids: string[],
    status: string,
    reviewedBy: string
) {
    try {
        if (!ids || ids.length === 0) {
            return {
                success: false,
                error: "No applications selected",
            };
        }

        // Update multiple applications
        const result = await prisma.admissionApplication.updateMany({
            where: {
                id: { in: ids },
            },
            data: {
                status: status as any,
                reviewedBy,
                reviewedAt: new Date(),
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/applications");

        return {
            success: true,
            data: { count: result.count },
            message: `${result.count} application(s) updated successfully`,
        };
    } catch (error: any) {
        console.error("Error bulk updating applications:", error);
        return {
            success: false,
            error: "Failed to update applications. Please try again.",
        };
    }
}
