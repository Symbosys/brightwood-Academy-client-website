'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { loginAdmin } from '@/actions/admin';
import { adminLoginSchema, type AdminLoginInput } from '@/validation/admin';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AdminLoginInput>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: AdminLoginInput) => {
        setError(null);
        startTransition(async () => {
            const result = await loginAdmin(data);
            if (result.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(result.error || 'Login failed. Please check your credentials.');
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-outfit">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[10rem] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-secondary/5 rounded-full blur-[10rem] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">

                {/* Left Side: Branding/Info */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-primary relative overflow-hidden text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black/20"></div>

                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
                                <Zap className="text-primary fill-primary" size={24} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">Bright<span className="text-secondary not-italic">wood</span></span>
                        </div>

                        <h1 className="text-5xl font-black leading-tight tracking-tighter mb-8 uppercase italic">
                            Command <br />
                            <span className="text-secondary not-italic">Center</span> Access
                        </h1>

                        <p className="text-slate-300 font-medium text-lg max-w-md leading-relaxed">
                            Sign in to manage institutional data, oversee admissions, and control administrative operations with military-grade precision.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
                            <div className="w-10 h-10 bg-emerald-400/20 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-400/20">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Secure Protocol</p>
                                <p className="text-sm text-slate-300 font-bold">End-to-end encrypted session</p>
                            </div>
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                            Authorized Personnel Only &copy; 2026 Admin Portal
                        </p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-10 lg:p-20 flex flex-col justify-center">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic font-outfit">
                            System <span className="text-primary not-italic">Login</span>
                        </h2>
                        <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Identify yourself to proceed</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                            <div className="w-10 h-10 bg-red-100 text-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Lock size={20} />
                            </div>
                            <p className="text-xs font-black uppercase tracking-tight text-red-600">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terminal *</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="Enter authorized email"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                            {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key *</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                />
                            </div>
                            {errors.password && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center justify-between pb-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Maintain Session</span>
                            </label>
                            <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-secondary hover:underline underline-offset-4 transition-all">Recover Key?</button>
                        </div>

                        <button
                            disabled={isPending}
                            className="w-full py-5 bg-primary hover:bg-secondary text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 hover:shadow-secondary/20 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Establish Connection
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Access Only</p>
                        <div className="flex gap-4">
                            {['Terms', 'privacy', 'Support'].map((link) => (
                                <button key={link} className="text-[9px] font-bold text-slate-300 uppercase tracking-widest hover:text-primary transition-colors">{link}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
