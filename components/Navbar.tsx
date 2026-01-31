'use client';

import { useState, useEffect } from 'react';
import { Shield, Menu, X, GraduationCap, PhoneCall, Mail, Info } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', path: '/about' },
        { name: 'Academics', path: '/academics' },
        { name: 'Admissions', path: '/admissions' },
        { name: 'Announcements', path: '/notice' },
        { name: 'Enquiry', path: '/enquiry' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 left-0">
            {/* KV Top Bar with Ticker */}
            <div className={`w-full bg-primary text-white transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100 border-b border-white/10'}`}>
                {/* Contact Info */}
                <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2"><PhoneCall size={12} className="text-secondary" /> +91-7004818526</span>
                        <span className="flex items-center gap-2"><Mail size={12} className="text-secondary" /> support@brightwoodacademy.in</span>
                    </div>
                    <div className="hidden md:flex gap-4 items-center">
                        <span className="bg-secondary px-2 py-0.5 rounded text-white">CBSE Affiliated</span>
                        <span>Region: Delhi</span>
                    </div>
                </div>

                {/* News Ticker - Very KV Style */}
                <div className="bg-slate-900/50 py-1.5 overflow-hidden border-t border-white/5 relative">
                    <div className="flex items-center overflow-hidden whitespace-nowrap">
                        <div className="bg-secondary px-4 py-1 text-[10px] font-black uppercase tracking-widest z-10 shadow-lg shrink-0">Latest Updates</div>
                        <div className="animate-ticker text-[10px] font-bold uppercase tracking-widest text-white/80 inline-block pl-[100%]">
                            • Admission open for Class I session 2025-26
                            • Annual Sports Meet results scheduled for next week
                            • Teacher's Day celebrations gallery updated
                            • Swachhta Pakhwada 2024 mass pledge conducted
                            • Brightwood Regional Science Exhibition starts from tomorrow
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-full transition-all duration-500 ${scrolled ? 'bg-white shadow-xl py-2' : 'bg-white py-4 shadow-sm'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

                    {/* Logo Section - Formal KV Style */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className={`w-14 h-14 bg-[#ffcc00] rounded-full border-2 border-primary flex items-center justify-center p-2 shadow-inner transition-transform group-hover:rotate-12`}>
                            {/* Symbolizing KVS Logo motif */}
                            <div className="relative w-full h-full">
                                <Shield className="text-primary w-full h-full" strokeWidth={2.5} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-secondary" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className={`text-2xl font-black font-outfit uppercase tracking-tighter leading-none text-primary`}>
                                bright <span className="text-secondary">wood</span>
                            </h1>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500`}>
                                An Autonomous Body Under MoE, Govt. of India
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-md relative group ${scrolled ? 'text-slate-600 hover:text-primary hover:bg-slate-50' : 'text-primary hover:bg-primary/5'}`}
                            >
                                {link.name}
                                <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
                            </Link>
                        ))}

                        <div className="w-px h-6 bg-slate-200 mx-4" />

                        {/* <button className="px-6 py-2.5 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-md hover:bg-secondary transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                            <GraduationCap size={14} /> ERP Portal
                        </button> */}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-primary bg-slate-100 rounded-lg"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="fixed inset-0 bg-white z-[100] flex flex-col p-8 animate-in slide-in-from-right duration-300">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary rounded-full" />
                            <span className="text-xl font-black font-outfit text-primary tracking-tighter">brightwood</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-primary p-2 bg-slate-100 rounded-full"><X size={24} /></button>
                    </div>
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="text-xl font-black text-primary hover:text-secondary transition-colors uppercase tracking-tight py-4 border-b border-slate-50 flex justify-between items-center"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                                <Info size={16} className="text-slate-300" />
                            </Link>
                        ))}
                        <button className="w-full mt-8 py-5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20">
                            Apply Online
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
