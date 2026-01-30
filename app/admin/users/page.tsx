'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, UserCheck, UserX, Shield } from 'lucide-react';

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // Mock data
    const admins = [
        {
            id: '1',
            name: 'John Anderson',
            email: 'john@brightwood.com',
            role: 'SUPER_ADMIN',
            isActive: true,
            lastLogin: '2025-01-20 09:30 AM',
            createdAt: '2024-01-15',
        },
        {
            id: '2',
            name: 'Sarah Miller',
            email: 'sarah@brightwood.com',
            role: 'ADMIN',
            isActive: true,
            lastLogin: '2025-01-19 02:15 PM',
            createdAt: '2024-03-20',
        },
        {
            id: '3',
            name: 'Michael Chen',
            email: 'michael@brightwood.com',
            role: 'EDITOR',
            isActive: true,
            lastLogin: '2025-01-18 11:45 AM',
            createdAt: '2024-06-10',
        },
        {
            id: '4',
            name: 'Emily Davis',
            email: 'emily@brightwood.com',
            role: 'VIEWER',
            isActive: false,
            lastLogin: '2025-01-10 03:20 PM',
            createdAt: '2024-08-05',
        },
    ];

    const getRoleBadge = (role: string) => {
        const styles = {
            SUPER_ADMIN: 'bg-red-100 text-red-700',
            ADMIN: 'bg-purple-100 text-purple-700',
            EDITOR: 'bg-blue-100 text-blue-700',
            VIEWER: 'bg-slate-100 text-slate-700',
        };
        return styles[role as keyof typeof styles];
    };

    const getRoleIcon = (role: string) => {
        if (role === 'SUPER_ADMIN') return '👑';
        if (role === 'ADMIN') return '⚡';
        if (role === 'EDITOR') return '✏️';
        return '👁️';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black font-outfit text-primary">Admin Users</h1>
                    <p className="text-sm text-slate-600 mt-1">Manage admin users and permissions</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary/20">
                    <Plus size={18} />
                    Add Admin User
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Admins', count: 8, color: 'bg-slate-500', icon: '👥' },
                    { label: 'Super Admins', count: 2, color: 'bg-red-500', icon: '👑' },
                    { label: 'Active Users', count: 7, color: 'bg-emerald-500', icon: '✅' },
                    { label: 'Inactive', count: 1, color: 'bg-amber-500', icon: '⏸️' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{stat.count}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm appearance-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                            <option value="ADMIN">Admin</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Viewer</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Admin Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {admins.map((admin) => (
                    <div
                        key={admin.id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-xl font-black">
                                    {admin.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-black text-slate-800">{admin.name}</h3>
                                        {admin.role === 'SUPER_ADMIN' && (
                                            <Shield size={16} className="text-red-500" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 mb-2">{admin.email}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(admin.role)}`}>
                                            {getRoleIcon(admin.role)} {admin.role.replace('_', ' ')}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.isActive
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {admin.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 font-bold mb-1">Last Login</p>
                                    <p className="text-slate-800 font-medium">{admin.lastLogin}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 font-bold mb-1">Joined</p>
                                    <p className="text-slate-800 font-medium">{admin.createdAt}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-sm rounded-lg transition-all">
                                <Eye size={16} />
                                View
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold text-sm rounded-lg transition-all">
                                <Edit size={16} />
                                Edit
                            </button>
                            <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${admin.isActive
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                } font-bold text-sm rounded-lg transition-all`}>
                                {admin.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                                {admin.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-lg transition-all">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Role Permissions Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-black font-outfit text-primary mb-4">Role Permissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            role: 'SUPER_ADMIN',
                            icon: '👑',
                            color: 'bg-red-100 text-red-700',
                            permissions: 'Full system access',
                        },
                        {
                            role: 'ADMIN',
                            icon: '⚡',
                            color: 'bg-purple-100 text-purple-700',
                            permissions: 'Manage content & users',
                        },
                        {
                            role: 'EDITOR',
                            icon: '✏️',
                            color: 'bg-blue-100 text-blue-700',
                            permissions: 'Create & edit content',
                        },
                        {
                            role: 'VIEWER',
                            icon: '👁️',
                            color: 'bg-slate-100 text-slate-700',
                            permissions: 'View only access',
                        },
                    ].map((role) => (
                        <div key={role.role} className="bg-slate-50 rounded-xl p-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${role.color} mb-2`}>
                                <span>{role.icon}</span>
                                <span>{role.role.replace('_', ' ')}</span>
                            </div>
                            <p className="text-sm text-slate-600">{role.permissions}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
