'use client';

import { useState, useTransition } from 'react';
import { Search, Filter, Download, Eye, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
    getAllAdmissionApplications,
    updateAdmissionApplicationStatus,
    deleteAdmissionApplication,
} from '@/actions/admission';
import { useRouter } from 'next/navigation';

type Application = any; // Using any to avoid type mismatch with Prisma generated types

type Pagination = {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

type Stats = {
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    admittedApplications: number;
};

export default function AdminAdmissionsClient({
    initialApplications,
    initialPagination,
    initialStats,
}: {
    initialApplications: Application[];
    initialPagination: Pagination | null;
    initialStats: Stats | null;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [applications, setApplications] = useState(initialApplications);
    const [pagination, setPagination] = useState(initialPagination);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const stats = initialStats || {
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        admittedApplications: 0,
    };

    // Fetch applications with filters
    const fetchApplications = async (page: number = 1) => {
        setIsLoading(true);
        const result = await getAllAdmissionApplications({
            page,
            limit: 10,
            status: statusFilter !== 'all' ? statusFilter as any : undefined,
            searchQuery: searchQuery || undefined,
        });

        if (result.success) {
            setApplications(result.data || []);
            setPagination(result.pagination || null);
            setCurrentPage(page);
        }
        setIsLoading(false);
    };

    // Handle search
    const handleSearch = () => {
        fetchApplications(1);
    };

    // Handle status filter change
    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        setTimeout(() => {
            fetchApplications(1);
        }, 100);
    };

    // Handle approve application
    const handleApprove = async (id: string) => {
        if (!confirm('Are you sure you want to approve this application?')) return;

        startTransition(async () => {
            const result = await updateAdmissionApplicationStatus({
                id,
                status: 'APPROVED',
                reviewedBy: 'Admin User', // Replace with actual admin name
                remarks: 'Application approved',
            });

            if (result.success) {
                alert('Application approved successfully!');
                fetchApplications(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to approve application');
            }
        });
    };

    // Handle reject application
    const handleReject = async (id: string) => {
        const remarks = prompt('Enter rejection reason (optional):');
        if (remarks === null) return; // User cancelled

        startTransition(async () => {
            const result = await updateAdmissionApplicationStatus({
                id,
                status: 'REJECTED',
                reviewedBy: 'Admin User', // Replace with actual admin name
                remarks: remarks || 'Application rejected',
            });

            if (result.success) {
                alert('Application rejected successfully!');
                fetchApplications(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to reject application');
            }
        });
    };

    // Handle delete application
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return;

        startTransition(async () => {
            const result = await deleteAdmissionApplication(id);

            if (result.success) {
                alert('Application deleted successfully!');
                fetchApplications(currentPage);
                router.refresh();
            } else {
                alert(result.error || 'Failed to delete application');
            }
        });
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        fetchApplications(page);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING: 'bg-amber-100 text-amber-700',
            UNDER_REVIEW: 'bg-blue-100 text-blue-700',
            APPROVED: 'bg-emerald-100 text-emerald-700',
            REJECTED: 'bg-red-100 text-red-700',
            WAITLISTED: 'bg-purple-100 text-purple-700',
            ADMITTED: 'bg-green-100 text-green-700',
        };
        return styles[status as keyof typeof styles] || 'bg-slate-100 text-slate-700';
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
                    <h1 className="text-2xl font-black font-outfit text-primary">
                        Admission Applications
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                        Manage and review all admission applications
                    </p>
                </div>
                <button className="px-6 py-3 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary/20">
                    + New Application
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total', count: stats.totalApplications, color: 'bg-slate-500' },
                    { label: 'Pending', count: stats.pendingApplications, color: 'bg-amber-500' },
                    { label: 'Approved', count: stats.approvedApplications, color: 'bg-emerald-500' },
                    { label: 'Rejected', count: stats.rejectedApplications, color: 'bg-red-500' },
                    { label: 'Admitted', count: stats.admittedApplications, color: 'bg-green-500' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
                    >
                        <div className={`w-8 h-8 ${stat.color} rounded-lg mb-3`}></div>
                        <p className="text-2xl font-black text-slate-800">{stat.count}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search by name or application number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={20}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm appearance-none"
                        >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="WAITLISTED">Waitlisted</option>
                            <option value="ADMITTED">Admitted</option>
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

            {/* Applications Table */}
            {!isLoading && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Application No.
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Class
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Father's Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Applied Date
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <p className="text-slate-500 font-medium">No applications found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-primary">
                                                    {app.applicationNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-slate-800">
                                                    {app.studentFirstName} {app.studentLastName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-slate-600">
                                                    {app.classApplyingFor}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-slate-600">
                                                    {app.fatherName}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-slate-600">
                                                    {app.fatherPhone}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                                                        app.status
                                                    )}`}
                                                >
                                                    {app.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-slate-600">
                                                    {formatDate(app.createdAt)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(app.id)}
                                                        disabled={isPending || app.status === 'APPROVED'}
                                                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(app.id)}
                                                        disabled={isPending || app.status === 'REJECTED'}
                                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(app.id)}
                                                        disabled={isPending}
                                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalCount > 0 && (
                        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
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
            )}
        </div>
    );
}
