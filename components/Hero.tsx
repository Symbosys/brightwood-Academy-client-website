
import { ArrowRight, ChevronRight, FileText, UserCheck } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative min-h-[90vh] bg-white overflow-hidden pt-20">
            {/* Background Base - Simple and Clean for Government style */}
            <div className="absolute inset-0 bg-[#f8fafc]" />

            {/* National Color Stripes at the side - subtle */}
            <div className="absolute top-0 right-0 w-2 h-full bg-secondary opacity-50" />
            <div className="absolute top-0 right-2 w-2 h-full bg-primary opacity-50" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 pt-24 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left: Formal Content */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-10 group">
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/5 border-l-8 border-primary rounded-r-xl">
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-primary">Tattvam Pūṣan Apāvr̥ṇu</span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-6xl lg:text-7xl font-black font-outfit text-primary leading-[1] tracking-tighter uppercase italic">
                                Lead Me <br />
                                to the <span className="text-secondary not-italic">Light.</span>
                            </h1>
                            <div className="w-40 h-2 bg-secondary/30 rounded-full" />
                        </div>

                        <p className="text-xl text-slate-700 leading-relaxed font-semibold max-w-2xl border-l-[1px] border-slate-200 pl-8 font-outfit">
                            Welcome to Brightwood, where we provide quality education to the children of transferable central government employees, fostering national integration and excellence.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="px-10 py-5 bg-primary hover:bg-secondary text-white font-black text-xs uppercase tracking-[0.3em] rounded-sm transition-all shadow-xl shadow-primary/10 flex items-center gap-3 active:scale-95">
                                <UserCheck size={18} /> Admission Portal
                            </button>
                            <button className="px-10 py-5 bg-white border-2 border-primary text-primary font-black text-xs uppercase tracking-[0.3em] rounded-sm hover:bg-slate-50 transition-all flex items-center gap-3 group/btn">
                                <FileText size={18} className="text-secondary" /> Prospectus 2024
                                <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Right: Structured Grid (Typical of official sites) */}
                    <div className="lg:col-span-12 xl:col-span-5 grid grid-cols-1 gap-4">
                        <div className="bg-primary p-8 rounded-sm shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <h3 className="text-secondary text-xs font-black uppercase tracking-widest mb-6">Quick Shortcuts</h3>
                                <div className="space-y-5">
                                    {[
                                        { label: "Online Fee Payment", color: "text-white" },
                                        { label: "Student Transfer Certificate", color: "text-white/80" },
                                        { label: "Academic Calendar", color: "text-white/80" },
                                        { label: "CBSE Result Analysis", color: "text-white/80" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center group/item cursor-pointer">
                                            <span className={`${item.color} text-[11px] font-bold uppercase tracking-[0.15em] group-hover/item:text-secondary group-hover/item:pl-2 transition-all`}>
                                                {item.label}
                                            </span>
                                            <ArrowRight size={14} className="text-secondary opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-2 transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Image of School Building/Flag */}
                        <div className="aspect-video lg:aspect-[3/2] rounded-sm overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80"
                                alt="KVS Campus"
                                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Strip - National Pride Colors */}
            <div className="absolute bottom-0 left-0 w-full h-2 flex">
                <div className="flex-1 bg-secondary" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-primary" />
            </div>
        </div>
    );
};

export default Hero;
