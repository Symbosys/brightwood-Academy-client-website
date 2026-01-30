'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createNotice } from '@/actions/notice';
import { Loader2, ArrowLeft, Save } from 'lucide-react';

export default function CreateNoticeForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        category: 'GENERAL',
        priority: 'NORMAL',
        slug: '',
        author: 'Admin User', // Replace with actual admin name from session
        publishDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        eventDate: '',
        isPublished: false,
        isPinned: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));

            // Auto-generate slug from title
            if (name === 'title') {
                const slug = value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                setFormData(prev => ({ ...prev, slug }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.slug) {
            alert('Please fill in all required fields');
            return;
        }

        startTransition(async () => {
            const result = await createNotice({
                title: formData.title,
                description: formData.description,
                content: formData.content || null,
                category: formData.category as any,
                priority: formData.priority as any,
                slug: formData.slug,
                author: formData.author,
                publishDate: new Date(formData.publishDate),
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
                eventDate: formData.eventDate ? new Date(formData.eventDate) : null,
                isPublished: formData.isPublished,
                isPinned: formData.isPinned,
                isActive: true,
            });

            if (result.success) {
                alert('Notice created successfully!');
                router.push('/admin/notices');
                router.refresh();
            } else {
                alert(result.error || 'Failed to create notice');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Back Button */}
            <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Notices
            </button>

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        placeholder="Enter notice title"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Slug (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        placeholder="notice-slug"
                    />
                    <p className="text-xs text-slate-500 mt-1">Auto-generated from title, but you can edit it</p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm resize-none"
                        placeholder="Brief description of the notice"
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Full Content (Optional)
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm resize-none"
                        placeholder="Detailed content of the notice"
                    />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        >
                            <option value="GENERAL">General</option>
                            <option value="ADMISSION">Admission</option>
                            <option value="EXAMINATION">Examination</option>
                            <option value="EVENT">Event</option>
                            <option value="HOLIDAY">Holiday</option>
                            <option value="ACADEMIC">Academic</option>
                            <option value="SPORTS">Sports</option>
                            <option value="CULTURAL">Cultural</option>
                            <option value="IMPORTANT">Important</option>
                            <option value="RESULT">Result</option>
                            <option value="FEE">Fee</option>
                            <option value="SCHOLARSHIP">Scholarship</option>
                            <option value="VACANCY">Vacancy</option>
                            <option value="TENDER">Tender</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Priority <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        >
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Publish Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="publishDate"
                            value={formData.publishDate}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Expiry Date (Optional)
                        </label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Event Date (Optional)
                        </label>
                        <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                    </div>
                </div>

                {/* Author */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Author <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        placeholder="Author name"
                    />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm font-bold text-slate-700">Publish immediately</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="isPinned"
                            checked={formData.isPinned}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm font-bold text-slate-700">Pin to top</span>
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    disabled={isPending}
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Create Notice
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
