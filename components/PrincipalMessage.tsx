
import { Quote, UserCheck, Award, BookOpen } from 'lucide-react';

const PrincipalMessage = () => {
    return (
        <section id="leadership" className="py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Seal Backdrop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/2 rounded-full border-[40px] border-primary/5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-white shadow-2xl overflow-hidden border border-slate-200">

                    <div className="grid grid-cols-1 lg:grid-cols-12">

                        {/* Principal's Bio Section */}
                        <div className="lg:col-span-4 bg-primary p-12 text-white space-y-8 flex flex-col justify-between">
                            <div className="space-y-6">
                                <div className="aspect-[4/5] bg-slate-200 overflow-hidden border-4 border-white/20">
                                    <img
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80"
                                        alt="Principal"
                                        className="w-full h-full object-cover grayscale brightness-110"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter">Sh. Ramesh Kumar</h3>
                                    <p className="text-secondary text-xs font-bold uppercase tracking-[0.2em] mt-2 italic">Principal - Brightwood</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center border border-white/10 p-4">
                                    <Award size={20} className="text-secondary mx-auto mb-2" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Experience</p>
                                    <p className="text-sm font-black">20+ Yrs</p>
                                </div>
                                <div className="text-center border border-white/10 p-4">
                                    <UserCheck size={20} className="text-secondary mx-auto mb-2" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">Qualifications</p>
                                    <p className="text-sm font-black">M.Sc, B.Ed</p>
                                </div>
                            </div>
                        </div>

                        {/* Formal Message Content */}
                        <div className="lg:col-span-8 p-12 lg:p-20 space-y-10 bg-white relative">
                            <Quote size={120} className="absolute -top-10 -right-10 text-primary/5" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-secondary">
                                    <BookOpen size={20} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em]">Desk of the Principal</span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black font-outfit text-primary tracking-tighter uppercase leading-none">
                                    Nurturing <span className="italic text-secondary">Future Citizens</span> <br /> of our Nation.
                                </h2>
                            </div>

                            <div className="space-y-8 text-slate-700 font-medium leading-relaxed text-lg border-l-4 border-slate-100 pl-8 font-outfit">
                                <p>
                                    brightwood is a premier organization in India, and it is a privilege to lead this branch of the Sangathan. Our mission is to provide an environment where children can thrive academically and socially while remaining rooted in Indian culture.
                                </p>
                                <p>
                                    Technical integration in classrooms and a solid foundation in the sciences are our core strengths. We believe every student has the potential to become a leader who contributes to the growth of Bharat.
                                </p>
                            </div>

                            <div className="pt-10 flex items-center justify-between border-t border-slate-100">
                                <div className="flex flex-col gap-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Official Seal</p>
                                    <div className="w-20 h-20 bg-slate-100 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center italic text-slate-300 text-[8px] text-center p-2">
                                        Seal of the Principal <br /> No. 1 brightwood ranchi
                                    </div>
                                </div>
                                <div className="text-right">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Signature" className="h-12 opacity-30 invert grayscale brightness-0 ml-auto" />
                                    <p className="mt-4 text-xs font-black uppercase tracking-widest text-primary">Jai Hind.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default PrincipalMessage;
