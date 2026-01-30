'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Bell,
    MessageSquare,
    Users,
    Menu,
    X,
    LogOut,
    GraduationCap,
} from 'lucide-react';

const navigation = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        name: 'Admissions',
        href: '/admin/admissions',
        icon: FileText,
    },
    {
        name: 'Notices',
        href: '/admin/notices',
        icon: Bell,
    },
    {
        name: 'Inquiries',
        href: '/admin/inquiries',
        icon: MessageSquare,
    },
    {
        name: 'Admin Users',
        href: '/admin/users',
        icon: Users,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                                <GraduationCap className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-white font-black font-outfit text-lg tracking-tight">
                                    Brightwood
                                </h1>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                                    Admin Panel
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                            ? 'bg-secondary text-white shadow-lg'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="bg-white/5 rounded-xl p-4 mb-3">
                            <p className="text-white font-bold text-sm">Admin User</p>
                            <p className="text-white/60 text-xs">admin@brightwood.com</p>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu size={24} className="text-slate-600" />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block">
                                <h2 className="text-2xl font-black font-outfit text-primary tracking-tight">
                                    {navigation.find((item) => pathname === item.href || pathname?.startsWith(item.href + '/'))?.name || 'Dashboard'}
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-bold text-slate-800">Admin User</p>
                                <p className="text-xs text-slate-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
