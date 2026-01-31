"use client";

import React, { useEffect, useState } from 'react';
import { getAllNotices, getPinnedNotices } from '@/actions/notice';
import { Calendar, Clock, ArrowRight, Download, Eye, Pin, Filter, Search, Loader2, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const NoticePageContent = () => {
    const [notices, setNotices] = useState<any[]>([]);
    const [pinnedNotices, setPinnedNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            try {
                const [allRes, pinnedRes] = await Promise.all([
                    getAllNotices({ isPublished: true, isActive: true }),
                    getPinnedNotices(3)
                ]);

                if (allRes.success) setNotices(allRes.data || []);
                if (pinnedRes.success) setPinnedNotices(pinnedRes.data || []);
            } catch (error) {
                console.error("Error fetching notices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    const filteredNotices = notices.filter(n => {
        const matchesCategory = filter === 'ALL' || n.category === filter;
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ['ALL', 'ADMISSION', 'EXAMINATION', 'HOLIDAY', 'EVENT', 'ACADEMIC', 'RESULT', 'IMPORTANT'];

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Official Notices...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            {/* Pinned / Latest Important Notices */}
            {pinnedNotices.length > 0 && (
                <div className="mb-24 scale-up">
                    <div className="flex items-center gap-3 mb-8">
                        <Pin size={18} className="text-secondary" />
                        <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em]">Pinned Announcements</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pinnedNotices.map((notice) => (
                            <div key={notice.id} className="relative group bg-white p-8 border-l-4 border-secondary shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <Pin size={60} />
                                </div>
                                <span className={`inline-block px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-4 ${notice.priority === 'URGENT' ? 'bg-red-500 text-white' : 'bg-primary/5 text-primary'}`}>
                                    {notice.category}
                                </span>
                                <h4 className="text-xl font-black font-outfit text-primary uppercase tracking-tight leading-tight mb-4 group-hover:text-secondary transition-colors">
                                    {notice.title}
                                </h4>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-auto">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-secondary" />
                                        {new Date(notice.publishDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <Link href={`/notice/${notice.slug}`} className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-4 transition-all">
                                    View Details <ArrowRight size={14} className="text-secondary" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Filters & Search */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 pb-8 border-b border-slate-100">
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-full border ${filter === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="SEARCH CIRCULARS..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 focus:border-primary outline-none text-[11px] font-black uppercase tracking-widest transition-all rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Notices List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                        <div key={notice.id} className="group bg-white p-6 md:p-8 border border-white hover:border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-primary transition-colors" />

                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">{notice.category}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <Clock size={12} />
                                        Published on {new Date(notice.publishDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black font-outfit text-primary uppercase tracking-tighter leading-none group-hover:text-secondary transition-colors">
                                    {notice.title}
                                </h3>
                                <p className="text-slate-500 font-semibold text-sm leading-relaxed max-w-3xl line-clamp-2 uppercase tracking-tight">
                                    {notice.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {notice.attachments && notice.attachments.length > 0 && (
                                    <button className="p-4 bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all rounded-xl border border-slate-100 group/btn shadow-inner">
                                        <Download size={20} />
                                    </button>
                                )}
                                <Link href={`/notice/${notice.slug}`} className="px-8 py-4 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-xl flex items-center gap-3 group-hover:shadow-2xl group-hover:shadow-primary/30 transition-all hover:bg-secondary">
                                    <Eye size={16} /> View Notice
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner text-slate-300">
                            <Search size={32} />
                        </div>
                        <h4 className="text-xl font-black text-slate-400 uppercase tracking-tighter">No Circulars Found</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>

            {/* Disclaimer Bar */}
            <div className="mt-20 p-6 bg-primary/5 rounded-2xl flex items-center gap-4 border border-primary/5">
                <Info className="text-primary shrink-0" size={20} />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                    All notices published here are official circulars from Brightwood School Administration. For urgent queries, please visit the administrative block between 10:00 AM and 02:00 PM.
                </p>
            </div>
        </div>
    );
};

export default function NoticePage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32">
                <section className="bg-primary py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Public Domain Announcements</span>
                                </div>
                                <h1 className="text-5xl lg:text-7xl font-black font-outfit text-white uppercase tracking-tighter leading-[1] italic">
                                    Notices & <br /> <span className="text-secondary not-italic">Circulars.</span>
                                </h1>
                                <p className="max-w-xl text-white/50 font-semibold text-lg uppercase tracking-tight">
                                    Stay informed with the latest updates on admissions, examinations, events, and school policies.
                                </p>
                            </div>
                            <div className="hidden lg:grid grid-cols-2 gap-4 shrink-0">
                                <div className="w-40 h-40 bg-white/5 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-3">
                                    <span className="text-3xl font-black text-secondary font-outfit">10+</span>
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest text-center">New Weekly <br />Updates</span>
                                </div>
                                <div className="w-40 h-40 bg-secondary rounded-3xl flex flex-col items-center justify-center gap-3 shadow-2xl shadow-secondary/30">
                                    <Calendar className="text-white" size={32} />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest text-center">Academic <br />Session 25-26</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <NoticePageContent />
            </main>
            <Footer />
        </div>
    );
}
