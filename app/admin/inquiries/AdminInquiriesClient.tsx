'use client';

import { useState, useTransition } from 'react';
import { Search, Filter, Eye, Trash2, CheckCircle, MessageCircle, Loader2 } from 'lucide-react';
import {
    getAllContactInquiries,
    updateContactInquiryStatus,
    deleteContactInquiry,
} from '@/actions/inquery';
import { useRouter } from 'next/navigation';

type Inquiry = any; // Using any to avoid type mismatch with Prisma generated types

type Pagination = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Stats = {
    totalInquiries: number;
    byStatus?: {
        new: number;
        inProgress: number;
        resolved: number;
        closed: number;
    };
    bySubject?: {
        admissionInquiry: number;
        generalSupport: number;
        feedback: number;
        complaint: number;
    };
};

export default function AdminInquiriesClient({
    initialInquiries,
    initialPagination,
    initialStats,
}: {
    initialInquiries: Inquiry[];
    initialPagination: Pagination | null;
    initialStats: Stats | null;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [pagination, setPagination] = useState(initialPagination);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const stats = initialStats ? {
        totalInquiries: initialStats.totalInquiries || 0,
        newInquiries: initialStats.byStatus?.new || 0,
        inProgressInquiries: initialStats.byStatus?.inProgress || 0,
        resolvedInquiries: initialStats.byStatus?.resolved || 0,
        closedInquiries: initialStats.byStatus?.closed || 0,
    } : {
        totalInquiries: 0,
        newInquiries: 0,
        inProgressInquiries: 0,
        resolvedInquiries: 0,
        closedInquiries: 0,
    };

    // Fetch inquiries with filters
    const fetchInquiries = async (page: number = 1) => {
        setIsLoading(true);
        const result = await getAllContactInquiries({
            page,
            limit: 10,
            status: statusFilter !== 'all' ? statusFilter as any : undefined,
            searchQuery: searchQuery || undefined,
        });

        if (result.success) {
            setInquiries(result.data || []);
            setPagination(result.pagination || null);
            setCurrentPage(page);
        }
        setIsLoading(false);
    };

    // Handle search
    const handleSearch = () => {
        fetchInquiries(1);
    };

    // Handle status filter change
    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        setTimeout(() => {
            fetchInquiries(1);
        }, 100);
    };

    // Handle mark as resolved
    const handleResolve = async (id: string) => {
        const response = prompt('Enter response message (optional):');
        if (response === null) return; // User cancelled

        startTransition(async () => {
            const result = await updateContactInquiryStatus({
                id,
                status: 'RESOLVED',
                respondedBy: 'Admin User', // Replace with actual admin name
                response: response || 'Inquiry resolved',
            });

            if (result.success) {
                alert('Inquiry marked as resolved!');
                fetchInquiries(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to update inquiry');
            }
        });
    };

    // Handle mark as in progress
    const handleInProgress = async (id: string) => {
        startTransition(async () => {
            const result = await updateContactInquiryStatus({
                id,
                status: 'IN_PROGRESS',
                respondedBy: 'Admin User', // Replace with actual admin name
            });

            if (result.success) {
                alert('Inquiry marked as in progress!');
                fetchInquiries(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to update inquiry');
            }
        });
    };

    // Handle delete inquiry
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) return;

        startTransition(async () => {
            const result = await deleteContactInquiry(id);

            if (result.success) {
                alert('Inquiry deleted successfully!');
                fetchInquiries(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to delete inquiry');
            }
        });
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchInquiries(page);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            NEW: 'bg-blue-100 text-blue-700',
            IN_PROGRESS: 'bg-amber-100 text-amber-700',
            RESOLVED: 'bg-emerald-100 text-emerald-700',
            CLOSED: 'bg-slate-100 text-slate-700',
        };
        return styles[status as keyof typeof styles] || 'bg-slate-100 text-slate-700';
    };

    const getSubjectBadge = (subject: string) => {
        const styles = {
            ADMISSION_INQUIRY: 'bg-purple-100 text-purple-700',
            GENERAL_SUPPORT: 'bg-blue-100 text-blue-700',
            FEEDBACK: 'bg-emerald-100 text-emerald-700',
            COMPLAINT: 'bg-red-100 text-red-700',
            OTHERS: 'bg-slate-100 text-slate-700',
        };
        return styles[subject as keyof typeof styles] || 'bg-slate-100 text-slate-700';
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black font-outfit text-primary">Contact Inquiries</h1>
                    <p className="text-sm text-slate-600 mt-1">Manage and respond to inquiries</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total', count: stats.totalInquiries, color: 'bg-slate-500' },
                    { label: 'New', count: stats.newInquiries, color: 'bg-blue-500' },
                    { label: 'In Progress', count: stats.inProgressInquiries, color: 'bg-amber-500' },
                    { label: 'Resolved', count: stats.resolvedInquiries, color: 'bg-emerald-500' },
                    { label: 'Closed', count: stats.closedInquiries, color: 'bg-slate-400' },
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
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm appearance-none"
                        >
                            <option value="all">All Status</option>
                            <option value="NEW">New</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
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

            {/* Inquiries List */}
            {!isLoading && (
                <div className="space-y-4">
                    {inquiries.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                            <p className="text-slate-500 font-medium">No inquiries found</p>
                        </div>
                    ) : (
                        inquiries.map((inquiry: any) => (
                            <div
                                key={inquiry.id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-black text-slate-800">{inquiry.fullName}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(inquiry.status)}`}>
                                                {inquiry.status.replace('_', ' ')}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSubjectBadge(inquiry.subject)}`}>
                                                {inquiry.subject.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                                            <span>📧 {inquiry.email}</span>
                                            <span>📱 {inquiry.phone}</span>
                                            <span>🕐 {formatDate(inquiry.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl">
                                            {inquiry.message}
                                        </p>
                                        {inquiry.response && (
                                            <div className="mt-3 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                                                <p className="text-xs font-bold text-emerald-700 mb-1">Response:</p>
                                                <p className="text-sm text-emerald-900">{inquiry.response}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleInProgress(inquiry.id)}
                                            disabled={isPending || inquiry.status === 'IN_PROGRESS'}
                                            className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Mark In Progress"
                                        >
                                            <MessageCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleResolve(inquiry.id)}
                                            disabled={isPending || inquiry.status === 'RESOLVED'}
                                            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Mark Resolved"
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(inquiry.id)}
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
