import { getNoticeBySlug, incrementNoticeViews, getRecentNotices } from '@/actions/notice';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, ArrowLeft, Download, FileText, Share2, Eye, MapPin, User, ChevronRight, Pin } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function NoticeDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const response = await getNoticeBySlug(slug);

    if (!response.success || !response.data) {
        notFound();
    }

    const notice = response.data;

    // Increment views in background
    incrementNoticeViews(notice.id).catch(console.error);

    const recentNoticesRes = await getRecentNotices(5);
    const recentNotices = recentNoticesRes.success ? recentNoticesRes.data?.filter(n => n.id !== notice.id) : [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Breadcrumbs */}
                <div className="max-w-7xl mx-auto px-6 mb-8">
                    <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link href="/notice" className="hover:text-primary transition-colors">Notices</Link>
                        <ChevronRight size={12} />
                        <span className="text-primary truncate max-w-[200px] md:max-w-none">{notice.title}</span>
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Notice Content Section */}
                        <div className="lg:col-span-8 animate-fade-in-up">
                            <div className="space-y-8">
                                {/* Header Info */}
                                <div className="space-y-6 border-b border-slate-100 pb-10">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${notice.priority === 'URGENT' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-primary/5 text-primary'
                                            }`}>
                                            {notice.category}
                                        </span>
                                        {notice.isPinned && (
                                            <span className="px-4 py-1.5 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-secondary/20">
                                                Important
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto">
                                            <Eye size={14} className="text-secondary" />
                                            {notice.views} Views
                                        </div>
                                    </div>

                                    <h1 className="text-4xl lg:text-5xl font-black font-outfit text-primary uppercase tracking-tighter leading-none italic">
                                        {notice.title}
                                    </h1>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Published</div>
                                                <div className="text-xs font-black text-primary uppercase">{new Date(notice.publishDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                            </div>
                                        </div>
                                        {notice.eventDate && (
                                            <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary shadow-sm">
                                                    <MapPin size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-[9px] font-black text-secondary/60 uppercase tracking-widest">Event Date</div>
                                                    <div className="text-xs font-black text-secondary uppercase">{new Date(notice.eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Issued By</div>
                                                <div className="text-xs font-black text-primary uppercase">{notice.author}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Description / Content */}
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-xs font-black text-secondary uppercase tracking-[0.4em] mb-6">Circular Content</h3>
                                    <div className="text-slate-600 font-semibold text-lg leading-relaxed whitespace-pre-line uppercase tracking-tight">
                                        {notice.description}
                                    </div>

                                    {notice.content && (
                                        <div className="mt-10 p-8 bg-slate-50/50 rounded-3xl border border-slate-100 text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                                            {notice.content}
                                        </div>
                                    )}
                                </div>

                                {/* Attachments */}
                                {notice.attachments && notice.attachments.length > 0 && (
                                    <div className="space-y-6 pt-10">
                                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Official Attachments</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {notice.attachments.map((file: any) => (
                                                <a
                                                    key={file.id}
                                                    href={file.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 p-5 bg-white border border-slate-100 hover:border-primary hover:shadow-xl transition-all rounded-2xl group"
                                                >
                                                    <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors capitalize text-xs font-black">
                                                        {file.fileType.toLowerCase().includes('pdf') ? 'PDF' : <FileText size={20} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-black text-primary uppercase tracking-tight truncate">{file.fileName}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(file.fileSize / 1024 / 1024).toFixed(2)} MB • {file.fileType}</div>
                                                    </div>
                                                    <Download size={18} className="text-slate-300 group-hover:text-secondary transition-colors" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Bar */}
                                <div className="pt-12 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                                    <Link href="/notice" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all">
                                        <ArrowLeft size={16} /> Back to Circulars
                                    </Link>
                                    <button className="flex items-center gap-3 px-6 py-3 bg-slate-50 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
                                        <Share2 size={16} /> Share Circular
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Notices Sidebar */}
                        <div className="lg:col-span-4 space-y-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="bg-primary p-10 rounded-3xl shadow-2xl relative overflow-hidden text-white">
                                <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
                                    <Pin size={80} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 relative z-10">Recent Circulars</h3>
                                <div className="space-y-8 relative z-10">
                                    {recentNotices?.map((n: any) => (
                                        <Link key={n.id} href={`/notice/${n.slug}`} className="block group border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                            <span className="text-[9px] font-black text-secondary uppercase tracking-widest block mb-2">{n.category}</span>
                                            <h4 className="text-sm font-black uppercase tracking-tight group-hover:text-secondary transition-colors leading-snug mb-3">
                                                {n.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                                                <Calendar size={12} />
                                                {new Date(n.publishDate).toLocaleDateString()}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Link href="/notice" className="block w-full text-center py-4 bg-white/10 hover:bg-secondary transition-all rounded-xl mt-10 text-[10px] font-black uppercase tracking-widest">
                                    View All Archive
                                </Link>
                            </div>

                            {/* Need Help Card */}
                            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                                <h4 className="text-xs font-black text-primary uppercase tracking-widest">Queries regarding this notice?</h4>
                                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest leading-relaxed">
                                    Contact the administrative office or send an email to support@brightwoodacademy.in referring the notice title.
                                </p>
                                <div className="pt-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary border border-slate-200">
                                        <Share2 size={16} />
                                    </div>
                                    <div className="text-sm font-black text-primary">+91 7004818526</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
