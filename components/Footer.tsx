
import { Twitter, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-24 pb-12 overflow-hidden border-t-8 border-secondary">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20 border-b border-white/10">

                    {/* Brand Section - Government/KV Style */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-primary border-4 border-secondary p-2">
                                <Shield size={32} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black font-outfit uppercase tracking-tighter leading-none">
                                    Brightwood <span className="text-secondary">Academy</span>
                                </span>
                                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Autonomous Body under MoE</span>
                            </div>
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed max-w-sm font-medium">
                            Dedicated to excellence in school education, Symbosys provide quality education to the children of transferable central government employees.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Official Links */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary">Institution</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Brightwood Website', path: '#' },
                                { name: 'Brightwood Directory', path: '#' },
                                { name: 'Brightwood Admissions', path: '/admissions' },
                                { name: 'Admin Panel', path: '/login' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a href={item.path} className="text-white/60 text-[10px] hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-2">
                                        {item.name} <ExternalLink size={10} className="text-secondary" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Access */}
                    <div className="lg:col-span-2 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary">Information</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'VMC Members', path: '/about' },
                                { name: 'Staff Details', path: '/about' },
                                { name: 'Annual Report', path: '/news' },
                                { name: 'Syllabus/Books', path: '/academics' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.path} className="text-white/60 text-[10px] hover:text-white transition-colors uppercase tracking-widest font-bold">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact - Official Style */}
                    <div className="lg:col-span-4 space-y-8">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-secondary">School Secretariat</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <MapPin size={20} className="text-secondary shrink-0 mt-1" />
                                <p className="text-white/80 text-[11px] leading-relaxed uppercase tracking-widest font-bold">
                                    Brightwood No. 1, <br /> Hirhi (Near Bhokta Bagicha Railway Station) Lohardaga Jhrkhand 835302
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone size={20} className="text-secondary" />
                                <p className="text-white/80 text-[11px] uppercase tracking-widest font-bold">+91 7004818526</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail size={20} className="text-secondary" />
                                <p className="text-white/80 text-[11px] lowercase tracking-widest font-bold">support@brightwoodacademy.in</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">
                    <div className="text-center md:text-left">
                        <p>© 2025 Brightwood Academy(All Rights Reserved)</p>
                        <p className="mt-1">Maintained by School IT Department</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <span>CBSE : 1234567</span>
                        <span>School Code : 89000</span>
                        <span>Web Visitor Hirhi (Near Bhokta Bagicha Railway Station) Lohardaga Jhrkhand 835302</span>
                    </div>
                </div>

            </div>

            {/* Bottom Govt Bar */}
            <div className="w-full h-1 bg-secondary mt-12 opacity-50" />

            <div className='text-center text-white/100 text-[15px] uppercase tracking-widest font-bold mt-12 '>Developed By <a target="_blank" href="https://symbosys.com/" className='text-blue-500 underline'>Symbosys</a></div>
        </footer>
    );
};

export default Footer;
