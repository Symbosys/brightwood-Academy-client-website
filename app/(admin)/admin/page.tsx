'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Filter, Plus, Edit, Trash2, UserCheck, UserX, Shield, Loader2, X, AlertCircle, Key } from 'lucide-react';
import {
    getAllAdmins,
    registerAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus,
    getAdminStatistics,
    resetAdminPassword
} from '@/actions/admin';
import {
    adminRegistrationSchema,
    updateAdminSchema,
    resetPasswordSchema,
    type AdminRegistrationInput,
    type UpdateAdminInput,
    type ResetPasswordInput
} from '@/validation/admin';
import { useRouter } from 'next/navigation';

type Admin = any;

export default function AdminUsersPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(true);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [pagination, setPagination] = useState<any>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

    // --- FORMS ---

    // 1. Registration Form
    const registerForm = useForm<AdminRegistrationInput>({
        resolver: zodResolver(adminRegistrationSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'VIEWER'
        }
    });

    // 2. Update Form
    const updateForm = useForm<UpdateAdminInput>({
        resolver: zodResolver(updateAdminSchema),
        defaultValues: {
            id: '',
            name: '',
            email: '',
            role: 'VIEWER'
        }
    });

    // 3. Reset Password Form
    const resetPasswordForm = useForm<any>({
        resolver: zodResolver(resetPasswordSchema.extend({
            confirmPassword: resetPasswordSchema.shape.newPassword
        }).refine(data => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"]
        })),
        defaultValues: {
            id: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const fetchAdmins = async (page: number = 1) => {
        setIsLoading(true);
        const result = await getAllAdmins({
            page,
            limit: 10,
            role: roleFilter !== 'all' ? roleFilter as any : undefined,
            searchQuery: searchQuery || undefined,
        });

        if (result.success) {
            setAdmins(result.data || []);
            setPagination(result.pagination || null);
            setCurrentPage(page);
        }
        setIsLoading(false);
    };

    const fetchStats = async () => {
        const result = await getAdminStatistics();
        if (result.success) {
            setStats(result.data);
        }
    };

    useEffect(() => {
        fetchAdmins(1);
        fetchStats();
    }, [roleFilter]);

    const handleSearch = () => {
        fetchAdmins(1);
    };

    const handleToggleStatus = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to change the status for ${name}?`)) return;

        startTransition(async () => {
            const result = await toggleAdminStatus(id);
            if (result.success) {
                alert(result.message);
                fetchAdmins(currentPage);
                fetchStats();
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

        startTransition(async () => {
            const result = await deleteAdmin(id);
            if (result.success) {
                alert(result.message);
                fetchAdmins(currentPage);
                fetchStats();
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    const onRegisterSubmit: SubmitHandler<AdminRegistrationInput> = async (data) => {
        startTransition(async () => {
            const result = await registerAdmin(data);
            if (result.success) {
                alert('Admin registered successfully!');
                setIsAddModalOpen(false);
                registerForm.reset();
                fetchAdmins(1);
                fetchStats();
            } else {
                alert(result.error);
            }
        });
    };

    const onUpdateSubmit: SubmitHandler<UpdateAdminInput> = async (data) => {
        startTransition(async () => {
            const result = await updateAdmin(data);
            if (result.success) {
                alert('Admin updated successfully!');
                setIsEditModalOpen(false);
                fetchAdmins(currentPage);
                router.refresh();
            } else {
                alert(result.error);
            }
        });
    };

    const onResetPasswordSubmit: SubmitHandler<any> = async (data) => {
        startTransition(async () => {
            const result = await resetAdminPassword({
                id: data.id,
                newPassword: data.newPassword
            });
            if (result.success) {
                alert('Password reset successfully!');
                setIsResetModalOpen(false);
                resetPasswordForm.reset();
            } else {
                alert(result.error);
            }
        });
    };

    const getRoleBadge = (role: string) => {
        const styles = {
            SUPER_ADMIN: 'bg-red-100 text-red-700',
            ADMIN: 'bg-purple-100 text-purple-700',
            EDITOR: 'bg-blue-100 text-blue-700',
            VIEWER: 'bg-slate-100 text-slate-700',
        };
        return styles[role as keyof typeof styles] || 'bg-slate-100 text-slate-700';
    };

    const getRoleIcon = (role: string) => {
        if (role === 'SUPER_ADMIN') return '👑';
        if (role === 'ADMIN') return '⚡';
        if (role === 'EDITOR') return '✏️';
        return '👁️';
    };

    const formatDate = (date: any) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black font-outfit text-primary uppercase tracking-tight">Admin Management</h1>
                    <p className="text-sm text-slate-600 mt-1">Control institutional access and permissions</p>
                </div>
                <button
                    onClick={() => {
                        registerForm.reset();
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    Register New Admin
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Admins', count: stats?.totalAdmins || 0, color: 'bg-slate-500', icon: '👥' },
                    { label: 'Super Admins', count: stats?.byRole?.superAdmin || 0, color: 'bg-red-500', icon: '👑' },
                    { label: 'Active Status', count: stats?.activeAdmins || 0, color: 'bg-emerald-500', icon: '✅' },
                    { label: 'Deactivated', count: stats?.inactiveAdmins || 0, color: 'bg-amber-500', icon: '⏸️' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-3 text-2xl">
                            <span className="opacity-80">{stat.icon}</span>
                            <div className={`w-2 h-2 rounded-full ${stat.color} animate-pulse`}></div>
                        </div>
                        <p className="text-3xl font-black text-slate-800">{stat.count}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by full name or email address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-black text-[10px] uppercase tracking-widest text-primary appearance-none cursor-pointer"
                        >
                            <option value="all">ALL PRIVILEGE ROLES</option>
                            <option value="SUPER_ADMIN">SUPER ADMIN</option>
                            <option value="ADMIN">REGULAR ADMIN</option>
                            <option value="EDITOR">CONTENT EDITOR</option>
                            <option value="VIEWER">VIEWER ONLY</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Admin Users Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100">
                    <Loader2 size={48} className="animate-spin text-primary mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Synching Admin Database...</p>
                </div>
            ) : admins.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No administrative users matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {admins.map((admin) => (
                        <div
                            key={admin.id}
                            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all border-l-8 border-l-primary group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-primary text-2xl font-black shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                        {admin.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-black text-slate-800 font-outfit uppercase tracking-tight leading-none">{admin.name}</h3>
                                            {admin.role === 'SUPER_ADMIN' && (
                                                <div className="text-red-500 bg-red-50 p-1.5 rounded-lg border border-red-100">
                                                    <Shield size={14} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 mb-3">{admin.email}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getRoleBadge(admin.role)}`}>
                                                {getRoleIcon(admin.role)} {admin.role.replace('_', ' ')}
                                            </span>
                                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${admin.isActive
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-red-50 text-red-600'
                                                }`}>
                                                {admin.isActive ? '• Active' : '• Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-[1.5rem] p-6 mb-6">
                                <div className="grid grid-cols-2 gap-6 text-[10px]">
                                    <div>
                                        <p className="text-slate-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <Loader2 size={12} className="text-primary" /> Last Login
                                        </p>
                                        <p className="text-slate-800 font-black tracking-tight">{formatDate(admin.lastLogin)}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                            <X size={12} className="text-secondary" /> Created At
                                        </p>
                                        <p className="text-slate-800 font-black tracking-tight">{new Date(admin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedAdmin(admin);
                                        updateForm.reset({
                                            id: admin.id,
                                            name: admin.name,
                                            email: admin.email,
                                            role: admin.role
                                        });
                                        setIsEditModalOpen(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-primary hover:text-white text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-slate-100 group/btn"
                                >
                                    <Edit size={14} className="group-hover/btn:scale-110 transition-transform" />
                                    Edit Profille
                                </button>
                                <button
                                    onClick={() => handleToggleStatus(admin.id, admin.name)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 ${admin.isActive
                                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-100'
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100'
                                        } font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border shadow-sm`}
                                >
                                    {admin.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                    {admin.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedAdmin(admin);
                                            resetPasswordForm.reset({
                                                id: admin.id,
                                                newPassword: '',
                                                confirmPassword: ''
                                            });
                                            setIsResetModalOpen(true);
                                        }}
                                        className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl border border-slate-100 transition-all"
                                        title="Reset Password"
                                    >
                                        <Key size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(admin.id, admin.name)}
                                        className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl border border-red-100 transition-all"
                                        title="Delete Admin"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={!pagination.hasPreviousPage}
                            onClick={() => fetchAdmins(pagination.currentPage - 1)}
                            className="px-6 py-2 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-lg border border-slate-100 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400"
                        >
                            Prev
                        </button>
                        <button
                            disabled={!pagination.hasNextPage}
                            onClick={() => fetchAdmins(pagination.currentPage + 1)}
                            className="px-6 py-2 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-lg border border-slate-100 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Registration Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-slate-100 relative">
                            <h2 className="text-3xl font-black font-outfit text-primary uppercase tracking-tighter italic">
                                Register <span className="text-secondary not-italic">Admin</span>
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                Define system privileges for new staff
                            </p>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-10 right-10 w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="p-10 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                    <input
                                        {...registerForm.register('name')}
                                        type="text"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm text-slate-700"
                                    />
                                    {registerForm.formState.errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{registerForm.formState.errors.name.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                                    <input
                                        {...registerForm.register('email')}
                                        type="email"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm text-slate-700"
                                    />
                                    {registerForm.formState.errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{registerForm.formState.errors.email.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password *</label>
                                    <input
                                        {...registerForm.register('password')}
                                        type="password"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm text-slate-700"
                                    />
                                    {registerForm.formState.errors.password && <p className="text-[10px] font-bold text-red-500 ml-1">{registerForm.formState.errors.password.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Role *</label>
                                    <select
                                        {...registerForm.register('role')}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-black text-[10px] tracking-[0.2em] uppercase text-primary cursor-pointer"
                                    >
                                        <option value="SUPER_ADMIN">👑 SUPER ADMIN</option>
                                        <option value="ADMIN">⚡ REGULAR ADMIN</option>
                                        <option value="EDITOR">✏️ CONTENT EDITOR</option>
                                        <option value="VIEWER">👁️ VIEWER ONLY</option>
                                    </select>
                                    {registerForm.formState.errors.role && <p className="text-[10px] font-bold text-red-500 ml-1">{registerForm.formState.errors.role.message}</p>}
                                </div>
                            </div>
                            <button
                                disabled={isPending}
                                className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="animate-spin mx-auto" /> : 'Create Admin Account'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-10 border-b border-slate-100 relative">
                            <h2 className="text-3xl font-black font-outfit text-primary uppercase tracking-tighter italic">
                                Edit <span className="text-secondary not-italic">Admin</span>
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                                Update existing administrative profile
                            </p>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="absolute top-10 right-10 w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="p-10 space-y-6">
                            <input type="hidden" {...updateForm.register('id')} />
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name *</label>
                                    <input
                                        {...updateForm.register('name')}
                                        type="text"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm text-slate-700"
                                    />
                                    {updateForm.formState.errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{updateForm.formState.errors.name.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                                    <input
                                        {...updateForm.register('email')}
                                        type="email"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm text-slate-700"
                                    />
                                    {updateForm.formState.errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{updateForm.formState.errors.email.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Role *</label>
                                    <select
                                        {...updateForm.register('role')}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary transition-all font-black text-[10px] tracking-[0.2em] uppercase text-primary cursor-pointer"
                                    >
                                        <option value="SUPER_ADMIN">👑 SUPER ADMIN</option>
                                        <option value="ADMIN">⚡ REGULAR ADMIN</option>
                                        <option value="EDITOR">✏️ CONTENT EDITOR</option>
                                        <option value="VIEWER">👁️ VIEWER ONLY</option>
                                    </select>
                                    {updateForm.formState.errors.role && <p className="text-[10px] font-bold text-red-500 ml-1">{updateForm.formState.errors.role.message}</p>}
                                </div>
                            </div>
                            <button
                                disabled={isPending}
                                className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="animate-spin mx-auto" /> : 'Save Profile Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 text-center">
                            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Key size={32} />
                            </div>
                            <h2 className="text-xl font-black font-outfit text-primary uppercase">Reset Password</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">FOR {selectedAdmin?.name}</p>
                        </div>
                        <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="p-8 space-y-4">
                            <input type="hidden" {...resetPasswordForm.register('id')} />
                            <input
                                {...resetPasswordForm.register('newPassword')}
                                type="password"
                                placeholder="NEW PASSWORD"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-xs"
                            />
                            {resetPasswordForm.formState.errors.newPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{(resetPasswordForm.formState.errors.newPassword as any).message}</p>}

                            <input
                                {...resetPasswordForm.register('confirmPassword')}
                                type="password"
                                placeholder="CONFIRM PASSWORD"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-primary font-bold text-xs"
                            />
                            {resetPasswordForm.formState.errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{(resetPasswordForm.formState.errors.confirmPassword as any).message}</p>}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsResetModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all">Cancel</button>
                                <button type="submit" disabled={isPending} className="flex-1 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary transition-all disabled:opacity-50">
                                    {isPending ? 'Processing...' : 'Reset Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
