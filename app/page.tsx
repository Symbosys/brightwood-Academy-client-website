import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutPreview from '../components/AboutPreview';
import Achievements from '../components/Achievements';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Link from 'next/link';
import { ArrowRight, Bell, FileText, Download } from 'lucide-react';

export default function Homepage() {
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
                {[
                  { date: "Oct 20, 2024", text: "Walk-in-interview for the post of PGT (Maths) and TGT (SST) contract basis.", link: "#" },
                  { date: "Oct 15, 2024", text: "Registration for Admission in Class-XI (Science & Commerce) for session 2025.", link: "#" },
                  { date: "Oct 10, 2024", text: "Revised Final Date Sheet for Half-Yearly Examination 2024-25.", link: "#" },
                ].map((notice, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 last:border-0 last:pb-0 group">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{notice.date}</p>
                      <p className="text-slate-800 font-bold group-hover:text-primary transition-colors">{notice.text}</p>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-secondary whitespace-nowrap">
                      <Download size={14} /> Download PDF
                    </button>
                  </div>
                ))}
                <Link href="/news" className="block text-center pt-4 text-xs font-black uppercase tracking-[0.3em] text-primary hover:text-secondary transition-all">
                  View All Announcements →
                </Link>
              </div>
            </div>

            {/* Quick Action Side Board */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-primary p-10 text-white rounded-r-3xl shadow-2xl relative overflow-hidden">
                <FileText size={80} className="absolute -bottom-4 -right-4 opacity-10" />
                <h3 className="text-secondary text-xs font-black uppercase tracking-widest mb-6">Student corner</h3>
                <div className="space-y-4">
                  {['Vidyalaya Patrika 2024', 'NCERT Book Solutions', 'LMS Login', 'Alumni Registration'].map((item) => (
                    <a key={item} href="#" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded transition-all group">
                      <span className="text-[11px] font-bold uppercase tracking-wider">{item}</span>
                      <ArrowRight size={14} className="text-secondary opacity-0 group-hover:opacity-100 transition-all" />
                    </a>
                  ))}
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
