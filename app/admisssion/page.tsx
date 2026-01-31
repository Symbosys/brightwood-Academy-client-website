import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdmissionForm from '@/components/AdmissionForm';
import { ShieldCheck, GraduationCap, Clock, HelpCircle } from 'lucide-react';

export default function AdmissionPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32">
                {/* Hero Section - Formal & Impressive */}
                <section className="relative py-20 overflow-hidden bg-primary">
                    <div className="absolute inset-0 bg-[url('/image/Gallery/uhzzgny19ldo0vqh6ram.jpg')] bg-cover bg-center opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/10">
                                <ShieldCheck size={14} className="text-secondary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Official Admission Portal 2025-26</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black font-outfit text-white uppercase tracking-tighter leading-none mb-6">
                                Start Your <span className="text-secondary">Journey</span> <br />
                                to Excellence.
                            </h1>

                            <div className="w-20 h-1.5 bg-secondary rounded-full mb-8" />

                            <p className="max-w-2xl text-white/70 font-semibold text-lg leading-relaxed">
                                Join a community of learners dedicated to national integration, academic excellence, and holistic development. Apply now for the upcoming academic session.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Info Cards */}
                <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <GraduationCap size={24} />, title: "Class I to XII", desc: "Open for all streams in Senior Secondary level." },
                            { icon: <Clock size={24} />, title: "Deadline", desc: "Apply before 31st March 2025 for first round." },
                            { icon: <HelpCircle size={24} />, title: "Assistance", desc: "Need help? Call our support at +91-7004818526" }
                        ].map((card, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-start gap-6 transition-transform hover:-translate-y-2">
                                <div className="w-14 h-14 bg-slate-50 text-primary rounded-2xl flex items-center justify-center shrink-0">
                                    {card.icon}
                                </div>
                                <div>
                                    <h3 className="font-black text-primary uppercase tracking-wider text-sm mb-2">{card.title}</h3>
                                    <p className="text-slate-500 font-semibold text-xs leading-relaxed uppercase tracking-widest">{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Form Section */}
                <section className="py-24 bg-[#f8fafc]">
                    <div className="max-w-3xl mx-auto px-6 text-center mb-16">
                        <span className="text-secondary text-xs font-black uppercase tracking-[0.4em] block mb-4">Registration Form</span>
                        <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Application Details</h2>
                        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Please fill all the mandatory fields carefully. Once submitted, applications cannot be edited.</p>
                    </div>

                    <AdmissionForm />
                </section>

                {/* Important Instructions Section */}
                <section className="py-20 border-t border-slate-100 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-8 leading-none">
                                    Important <br />
                                    <span className="text-secondary">Instructions</span>
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        "Ensure all spellings match the official documents (Aadhar/Birth Certificate).",
                                        "Valid mobile number and email are required for future communication.",
                                        "Documents should be ready in scanned PDF/JPG format (max 2MB per file).",
                                        "Registration does not guarantee admission. It depends on seat availability and criteria."
                                    ].map((text, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                                                <ShieldCheck size={14} />
                                            </div>
                                            <p className="font-bold text-slate-600 text-sm uppercase tracking-widest leading-relaxed">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <ShieldCheck size={120} className="text-slate-100" />
                                </div>
                                <h3 className="text-xl font-black text-primary uppercase tracking-widest mb-4">Note for Parents</h3>
                                <p className="text-slate-600 font-semibold text-sm leading-relaxed mb-6 uppercase tracking-wider">
                                    Brightwood School is committed to providing a transparent and fair admission process. We strictly follow the guidelines set by the Ministry of Education.
                                </p>
                                <div className="p-6 bg-white rounded-xl border border-slate-200">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Help Desk</div>
                                    <div className="text-lg font-black text-primary">+91 7004818526</div>
                                    <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">Available: Mon - Sat (9 AM - 4 PM)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
