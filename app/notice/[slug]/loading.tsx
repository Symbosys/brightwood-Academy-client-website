import { Loader2, Calendar, MapPin, User, ChevronRight } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar Placeholder */}
            <div className="fixed w-full h-20 bg-white border-b border-slate-50 z-50"></div>

            <main className="pt-32 pb-24">
                {/* Breadcrumbs Skeleton */}
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-3 bg-slate-100 animate-pulse rounded"></div>
                        <div className="w-4 h-4 text-slate-100"><ChevronRight size={12} /></div>
                        <div className="w-16 h-3 bg-slate-100 animate-pulse rounded"></div>
                        <div className="w-4 h-4 text-slate-100"><ChevronRight size={12} /></div>
                        <div className="w-32 h-3 bg-slate-50 animate-pulse rounded"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        
                        {/* Notice Content Section Skeleton */}
                        <div className="lg:col-span-8">
                            <div className="space-y-8">
                                {/* Header Info Skeleton */}
                                <div className="space-y-6 border-b border-slate-100 pb-10">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="w-24 h-6 bg-primary/5 animate-pulse rounded-full"></div>
                                        <div className="w-16 h-4 bg-slate-50 animate-pulse rounded-full ml-auto"></div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="w-full h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                                        <div className="w-3/4 h-12 bg-slate-50 animate-pulse rounded-xl"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm"></div>
                                                <div className="space-y-2">
                                                    <div className="w-12 h-2 bg-slate-100 animate-pulse rounded"></div>
                                                    <div className="w-20 h-3 bg-slate-200 animate-pulse rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Content Skeleton */}
                                <div className="space-y-6">
                                    <div className="w-32 h-3 bg-slate-100 animate-pulse rounded"></div>
                                    <div className="space-y-4">
                                        <div className="w-full h-4 bg-slate-100 animate-pulse rounded"></div>
                                        <div className="w-full h-4 bg-slate-100 animate-pulse rounded"></div>
                                        <div className="w-5/6 h-4 bg-slate-100 animate-pulse rounded"></div>
                                        <div className="w-full h-4 bg-slate-100 animate-pulse rounded"></div>
                                        <div className="w-4/6 h-4 bg-slate-100 animate-pulse rounded"></div>
                                    </div>
                                    
                                    <div className="mt-10 p-8 bg-slate-50/30 rounded-3xl border border-dashed border-slate-100 h-64"></div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Notices Sidebar Skeleton */}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="bg-primary/90 p-10 rounded-3xl shadow-2xl h-[500px] animate-pulse"></div>
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 h-40"></div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Centered Main Loader */}
            <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border border-white/50 animate-fade-in-up">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-pulse"></div>
                        <Loader2 size={40} className="text-primary animate-spin absolute inset-0 m-auto" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Fetching Circular</h3>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 animate-pulse">Preparing Official Document...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
