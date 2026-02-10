import { Loader2, Search, Bell } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar Placeholder */}
            <div className="fixed w-full h-20 bg-white border-b border-slate-50 z-50"></div>

            <main className="pt-32">
                {/* Hero Section Skeleton */}
                <section className="bg-primary py-24 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                            <div className="space-y-6 w-full lg:w-2/3">
                                <div className="w-48 h-6 bg-white/10 rounded-full animate-pulse"></div>
                                <div className="h-20 lg:h-32 bg-white/5 rounded-3xl w-full animate-pulse"></div>
                                <div className="h-6 bg-white/5 rounded-xl w-3/4 animate-pulse"></div>
                            </div>
                            <div className="hidden lg:flex gap-4">
                                <div className="w-40 h-40 bg-white/5 rounded-3xl border border-white/10 animate-pulse"></div>
                                <div className="w-40 h-40 bg-secondary/50 rounded-3xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-20">
                    {/* Header Controls Skeleton */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8 mb-16 pb-8 border-b border-slate-100">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-24 h-10 bg-slate-50 rounded-full animate-pulse"></div>
                            ))}
                        </div>
                        <div className="w-full lg:w-96 h-14 bg-slate-50 rounded-xl animate-pulse"></div>
                    </div>

                    {/* Notices List Skeleton */}
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-40 bg-white border border-slate-50 rounded-2xl p-8 flex justify-between items-center gap-8 animate-pulse shadow-sm">
                                <div className="space-y-4 flex-1">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-4 bg-slate-50 rounded"></div>
                                        <div className="w-32 h-4 bg-slate-50 rounded"></div>
                                    </div>
                                    <div className="w-3/4 h-8 bg-slate-100 rounded"></div>
                                    <div className="w-full h-4 bg-slate-50 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Centered Main Loader */}
            <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[4rem] shadow-2xl flex flex-col items-center gap-6 border border-white/50 animate-fade-in-up">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-slate-100 rounded-full animate-pulse"></div>
                        <Loader2 size={48} className="text-primary animate-spin absolute inset-0 m-auto" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Accessing Registry</h3>
                        <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.4em] mt-3 animate-pulse">Securing official announcements...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
