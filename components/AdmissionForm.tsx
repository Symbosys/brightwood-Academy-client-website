"use client";

import React, { useState } from 'react';
import { createAdmissionApplication } from '@/actions/admission';
import { User, BookOpen, Users, Home, Info, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const AdmissionForm = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
    const [formData, setFormData] = useState({
        // Student Info
        studentFirstName: '',
        studentMiddleName: '',
        studentLastName: '',
        dateOfBirth: '',
        gender: 'MALE',
        bloodGroup: '',
        nationality: 'Indian',
        religion: '',
        category: 'GENERAL',
        aadharNumber: '',
        // Academic Info
        classApplyingFor: '',
        previousSchool: '',
        previousClass: '',
        academicYear: '2025-26',
        // Parent Info
        fatherName: '',
        fatherOccupation: '',
        fatherPhone: '',
        fatherEmail: '',
        motherName: '',
        motherOccupation: '',
        motherPhone: '',
        motherEmail: '',
        // Address Info
        currentAddress: '',
        currentCity: '',
        currentState: '',
        currentPincode: '',
        permanentAddress: '',
        permanentCity: '',
        permanentState: '',
        permanentPincode: '',
        // Additional Info
        medicalConditions: '',
        specialNeeds: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
    const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // Prepare data for submission
            const submissionData = {
                ...formData,
                dateOfBirth: new Date(formData.dateOfBirth),
                studentMiddleName: formData.studentMiddleName || null,
                bloodGroup: formData.bloodGroup || null,
                religion: formData.religion || null,
                aadharNumber: formData.aadharNumber || null,
                previousSchool: formData.previousSchool || null,
                previousClass: formData.previousClass || null,
                fatherOccupation: formData.fatherOccupation || null,
                fatherEmail: formData.fatherEmail || null,
                motherOccupation: formData.motherOccupation || null,
                motherPhone: formData.motherPhone || null,
                motherEmail: formData.motherEmail || null,
                medicalConditions: formData.medicalConditions || null,
                specialNeeds: formData.specialNeeds || null,
            };

            const result = await createAdmissionApplication(submissionData as any);

            if (result.success) {
                setStatus({ success: true, message: result.message });
                setStep(6); // Success step
            } else {
                setStatus({ success: false, error: result.error });
            }
        } catch (error: any) {
            setStatus({ success: false, error: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between mb-12 max-w-4xl mx-auto px-4">
            {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex flex-col items-center relative flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 z-10 ${step === s ? 'bg-primary text-white shadow-xl shadow-primary/30 scale-110' :
                            step > s ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                        {step > s ? <CheckCircle2 size={24} /> : s}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-3 ${step === s ? 'text-primary' : 'text-slate-400'}`}>
                        {s === 1 ? 'Student' : s === 2 ? 'Academic' : s === 3 ? 'Parents' : s === 4 ? 'Address' : 'Final'}
                    </span>
                    {s < 5 && (
                        <div className={`absolute top-6 left-1/2 w-full h-[2px] -z-0 transition-colors duration-300 ${step > s ? 'bg-green-500' : 'bg-slate-100'}`} />
                    )}
                </div>
            ))}
        </div>
    );

    const inputClasses = "w-full px-5 py-4 bg-white border-b-2 border-slate-100 focus:border-primary outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300 focus:bg-slate-50/50";
    const labelClasses = "text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block";

    if (step === 6) {
        return (
            <div className="max-w-xl mx-auto py-20 px-6 text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black text-primary uppercase tracking-tighter mb-4">Application Submitted!</h2>
                <p className="text-slate-600 font-semibold mb-10 leading-relaxed">
                    {status?.message}
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-10 py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-sm shadow-xl hover:bg-secondary transition-all active:scale-95"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            {renderStepIndicator()}

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden border border-slate-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0" />

                {status?.error && (
                    <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-4 animate-shake">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm uppercase tracking-wider">{status.error}</span>
                    </div>
                )}

                {/* Step 1: Student Information */}
                {step === 1 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Student Information</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Basic personal details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className={labelClasses}>First Name *</label>
                                <input required name="studentFirstName" value={formData.studentFirstName} onChange={handleChange} className={inputClasses} placeholder="e.g. ARJUN" />
                            </div>
                            <div>
                                <label className={labelClasses}>Middle Name</label>
                                <input name="studentMiddleName" value={formData.studentMiddleName} onChange={handleChange} className={inputClasses} placeholder="e.g. KUAMR" />
                            </div>
                            <div>
                                <label className={labelClasses}>Last Name *</label>
                                <input required name="studentLastName" value={formData.studentLastName} onChange={handleChange} className={inputClasses} placeholder="e.g. SHARMA" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>Date of Birth *</label>
                                <input required type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses}>Gender *</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                                    <option value="MALE">MALE</option>
                                    <option value="FEMALE">FEMALE</option>
                                    <option value="OTHER">OTHER</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <label className={labelClasses}>Blood Group</label>
                                <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputClasses} placeholder="e.g. O+" />
                            </div>
                            <div>
                                <label className={labelClasses}>Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} className={inputClasses}>
                                    <option value="GENERAL">GENERAL</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="EWS">EWS</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Aadhar Number</label>
                                <input name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} className={inputClasses} placeholder="12 Digit Number" maxLength={12} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Academic Details */}
                {step === 2 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Academic Details</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Class and previous school info</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>Class Applying For *</label>
                                <select required name="classApplyingFor" value={formData.classApplyingFor} onChange={handleChange} className={inputClasses}>
                                    <option value="">SELECT CLASS</option>
                                    {['LKG', 'UKG', 'CLASS I', 'CLASS II', 'CLASS III', 'CLASS IV', 'CLASS V', 'CLASS VI', 'CLASS VII', 'CLASS VIII', 'CLASS IX', 'CLASS X', 'CLASS XI', 'CLASS XII'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses}>Academic Year *</label>
                                <select required name="academicYear" value={formData.academicYear} onChange={handleChange} className={inputClasses}>
                                    <option value="2025-26">2025-26</option>
                                    <option value="2026-27">2026-27</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className={labelClasses}>Previous School Name</label>
                                <input name="previousSchool" value={formData.previousSchool} onChange={handleChange} className={inputClasses} placeholder="SCHOOL NAME" />
                            </div>
                            <div>
                                <label className={labelClasses}>Previous Class</label>
                                <input name="previousClass" value={formData.previousClass} onChange={handleChange} className={inputClasses} placeholder="e.g. CLASS V" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Parent/Guardian Information */}
                {step === 3 && (
                    <div className="space-y-10 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Parent Details</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Father's and Mother's information</p>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                            <h4 className="text-[12px] font-black text-primary uppercase tracking-[0.3em] mb-8 border-l-4 border-primary pl-4">Father's Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-2">
                                    <label className={labelClasses}>Father's Full Name *</label>
                                    <input required name="fatherName" value={formData.fatherName} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className={labelClasses}>Occupation</label>
                                    <input name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className={labelClasses}>Phone *</label>
                                    <input required name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} className={inputClasses} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-100 mt-8">
                            <h4 className="text-[12px] font-black text-secondary uppercase tracking-[0.3em] mb-8 border-l-4 border-secondary pl-4">Mother's Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-2">
                                    <label className={labelClasses}>Mother's Full Name *</label>
                                    <input required name="motherName" value={formData.motherName} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className={labelClasses}>Occupation</label>
                                    <input name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className={labelClasses}>Phone</label>
                                    <input name="motherPhone" value={formData.motherPhone} onChange={handleChange} className={inputClasses} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Address Information */}
                {step === 4 && (
                    <div className="space-y-10 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Home size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Correspondence Address</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Current living address</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className={labelClasses}>Full Address *</label>
                                <textarea required name="currentAddress" value={formData.currentAddress} onChange={handleChange} className={`${inputClasses} min-h-[100px] resize-none`} placeholder="HOUSE NO, STREET, AREA..." />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <label className={labelClasses}>City *</label>
                                    <input required name="currentCity" value={formData.currentCity} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>State *</label>
                                    <input required name="currentState" value={formData.currentState} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Pincode *</label>
                                    <input required name="currentPincode" value={formData.currentPincode} onChange={handleChange} className={inputClasses} maxLength={6} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-3 py-4">
                                <input type="checkbox" id="sameAsCurrent" className="w-5 h-5 accent-primary" onChange={(e) => {
                                    if (e.target.checked) {
                                        setFormData(prev => ({
                                            ...prev,
                                            permanentAddress: prev.currentAddress,
                                            permanentCity: prev.currentCity,
                                            permanentState: prev.currentState,
                                            permanentPincode: prev.currentPincode
                                        }));
                                    }
                                }} />
                                <label htmlFor="sameAsCurrent" className="text-xs font-black uppercase text-slate-500 tracking-widest cursor-pointer">Permanent Address is same as Current</label>
                            </div>
                        </div>

                        {/* Permanent Address hidden/shown logic could be here, for now we just show both or let user fill */}
                        <div className="space-y-8 opacity-60">
                            <div>
                                <label className={labelClasses}>Permanent Address *</label>
                                <textarea required name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} className={`${inputClasses} min-h-[100px] resize-none`} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <label className={labelClasses}>City *</label>
                                    <input required name="permanentCity" value={formData.permanentCity} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>State *</label>
                                    <input required name="permanentState" value={formData.permanentState} onChange={handleChange} className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Pincode *</label>
                                    <input required name="permanentPincode" value={formData.permanentPincode} onChange={handleChange} className={inputClasses} maxLength={6} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Final Review & Additional Info */}
                {step === 5 && (
                    <div className="space-y-10 animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                <Info size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">Additional Information</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Medical and other details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <label className={labelClasses}>Medical Conditions (if any)</label>
                                <textarea name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} className={`${inputClasses} min-h-[100px] resize-none`} placeholder="Any allergies or chronic conditions..." />
                            </div>
                            <div>
                                <label className={labelClasses}>Special Educational Needs</label>
                                <textarea name="specialNeeds" value={formData.specialNeeds} onChange={handleChange} className={`${inputClasses} min-h-[100px] resize-none`} placeholder="Any support requirements..." />
                            </div>
                        </div>

                        <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                            <div className="flex items-start gap-4">
                                <input type="checkbox" required id="declaration" className="w-6 h-6 mt-1 accent-primary" />
                                <label htmlFor="declaration" className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-wider">
                                    I hereby declare that all the information provided in this application form is true and correct to the best of my knowledge. I understand that any false information may lead to the rejection of my application or cancellation of admission.
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
                    {step > 1 ? (
                        <button type="button" onClick={handlePrev} className="px-8 py-4 bg-slate-100 text-slate-600 font-black text-[11px] uppercase tracking-[0.2em] rounded-sm hover:bg-slate-200 transition-all active:scale-95">
                            Previous Step
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 5 ? (
                        <button type="button" onClick={handleNext} className="px-10 py-5 bg-secondary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-sm shadow-xl shadow-secondary/20 hover:-translate-y-1 transition-all active:translate-y-0">
                            Next Stage
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-12 py-5 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-sm shadow-2xl shadow-primary/30 flex items-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            {loading ? "PROCESSING..." : "SUBMIT APPLICATION"}
                        </button>
                    )}
                </div>
            </form>

            <div className="mt-12 text-center text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                Brightwood School © 2025 • Official Admission Portal
            </div>
        </div>
    );
};

export default AdmissionForm;
