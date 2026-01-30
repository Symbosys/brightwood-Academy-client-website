"use server";


import { prisma } from "@/config/prisma";
import {
    contactInquirySchema,
    updateInquiryStatusSchema,
    getInquiriesQuerySchema,
    deleteInquirySchema,
    getInquiryByIdSchema,
    type ContactInquiryInput,
    type UpdateInquiryStatusInput,
    type GetInquiriesQuery,
} from "@/validation/inquiry";
import { revalidatePath } from "next/cache";

// ============================================
// CREATE CONTACT INQUIRY
// ============================================

export async function createContactInquiry(
    data: ContactInquiryInput,
    ipAddress?: string
) {
    try {
        // Validate input data
        const validatedData = contactInquirySchema.parse(data);

        // Create contact inquiry
        const inquiry = await prisma.contactInquiry.create({
            data: {
                ...validatedData,
                status: "NEW",
                ipAddress: ipAddress || null,
            },
        });

        // Revalidate relevant pages
        revalidatePath("/contact");
        revalidatePath("/admin/inquiries");

        return {
            success: true,
            data: inquiry,
            message: "Your inquiry has been submitted successfully! We will get back to you soon.",
        };
    } catch (error: any) {
        console.error("Error creating contact inquiry:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to submit inquiry. Please try again.",
        };
    }
}

// ============================================
// GET ALL CONTACT INQUIRIES (WITH PAGINATION)
// ============================================

