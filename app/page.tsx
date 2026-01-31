import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutPreview from '../components/AboutPreview';
import Achievements from '../components/Achievements';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowRight, Bell, FileText, Download, Quote } from 'lucide-react';

import { getAllNotices } from '@/actions/notice';

export default async function Homepage() {
  const noticesResponse = await getAllNotices({ limit: 10, isPublished: true });
  const notices = noticesResponse.success ? noticesResponse.data : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Hero />

      {/* KV Style Announcement & Principal Desk Hub */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Notice Board (Central to KV sites) */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                  <Bell size={20} className="animate-swing" />
                </div>
                <h2 className="text-3xl font-black font-outfit text-primary tracking-tighter uppercase">Announcements</h2>
              </div>

              <div className="bg-slate-50 border-l-8 border-secondary p-8 shadow-inner space-y-6">
                {notices && notices.length > 0 ? (
                  notices.map((notice: any) => (
                    <div key={notice.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 last:border-0 last:pb-0 group">
                      <div className="space-y-1 flex-1">
                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
                          {new Date(notice.publishDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <Link href={`/notice/${notice.slug}`} className="text-slate-800 font-bold group-hover:text-primary transition-colors block leading-tight">
                          {notice.title}
                        </Link>
                      </div>
                      <Link
                        href={`/notice/${notice.slug}`}
                        className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-secondary whitespace-nowrap"
                      >
                        <Download size={14} /> View Details
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-white/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">No active announcements at this time</p>
                  </div>
                )}
                <Link href="/notice" className="block text-center pt-4 text-xs font-black uppercase tracking-[0.3em] text-primary hover:text-secondary transition-all">
                  View All Announcements →
                </Link>
              </div>
            </div>

            {/* Insight/Quote Side Board */}
            <div className="lg:col-span-4">
              <div className="bg-primary p-12 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group h-full flex flex-col justify-center min-h-[400px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-secondary/20 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl" />

                <div className="relative z-10 text-center space-y-8">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      <Quote size={32} className="text-secondary fill-secondary/20" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-2xl lg:text-3xl font-black font-outfit leading-tight tracking-tight italic">
                      "Education is not the learning of facts, but the training of the mind to think."
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="w-8 h-[2px] bg-secondary/30"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">
                        Albert Einstein
                      </p>
                      <div className="w-8 h-[2px] bg-secondary/30"></div>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed max-w-[200px] mx-auto">
                    Inspiring the next generation of thinkers at Brightwood
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <AboutPreview />
      <Achievements />

      <Testimonials />
      <Footer />
    </div>
  );
}
