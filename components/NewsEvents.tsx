import { Clock, MapPin, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';

const NewsEvents = () => {
    const news = [
        {
            tag: "Admissions",
            date: "Jan 10, 2025",
            title: "Open Registration for Nursery to Grade IX",
            desc: "The admission process for the academic session 2025-26 has officially commenced. Limited seats available in Primary section.",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80"
        },
        {
            tag: "Achievement",
            date: "Jan 05, 2025",
            title: "District Level Volleyball Champions",
            desc: "Our senior boys team clinched the trophy at the 22nd Inter-School District Sports Tournament.",
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80"
        }
    ];

    const events = [
        {
            day: "26",
            month: "JAN",
            title: "Republic Day Celebration",
            time: "08:30 AM - 11:00 AM",
            location: "Academic Square"
        },
        {
            day: "15",
            month: "FEB",
            title: "Annual Sports Meet 2025",
            time: "09:00 AM - 04:00 PM",
            location: "Primary Sports Complex"
        },
        {
            day: "02",
            month: "MAR",
            title: "Basant Panchami & Saraswati Puja",
            time: "10:00 AM - 01:00 PM",
            location: "Main Hall"
        }
    ];

    return (
        <section id="news" className="py-32 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20 animate-fade-in-up">
                    <div className="space-y-4">
                        <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.5em]">School Pulse</h3>
                        <h2 className="text-4xl lg:text-6xl font-black font-outfit text-primary leading-none uppercase tracking-tighter italic">
                            News & <br /> <span className="text-secondary">Events.</span>
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/notice" className="px-8 py-3 bg-white border border-slate-200 text-primary font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all rounded-md">
                            View All Updates
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left side: News Cards */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-12">
                        {news.map((item, idx) => (
                            <div key={idx} className="group flex flex-col md:flex-row gap-8 items-center bg-white p-4 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all border border-slate-100">
                                <div className="w-full md:w-1/2 aspect-video overflow-hidden">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105" />
                                </div>
                                <div className="w-full md:w-1/2 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{item.tag}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                                    </div>
                                    <h3 className="text-xl font-black font-outfit text-primary group-hover:text-secondary transition-colors leading-tight uppercase tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed text-sm line-clamp-2">{item.desc}</p>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-secondary transition-all">
                                        Read Circular <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right side: Event Sidebar */}
                    <div className="lg:col-span-12 xl:col-span-4">
                        <div className="bg-primary p-10 lg:p-12 space-y-10 shadow-2xl relative overflow-hidden rounded-md">
                            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
                                <Calendar size={100} />
                            </div>

                            <h3 className="text-white text-[10px] font-black uppercase tracking-[0.5em] relative z-10">UpNext Calendar</h3>

                            <div className="space-y-8 relative z-10">
                                {events.map((event, idx) => (
                                    <div key={idx} className="flex gap-6 group cursor-pointer items-start border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                        <div className="shrink-0 text-center">
                                            <span className="block text-3xl font-black text-secondary font-outfit leading-none">{event.day}</span>
                                            <span className="block text-[10px] font-bold text-white/50 uppercase mt-2 tracking-widest">{event.month}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-white text-sm font-black uppercase tracking-tight group-hover:text-secondary transition-colors leading-tight">
                                                {event.title}
                                            </h4>
                                            <div className="flex flex-col gap-1 text-[9px] font-bold text-white/40 uppercase tracking-[0.1em]">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-secondary" />
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-secondary" />
                                                    {event.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all mt-4 rounded-md">
                                Full Holiday List
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default NewsEvents;
