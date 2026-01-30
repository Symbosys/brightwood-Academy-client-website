
import { CreditCard, Download, UserCheck, GraduationCap, HeartHandshake, ArrowRight } from 'lucide-react';

const FeePortal = () => {
    return (
        <section id="fees" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left side: Information */}
                    <div className="lg:w-1/2 space-y-10">
                        <div className="space-y-4">
                            <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.5em]">Transparency First</h3>
                            <h2 className="text-4xl lg:text-5xl font-black font-outfit text-primary leading-tight uppercase tracking-tighter">
                                Scholar Support & <br /> <span className="text-secondary">Fees.</span>
                            </h2>
                        </div>

                        <p className="text-lg text-slate-500 leading-relaxed">
                            We believe in accessible education for all. Our fee structure is competitive and transparent, with dedicated support for meritorious students from economically weaker sections.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 group hover:border-primary transition-all rounded-xl">
                                <div className="w-14 h-14 bg-primary text-white flex items-center justify-center shrink-0 rounded-lg">
                                    <HeartHandshake size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black font-outfit text-primary uppercase tracking-tight">Merit-cum-Means</h4>
                                    <p className="text-slate-500 text-xs">Upto 50% tuition waiver for eligible students based on past results.</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-100 group hover:border-primary transition-all rounded-xl">
                                <div className="w-14 h-14 bg-secondary text-white flex items-center justify-center shrink-0 rounded-lg">
                                    <GraduationCap size={28} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black font-outfit text-primary uppercase tracking-tight">Girl Child Scholarship</h4>
                                    <p className="text-slate-500 text-xs">Special incentives to promote education for girls in our community.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Mockup Portal */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-primary p-8 md:p-12 shadow-2xl rounded-3xl relative overflow-hidden">
                            {/* Graphic circles */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                            <div className="space-y-8 relative z-10">
                                <div className="flex justify-between items-center text-white border-b border-white/10 pb-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Digital Campus</p>
                                        <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter">Student Portal</h3>
                                    </div>
                                    <UserCheck size={32} className="text-secondary" />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5 group">
                                        <div className="flex items-center gap-4">
                                            <CreditCard size={20} className="text-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Pay Fee Online</span>
                                        </div>
                                        <ArrowRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </button>

                                    <button className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/5 group">
                                        <div className="flex items-center gap-4">
                                            <Download size={20} className="text-secondary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Fee Structure (PDF)</span>
                                        </div>
                                        <ArrowRight size={16} className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </button>
                                </div>

                                <button className="w-full py-5 bg-secondary text-white font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-primary transition-all rounded-xl shadow-lg shadow-secondary/20">
                                    Login to Portal
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeePortal;
