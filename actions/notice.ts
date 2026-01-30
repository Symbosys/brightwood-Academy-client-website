"use server";

import { prisma } from "@/config/prisma";
import {
    noticeSchema,
    updateNoticeSchema,
    noticeAttachmentSchema,
    getNoticesQuerySchema,
    deleteNoticeSchema,
    getNoticeByIdSchema,
    getNoticeBySlugSchema,
    incrementViewsSchema,
    deleteAttachmentSchema,
    type NoticeInput,
    type UpdateNoticeInput,
    type NoticeAttachmentInput,
    type GetNoticesQuery,
} from "@/validation/notice";
import { revalidatePath } from "next/cache";

// ============================================
// CREATE NOTICE
// ============================================

export async function createNotice(data: NoticeInput) {
    try {
        // Validate input data
        const validatedData = noticeSchema.parse(data);

        // Check if slug already exists
        const existingNotice = await prisma.notice.findUnique({
            where: { slug: validatedData.slug },
        });

        if (existingNotice) {
            return {
                success: false,
                error: "A notice with this slug already exists. Please use a different slug.",
            };
        }

        // Create notice
        const notice = await prisma.notice.create({
            data: {
                ...validatedData,
                views: 0,
            },
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");

        return {
            success: true,
            data: notice,
            message: "Notice created successfully!",
        };
    } catch (error: any) {
        console.error("Error creating notice:", error);

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
                error: "A notice with this slug already exists.",
            };
        }

        return {
            success: false,
            error: "Failed to create notice. Please try again.",
        };
    }
}

// ============================================
// UPDATE NOTICE
// ============================================

export async function updateNotice(input: UpdateNoticeInput) {
    try {
        // Validate input
        const validatedInput = updateNoticeSchema.parse(input);
        const { id, ...updateData } = validatedInput;

        // If slug is being updated, check if it already exists
        if (updateData.slug) {
            const existingNotice = await prisma.notice.findUnique({
                where: { slug: updateData.slug },
            });

            if (existingNotice && existingNotice.id !== id) {
                return {
                    success: false,
                    error: "A notice with this slug already exists. Please use a different slug.",
                };
            }
        }

        // Update notice
        const notice = await prisma.notice.update({
            where: { id },
            data: updateData,
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");
        revalidatePath(`/news/${notice.slug}`);

        return {
            success: true,
            data: notice,
            message: "Notice updated successfully!",
        };
    } catch (error: any) {
        console.error("Error updating notice:", error);

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
                error: "Notice not found",
            };
        }

        return {
            success: false,
            error: "Failed to update notice. Please try again.",
        };
    }
}

// ============================================
// GET ALL NOTICES (WITH PAGINATION)
// ============================================

export async function getAllNotices(query?: Partial<GetNoticesQuery>) {
    try {
        // Validate and set defaults
        const validatedQuery = getNoticesQuerySchema.parse(query);
        const { page, limit, category, priority, isPublished, isPinned, isActive, searchQuery, sortBy, sortOrder } = validatedQuery;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (category) {
            where.category = category;
        }

        if (priority) {
            where.priority = priority;
        }

        if (isPublished !== undefined) {
            where.isPublished = isPublished;
        }

        if (isPinned !== undefined) {
            where.isPinned = isPinned;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (searchQuery) {
            where.OR = [
                { title: { contains: searchQuery } },
                { description: { contains: searchQuery } },
                { content: { contains: searchQuery } },
            ];
        }

        // Get total count for pagination
        const totalCount = await prisma.notice.count({ where });

        // Get notices with attachments
        const notices = await prisma.notice.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                attachments: true,
            },
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            success: true,
            data: notices,
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
        console.error("Error fetching notices:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid query parameters",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch notices. Please try again.",
        };
    }
}

// ============================================
// GET NOTICE BY ID
// ============================================

export async function getNoticeById(id: string) {
    try {
        // Validate input
        const validatedInput = getNoticeByIdSchema.parse({ id });

        // Get notice with attachments
        const notice = await prisma.notice.findUnique({
            where: { id: validatedInput.id },
            include: {
                attachments: true,
            },
        });

        if (!notice) {
            return {
                success: false,
                error: "Notice not found",
            };
        }

        return {
            success: true,
            data: notice,
        };
    } catch (error: any) {
        console.error("Error fetching notice:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid notice ID",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch notice. Please try again.",
        };
    }
}

