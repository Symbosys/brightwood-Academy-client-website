'use client';

import { useState, useTransition } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Pin, Send, Loader2 } from 'lucide-react';
import {
    getAllNotices,
    deleteNotice,
    toggleNoticePublishStatus,
    toggleNoticePinStatus,
} from '@/actions/notice';
import { useRouter } from 'next/navigation';

type Notice = any; // Using any to avoid type mismatch with Prisma generated types

type Pagination = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Stats = {
    totalNotices: number;
    publishedNotices?: number;
    draftNotices?: number;
    pinnedNotices?: number;
    byPriority?: {
        low?: number;
        normal?: number;
        high?: number;
        urgent: number;
    };
    byCategory?: {
        admission: number;
        examination: number;
        holiday?: number;
        event: number;
        academic?: number;
        sports?: number;
        cultural?: number;
        general?: number;
        important?: number;
    };
};

export default function AdminNoticesClient({
    initialNotices,
    initialPagination,
    initialStats,
}: {
    initialNotices: Notice[];
    initialPagination: Pagination | null;
    initialStats: Stats | null;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [notices, setNotices] = useState(initialNotices);
    const [pagination, setPagination] = useState(initialPagination);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const stats = initialStats ? {
        totalNotices: initialStats.totalNotices || 0,
        published: initialStats.publishedNotices || 0,
        drafts: initialStats.draftNotices || 0,
        pinned: initialStats.pinnedNotices || 0,
    } : {
        totalNotices: 0,
        published: 0,
        drafts: 0,
        pinned: 0,
    };

    // Fetch notices with filters
    const fetchNotices = async (page: number = 1) => {
        setIsLoading(true);
        const result = await getAllNotices({
            page,
            limit: 10,
            category: categoryFilter !== 'all' ? categoryFilter as any : undefined,
            searchQuery: searchQuery || undefined,
        });

        if (result.success) {
            setNotices(result.data || []);
            setPagination(result.pagination || null);
            setCurrentPage(page);
        }
        setIsLoading(false);
    };

    // Handle search
    const handleSearch = () => {
        fetchNotices(1);
    };

    // Handle category filter change
    const handleCategoryFilterChange = (category: string) => {
        setCategoryFilter(category);
        setTimeout(() => {
            fetchNotices(1);
        }, 100);
    };

    // Handle toggle publish status
    const handleTogglePublish = async (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await toggleNoticePublishStatus(id);

            if (result.success) {
                alert(`Notice ${currentStatus ? 'unpublished' : 'published'} successfully!`);
                fetchNotices(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to update notice');
            }
        });
    };

    // Handle toggle pin status
    const handleTogglePin = async (id: string, currentStatus: boolean) => {
        startTransition(async () => {
            const result = await toggleNoticePinStatus(id);

            if (result.success) {
                alert(`Notice ${currentStatus ? 'unpinned' : 'pinned'} successfully!`);
                fetchNotices(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to update notice');
            }
        });
    };

    // Handle delete notice
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice? This action cannot be undone.')) return;

        startTransition(async () => {
            const result = await deleteNotice(id);

            if (result.success) {
                alert('Notice deleted successfully!');
                fetchNotices(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to delete notice');
            }
        });
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchNotices(page);
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            LOW: 'bg-slate-100 text-slate-700',
            NORMAL: 'bg-blue-100 text-blue-700',
            HIGH: 'bg-amber-100 text-amber-700',
            URGENT: 'bg-red-100 text-red-700',
        };
        return styles[priority as keyof typeof styles] || 'bg-slate-100 text-slate-700';
    };

    const getCategoryBadge = (category: string) => {
        const styles = {
            ADMISSION: 'bg-purple-100 text-purple-700',
            EXAMINATION: 'bg-blue-100 text-blue-700',
            EVENT: 'bg-pink-100 text-pink-700',
            HOLIDAY: 'bg-emerald-100 text-emerald-700',
            IMPORTANT: 'bg-red-100 text-red-700',
            ACADEMIC: 'bg-indigo-100 text-indigo-700',
            SPORTS: 'bg-orange-100 text-orange-700',
            CULTURAL: 'bg-fuchsia-100 text-fuchsia-700',
            GENERAL: 'bg-slate-100 text-slate-700',
        };
        return styles[category as keyof typeof styles] || 'bg-slate-100 text-slate-700';
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black font-outfit text-primary">Notices & Announcements</h1>
                    <p className="text-sm text-slate-600 mt-1">Create and manage school notices</p>
                </div>
                <button
                    onClick={() => router.push('/admin/notices/create')}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    Create Notice
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Notices', count: stats.totalNotices, color: 'bg-purple-500' },
                    { label: 'Published', count: stats.published, color: 'bg-emerald-500' },
                    { label: 'Drafts', count: stats.drafts, color: 'bg-amber-500' },
                    { label: 'Pinned', count: stats.pinned, color: 'bg-blue-500' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <div className={`w-8 h-8 ${stat.color} rounded-lg mb-3`}></div>
                        <p className="text-2xl font-black text-slate-800">{stat.count}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={categoryFilter}
                            onChange={(e) => handleCategoryFilterChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm appearance-none"
                        >
                            <option value="all">All Categories</option>
                            <option value="ADMISSION">Admission</option>
                            <option value="EXAMINATION">Examination</option>
                            <option value="EVENT">Event</option>
                            <option value="HOLIDAY">Holiday</option>
                            <option value="ACADEMIC">Academic</option>
                            <option value="SPORTS">Sports</option>
                            <option value="CULTURAL">Cultural</option>
                            <option value="IMPORTANT">Important</option>
                        </select>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search size={18} />
                                Search
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            )}

            {/* Notices Grid */}
            {!isLoading && (
                <div className="grid grid-cols-1 gap-4">
                    {notices.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                            <p className="text-slate-500 font-medium">No notices found</p>
                        </div>
                    ) : (
                        notices.map((notice: any) => (
                            <div
                                key={notice.id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {notice.isPinned && (
                                                <Pin size={16} className="text-amber-500 fill-amber-500" />
                                            )}
                                            <h3 className="text-lg font-black text-slate-800">{notice.title}</h3>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{notice.description}</p>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryBadge(notice.category)}`}>
                                                {notice.category}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(notice.priority)}`}>
                                                {notice.priority}
                                            </span>
                                            {notice.isPublished ? (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
                                            <span>📅 {formatDate(notice.publishDate)}</span>
                                            <span>👁️ {notice.views} views</span>
                                            <span>✍️ {notice.author}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleTogglePin(notice.id, notice.isPinned)}
                                            disabled={isPending}
                                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${notice.isPinned
                                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                                : 'hover:bg-amber-50 text-amber-600'
                                                }`}
                                            title={notice.isPinned ? 'Unpin' : 'Pin'}
                                        >
                                            <Pin size={18} className={notice.isPinned ? 'fill-amber-600' : ''} />
                                        </button>
                                        <button
                                            onClick={() => handleTogglePublish(notice.id, notice.isPublished)}
                                            disabled={isPending}
                                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${notice.isPublished
                                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                : 'hover:bg-emerald-50 text-emerald-600'
                                                }`}
                                            title={notice.isPublished ? 'Unpublish' : 'Publish'}
                                        >
                                            <Send size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(notice.id)}
                                            disabled={isPending}
                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && pagination && pagination.totalCount > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                        Showing <span className="font-bold">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
                        <span className="font-bold">
                            {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}
                        </span>{' '}
                        of <span className="font-bold">{pagination.totalCount}</span> results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPreviousPage || isLoading}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    disabled={isLoading}
                                    className={`px-4 py-2 font-bold text-sm rounded-lg transition-all ${pagination.currentPage === page
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasNextPage || isLoading}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
