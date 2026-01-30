import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Header */}
            <section className="pt-40 pb-20 bg-primary relative overflow-hidden text-center text-white px-6">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-blob" />
                    <div className="absolute bottom-10 right-10 w-60 h-60 bg-secondary rounded-full blur-3xl animate-blob delay-2000" />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h1 className="text-6xl font-black font-outfit uppercase tracking-tighter italic">Get In <span className="text-secondary not-italic">Touch</span></h1>
                    <div className="w-24 h-2 bg-secondary/30 rounded-full mx-auto mt-6 mb-8" />
                    <p className="text-xl text-white/70 font-medium">Have questions? We're here to help you. Reach out to us via any of the channels below.</p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info Cards */}
                    <div className="space-y-6">
                        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-primary/5 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
                                <Phone size={32} />
                            </div>
                            <h3 className="text-2xl font-black font-outfit text-primary mb-2">Call Us</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Phone Support</p>
                            <p className="text-xl font-bold text-slate-800">+91 7004818526</p>
                        </div>

                        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-primary/5 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-8">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-2xl font-black font-outfit text-primary mb-2">Email Us</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Official Mail</p>
                            <p className="text-xl font-bold text-slate-800">support@brightwoodacademy.in</p>
                        </div>

                        <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-primary/5 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8">
                                <Clock size={32} />
                            </div>
                            <h3 className="text-2xl font-black font-outfit text-primary mb-2">Visit Us</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-4">Working Hours</p>
                            <p className="text-xl font-bold text-slate-800">Mon - Sat: 8AM - 3PM</p>
                            <p className="text-xl font-bold text-slate-800">Sun: Closed</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl shadow-primary/10 p-12 border border-slate-50">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                                <MessageSquare size={24} />
                            </div>
                            <h2 className="text-3xl font-black font-outfit text-primary tracking-tight">Send a Message</h2>
                        </div>

                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-800" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-800">
                                    <option>Admission Inquiry</option>
                                    <option>General Support</option>
                                    <option>Feedback</option>
                                    <option>Others</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea placeholder="How can we help you?" rows={6} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-800 resize-none"></textarea>
                            </div>

                            <button className="px-12 py-5 bg-primary hover:bg-secondary text-white font-black text-xs uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-4 transition-all hover:-translate-y-1 active:scale-95 group">
                                Send Message <Send size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="w-full h-[500px] bg-slate-200 relative">
                <div className="absolute inset-0 grayscale opacity-50 bg-[url('https://images.unsplash.com/photo-1524666041070-9d87656c25bb?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-primary/20"></div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm">
                        <MapPin size={48} className="text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">School Location</h3>
                        <p className="text-slate-500 font-medium">Hirhi (Near Bhokta Bagicha Railway Station) Lohardaga Jhrkhand 835302</p>
                        <button className="mt-6 text-primary font-black uppercase tracking-widest text-xs hover:text-secondary transition-colors underline decoration-2 underline-offset-4">Get Directions</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
