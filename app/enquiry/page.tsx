"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Send, MessageSquare, Phone, Mail, Clock, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { createContactInquiry } from '@/actions/inquery';

export default function EnquiryPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        subject: 'ADMISSION_INQUIRY',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Clean data before submission
            const cleanedData = {
                ...formData,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() === '' ? null : formData.phone.trim(),
                message: formData.message.trim()
            };

            const result = await createContactInquiry(cleanedData as any);
            if (result.success) {
                setSubmitted(true);
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    subject: 'ADMISSION_INQUIRY',
                    message: ''
                });
            } else {
                // Better error reporting for validation
                const detailMsg = result.details ? ("\n- " + result.details.map((d: any) => d.message).join("\n- ")) : "";
                alert(`${result.error}${detailMsg}`);
            }
        } catch (error) {
            alert("An unexpected error occurred. Please check your network connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-32 pb-24">
                {/* Hero Section */}
                <section className="bg-primary py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="max-w-3xl">
                            <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Admissions & General Help Desk</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black font-outfit text-white uppercase tracking-tighter leading-[1] italic">
                                Institutional <br /> <span className="text-secondary not-italic">Enquiry.</span>
                            </h1>
                            <p className="mt-8 text-white/50 font-semibold text-lg uppercase tracking-tight max-w-xl">
                                Reach out to our administrative office for any queries regarding admissions, scholarships, or general school information.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Side Info Cards */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 flex items-start gap-6 group hover:-translate-y-1 transition-all">
                                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Helpline</div>
                                    <div className="text-lg font-black text-primary font-outfit">+91-7004818526</div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 flex items-start gap-6 group hover:-translate-y-1 transition-all">
                                <div className="w-14 h-14 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Official Support</div>
                                    <div className="text-lg font-black text-primary font-outfit">support@brightwoodacademy.in</div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200/50">
                                <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">Office Hours</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mon - Sat</span>
                                        <span className="text-xs font-black text-primary">08:00 AM - 03:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sunday</span>
                                        <span className="text-xs font-black text-secondary uppercase">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inquiry Form */}
                        <div className="lg:col-span-8">
                            <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                                {submitted ? (
                                    <div className="py-20 text-center animate-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle size={48} />
                                        </div>
                                        <h2 className="text-3xl font-black font-outfit text-primary uppercase tracking-tighter mb-4">Submission Successful!</h2>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs max-w-sm mx-auto leading-relaxed">
                                            Your enquiry has been logged into our system. Our administrative team will review and respond to your email.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="mt-10 px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary transition-all"
                                        >
                                            Send Another Enquiry
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4 mb-12">
                                            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center">
                                                <MessageSquare size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black font-outfit text-primary uppercase tracking-tighter">Compose Enquiry</h2>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fields marked * are mandatory</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name *</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        placeholder="ENTER YOUR FULL NAME"
                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800 uppercase text-[11px] tracking-widest"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address *</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        placeholder="EXAMPLE@MAIL.COM"
                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800 text-[11px] tracking-widest"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        placeholder="10 DIGIT MOBILE NO."
                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800 text-[11px] tracking-widest"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Inquiry Subject *</label>
                                                    <select
                                                        required
                                                        value={formData.subject}
                                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary outline-none transition-all font-black text-primary text-[10px] tracking-widest uppercase hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        <option value="ADMISSION_INQUIRY">Admission Inquiry</option>
                                                        <option value="GENERAL_SUPPORT">General Support</option>
                                                        <option value="FEEDBACK">Feedback</option>
                                                        <option value="COMPLAINT">Complaint</option>
                                                        <option value="OTHERS">Others</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Inquiry Message *</label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    placeholder="DESCRIBE YOUR QUERY IN DETAIL..."
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800 text-[11px] tracking-widest resize-none"
                                                ></textarea>
                                            </div>

                                            <button
                                                disabled={loading}
                                                className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-4 transition-all hover:bg-secondary hover:-translate-y-1 active:scale-95 disabled:opacity-50 group disabled:hover:translate-y-0"
                                            >
                                                {loading ? (
                                                    <Loader2 className="animate-spin" size={18} />
                                                ) : (
                                                    <>SUBMIT ENQUIRY <Send size={16} className="group-hover:translate-x-1 transition-transform" /> </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Address Section */}
                <section className="max-w-7xl mx-auto px-6 mt-20">
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-8 justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black font-outfit text-primary uppercase tracking-tight">Vidyalaya Location</h4>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-1">
                                    Hirhi (Near Bhokta Bagicha Railway Station) Lohardaga Jhrkhand 835302
                                </p>
                            </div>
                        </div>
                        <button className="px-8 py-3 border-2 border-primary text-primary font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
                            Open in Maps
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
