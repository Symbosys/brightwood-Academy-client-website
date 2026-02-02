'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    Image as ImageIcon,
} from 'lucide-react';
import { logoutAdmin, getCurrentAdmin } from '@/actions/admin';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navigation = [
    // {
    //     name: 'Dashboard',
    //     href: '/admin',
    //     icon: LayoutDashboard,
    // },
    {
        name: 'Admissions',
        href: '/admin-admission',
        icon: FileText,
    },
    {
        name: 'Notices',
        href: '/notices',
        icon: Bell,
    },
    {
        name: 'Inquiries',
        href: '/inquiries',
        icon: MessageSquare,
    },
    {
        name: 'Gallery',
        href: '/admin/gallery',
        icon: ImageIcon,
    },
    {
        name: 'Admin Users',
        href: '/admin',
        icon: Users,
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const result = await getCurrentAdmin();
            if (result.success) {
                setUser(result.data);
            } else {
                router.push('/login');
            }
        };
        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        const result = await logoutAdmin();
        if (result.success) {
            router.push('/login');
        }
    };

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
                        <Link href="/admin" className="flex items-center gap-3 group transition-all duration-300 active:scale-95">
                            <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center p-0.5 shadow-2xl transition-all duration-300 group-hover:shadow-secondary/20 ring-4 ring-white/5 group-hover:ring-secondary/20 overflow-hidden shrink-0">
                                <Image
                                    src="/logo.jpg"
                                    alt="Brightwood Logo"
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-700 group-hover:scale-115"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white font-black font-outfit text-base leading-none tracking-tighter uppercase group-hover:text-secondary transition-colors">
                                    Brightwood <span className="text-secondary group-hover:text-white transition-colors">Academy</span>
                                </h1>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1 h-1 bg-secondary rounded-full animate-pulse shadow-[0_0_5px_#ff9933]"></span>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 leading-none">
                                        Admin Panel
                                    </p>
                                </div>
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
                            <p className="text-white font-bold text-sm truncate">{user?.name || 'Loading...'}</p>
                            <p className="text-white/60 text-xs truncate">{user?.email || 'admin@brightwood.com'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all"
                        >
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
                                <p className="text-sm font-bold text-slate-800">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'Super Admin'}</p>
                            </div>
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg uppercase">
                                {user?.name?.[0] || 'A'}
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