// ============================================
// GET NOTICE BY SLUG
// ============================================

export async function getNoticeBySlug(slug: string) {
    try {
        // Validate input
        const validatedInput = getNoticeBySlugSchema.parse({ slug });

        // Get notice with attachments
        const notice = await prisma.notice.findUnique({
            where: { slug: validatedInput.slug },
            include: {
                attachments: true,
            },
        });

        if (!notice) {
            return {
                success: false,
                error: "Notice not found",
            };
        }

        return {
            success: true,
            data: notice,
        };
    } catch (error: any) {
        console.error("Error fetching notice by slug:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid slug format",
                details: error.errors,
            };
        }

        return {
            success: false,
            error: "Failed to fetch notice. Please try again.",
        };
    }
}

// ============================================
// DELETE NOTICE
// ============================================

export async function deleteNotice(id: string) {
    try {
        // Validate input
        const validatedInput = deleteNoticeSchema.parse({ id });

        // Delete notice (attachments will be cascade deleted)
        await prisma.notice.delete({
            where: { id: validatedInput.id },
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");

        return {
            success: true,
            message: "Notice deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting notice:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid notice ID",
                details: error.errors,
            };
        }

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Notice not found",
            };
        }

        return {
            success: false,
            error: "Failed to delete notice. Please try again.",
        };
    }
}

// ============================================
// ADD NOTICE ATTACHMENT
// ============================================