export async function getAllContactInquiries(query?: Partial<GetInquiriesQuery>) {
    try {
        // Validate and set defaults
        const validatedQuery = getInquiriesQuerySchema.parse(query);
        const { page, limit, status, subject, searchQuery, sortBy, sortOrder } = validatedQuery;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (subject) {
            where.subject = subject;
        }

        if (searchQuery) {
            where.OR = [
                { fullName: { contains: searchQuery } },
                { email: { contains: searchQuery } },
                { message: { contains: searchQuery } },
            ];
        }

        // Get total count for pagination
        const totalCount = await prisma.contactInquiry.count({ where });

        // Get inquiries
        const inquiries = await prisma.contactInquiry.findMany({
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
            data: inquiries,
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
        console.error("Error fetching contact inquiries:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid query parameters",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch inquiries. Please try again.",
        };
    }
}

// ============================================
// GET CONTACT INQUIRY BY ID
// ============================================

export async function getContactInquiryById(id: string) {
    try {
        // Validate input
        const validatedInput = getInquiryByIdSchema.parse({ id });

        // Get inquiry
        const inquiry = await prisma.contactInquiry.findUnique({
            where: { id: validatedInput.id },
        });

        if (!inquiry) {
            return {
                success: false,
                error: "Inquiry not found",
            };
        }

        return {
            success: true,
            data: inquiry,
        };
    } catch (error: any) {
        console.error("Error fetching contact inquiry:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid inquiry ID",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch inquiry. Please try again.",
        };
    }
}

// ============================================
// UPDATE CONTACT INQUIRY STATUS
// ============================================

export async function updateContactInquiryStatus(input: UpdateInquiryStatusInput) {
    try {
        // Validate input
        const validatedInput = updateInquiryStatusSchema.parse(input);

        // Update inquiry
        const inquiry = await prisma.contactInquiry.update({
            where: { id: validatedInput.id },
            data: {
                status: validatedInput.status,
                response: validatedInput.response,
                respondedBy: validatedInput.respondedBy,
                respondedAt: new Date(),
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/inquiries");
        revalidatePath(`/admin/inquiries/${validatedInput.id}`);

        return {
            success: true,
            data: inquiry,
            message: "Inquiry status updated successfully",
        };
    } catch (error: any) {
        console.error("Error updating inquiry status:", error);

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
                error: "Inquiry not found",
            };
        }

        return {
            success: false,
            error: "Failed to update inquiry status. Please try again.",
        };
    }
}

// ============================================
// DELETE CONTACT INQUIRY
// ============================================

export async function deleteContactInquiry(id: string) {
    try {
        // Validate input
        const validatedInput = deleteInquirySchema.parse({ id });

        // Delete inquiry
        await prisma.contactInquiry.delete({
            where: { id: validatedInput.id },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/inquiries");

        return {
            success: true,
            message: "Inquiry deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting contact inquiry:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid inquiry ID",
                details: error.errors,
            };
        }

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Inquiry not found",
            };
        }

        return {
            success: false,
            error: "Failed to delete inquiry. Please try again.",
        };
    }
}

// ============================================
// GET INQUIRY STATISTICS
// ============================================

export async function getInquiryStatistics() {
    try {
        const [
            totalInquiries,
            newInquiries,
            inProgressInquiries,
            resolvedInquiries,
            closedInquiries,
            admissionInquiries,
            supportInquiries,
            feedbackInquiries,
            complaintInquiries,
        ] = await Promise.all([
            prisma.contactInquiry.count(),
            prisma.contactInquiry.count({ where: { status: "NEW" } }),
            prisma.contactInquiry.count({ where: { status: "IN_PROGRESS" } }),
            prisma.contactInquiry.count({ where: { status: "RESOLVED" } }),
            prisma.contactInquiry.count({ where: { status: "CLOSED" } }),
            prisma.contactInquiry.count({ where: { subject: "ADMISSION_INQUIRY" } }),
            prisma.contactInquiry.count({ where: { subject: "GENERAL_SUPPORT" } }),
            prisma.contactInquiry.count({ where: { subject: "FEEDBACK" } }),
            prisma.contactInquiry.count({ where: { subject: "COMPLAINT" } }),
        ]);

        return {
            success: true,
            data: {
                totalInquiries,
                byStatus: {
                    new: newInquiries,
                    inProgress: inProgressInquiries,
                    resolved: resolvedInquiries,
                    closed: closedInquiries,
                },
                bySubject: {
                    admissionInquiry: admissionInquiries,
                    generalSupport: supportInquiries,
                    feedback: feedbackInquiries,
                    complaint: complaintInquiries,
                },
            },
        };
    } catch (error: any) {
        console.error("Error fetching inquiry statistics:", error);
        return {
            success: false,
            error: "Failed to fetch statistics. Please try again.",
        };
    }
}

// ============================================
// BULK UPDATE INQUIRY STATUS
// ============================================

export async function bulkUpdateInquiryStatus(
    ids: string[],
    status: string,
    respondedBy: string
) {
    try {
        if (!ids || ids.length === 0) {
            return {
                success: false,
                error: "No inquiries selected",
            };
        }

        // Update multiple inquiries
        const result = await prisma.contactInquiry.updateMany({
            where: {
                id: { in: ids },
            },
            data: {
                status: status as any,
                respondedBy,
                respondedAt: new Date(),
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/inquiries");

        return {
            success: true,
            data: { count: result.count },
            message: `${result.count} inquiry(ies) updated successfully`,
        };
    } catch (error: any) {
        console.error("Error bulk updating inquiries:", error);
        return {
            success: false,
            error: "Failed to update inquiries. Please try again.",
        };
    }
}

// ============================================
// BULK DELETE INQUIRIES
// ============================================

export async function bulkDeleteInquiries(ids: string[]) {
    try {
        if (!ids || ids.length === 0) {
            return {
                success: false,
                error: "No inquiries selected",
            };
        }

        // Delete multiple inquiries
        const result = await prisma.contactInquiry.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        // Revalidate relevant pages
        revalidatePath("/admin/inquiries");

        return {
            success: true,
            data: { count: result.count },
            message: `${result.count} inquiry(ies) deleted successfully`,
        };
    } catch (error: any) {
        console.error("Error bulk deleting inquiries:", error);
        return {
            success: false,
            error: "Failed to delete inquiries. Please try again.",
        };
    }
}

// ============================================
// GET RECENT INQUIRIES
// ============================================

export async function getRecentInquiries(limit: number = 5) {
    try {
        const inquiries = await prisma.contactInquiry.findMany({
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            where: {
                status: "NEW",
            },
        });

        return {
            success: true,
            data: inquiries,
        };
    } catch (error: any) {
        console.error("Error fetching recent inquiries:", error);
        return {
            success: false,
            error: "Failed to fetch recent inquiries. Please try again.",
        };
    }
}