export async function addNoticeAttachment(data: NoticeAttachmentInput) {
    try {
        // Validate input
        const validatedData = noticeAttachmentSchema.parse(data);

        // Create attachment
        const attachment = await prisma.noticeAttachment.create({
            data: validatedData,
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");

        return {
            success: true,
            data: attachment,
            message: "Attachment added successfully!",
        };
    } catch (error: any) {
        console.error("Error adding attachment:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Validation failed",
                details: error.errors,
            };
        }

        if (error.code === "P2003") {
            return {
                success: false,
                error: "Notice not found",
            };
        }

        return {
            success: false,
            error: "Failed to add attachment. Please try again.",
        };
    }
}

// ============================================
// DELETE NOTICE ATTACHMENT
// ============================================

export async function deleteNoticeAttachment(id: string) {
    try {
        // Validate input
        const validatedInput = deleteAttachmentSchema.parse({ id });

        // Delete attachment
        await prisma.noticeAttachment.delete({
            where: { id: validatedInput.id },
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");

        return {
            success: true,
            message: "Attachment deleted successfully",
        };
    } catch (error: any) {
        console.error("Error deleting attachment:", error);

        if (error.name === "ZodError") {
            return {
                success: false,
                error: "Invalid attachment ID",
                details: error.errors,
            };
        }

        if (error.code === "P2025") {
            return {
                success: false,
                error: "Attachment not found",
            };
        }

        return {
            success: false,
            error: "Failed to delete attachment. Please try again.",
        };
    }
}

// ============================================
// INCREMENT NOTICE VIEWS
// ============================================

export async function incrementNoticeViews(id: string) {
    try {
        // Validate input
        const validatedInput = incrementViewsSchema.parse({ id });

        // Increment views
        const notice = await prisma.notice.update({
            where: { id: validatedInput.id },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        return {
            success: true,
            data: { views: notice.views },
        };
    } catch (error: any) {
        console.error("Error incrementing views:", error);
        return {
            success: false,
            error: "Failed to increment views",
        };
    }
}

// ============================================
// GET PINNED NOTICES
// ============================================

export async function getPinnedNotices(limit: number = 5) {
    try {
        const notices = await prisma.notice.findMany({
            where: {
                isPinned: true,
                isPublished: true,
                isActive: true,
            },
            take: limit,
            orderBy: {
                publishDate: "desc",
            },
            include: {
                attachments: true,
            },
        });

        return {
            success: true,
            data: notices,
        };
    } catch (error: any) {
        console.error("Error fetching pinned notices:", error);
        return {
            success: false,
            error: "Failed to fetch pinned notices. Please try again.",
        };
    }
}

// ============================================
// GET RECENT NOTICES
// ============================================

export async function getRecentNotices(limit: number = 10) {
    try {
        const notices = await prisma.notice.findMany({
            where: {
                isPublished: true,
                isActive: true,
            },
            take: limit,
            orderBy: {
                publishDate: "desc",
            },
            include: {
                attachments: true,
            },
        });

        return {
            success: true,
            data: notices,
        };
    } catch (error: any) {
        console.error("Error fetching recent notices:", error);
        return {
            success: false,
            error: "Failed to fetch recent notices. Please try again.",
        };
    }
}

// ============================================
// GET NOTICE STATISTICS
// ============================================

export async function getNoticeStatistics() {
    try {
        const [
            totalNotices,
            publishedNotices,
            draftNotices,
            pinnedNotices,
            urgentNotices,
            admissionNotices,
            examinationNotices,
            eventNotices,
        ] = await Promise.all([
            prisma.notice.count({ where: { isActive: true } }),
            prisma.notice.count({ where: { isPublished: true, isActive: true } }),
            prisma.notice.count({ where: { isPublished: false, isActive: true } }),
            prisma.notice.count({ where: { isPinned: true, isActive: true } }),
            prisma.notice.count({ where: { priority: "URGENT", isActive: true } }),
            prisma.notice.count({ where: { category: "ADMISSION", isActive: true } }),
            prisma.notice.count({ where: { category: "EXAMINATION", isActive: true } }),
            prisma.notice.count({ where: { category: "EVENT", isActive: true } }),
        ]);

        return {
            success: true,
            data: {
                totalNotices,
                publishedNotices,
                draftNotices,
                pinnedNotices,
                byPriority: {
                    urgent: urgentNotices,
                },
                byCategory: {
                    admission: admissionNotices,
                    examination: examinationNotices,
                    event: eventNotices,
                },
            },
        };
    } catch (error: any) {
        console.error("Error fetching notice statistics:", error);
        return {
            success: false,
            error: "Failed to fetch statistics. Please try again.",
        };
    }
}

// ============================================
// BULK DELETE NOTICES
// ============================================

export async function bulkDeleteNotices(ids: string[]) {
    try {
        if (!ids || ids.length === 0) {
            return {
                success: false,
                error: "No notices selected",
            };
        }

        // Delete multiple notices
        const result = await prisma.notice.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");

        return {
            success: true,
            data: { count: result.count },
            message: `${result.count} notice(s) deleted successfully`,
        };
    } catch (error: any) {
        console.error("Error bulk deleting notices:", error);
        return {
            success: false,
            error: "Failed to delete notices. Please try again.",
        };
    }
}

// ============================================
// TOGGLE NOTICE PUBLISH STATUS
// ============================================

export async function toggleNoticePublishStatus(id: string) {
    try {
        // Get current notice
        const notice = await prisma.notice.findUnique({
            where: { id },
            select: { isPublished: true },
        });

        if (!notice) {
            return {
                success: false,
                error: "Notice not found",
            };
        }

        // Toggle publish status
        const updatedNotice = await prisma.notice.update({
            where: { id },
            data: {
                isPublished: !notice.isPublished,
            },
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");

        return {
            success: true,
            data: updatedNotice,
            message: `Notice ${updatedNotice.isPublished ? "published" : "unpublished"} successfully`,
        };
    } catch (error: any) {
        console.error("Error toggling publish status:", error);
        return {
            success: false,
            error: "Failed to toggle publish status. Please try again.",
        };
    }
}

// ============================================
// TOGGLE NOTICE PIN STATUS
// ============================================

export async function toggleNoticePinStatus(id: string) {
    try {
        // Get current notice
        const notice = await prisma.notice.findUnique({
            where: { id },
            select: { isPinned: true },
        });

        if (!notice) {
            return {
                success: false,
                error: "Notice not found",
            };
        }

        // Toggle pin status
        const updatedNotice = await prisma.notice.update({
            where: { id },
            data: {
                isPinned: !notice.isPinned,
            },
        });

        // Revalidate relevant pages
        revalidatePath("/news");
        revalidatePath("/admin/notices");

        return {
            success: true,
            data: updatedNotice,
            message: `Notice ${updatedNotice.isPinned ? "pinned" : "unpinned"} successfully`,
        };
    } catch (error: any) {
        console.error("Error toggling pin status:", error);
        return {
            success: false,
            error: "Failed to toggle pin status. Please try again.",
        };
    }
}
