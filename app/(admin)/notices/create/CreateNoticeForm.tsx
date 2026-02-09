'use client';

import { useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createNotice } from '@/actions/notice';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noticeSchema, type NoticeInput } from '@/validation/notice';
import { generateSlug } from '@/lib/utils';

export default function CreateNoticeForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(noticeSchema),
        defaultValues: {
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
            isActive: true,
        }
    });

    const title = watch('title');

    // Auto-generate slug from title
    useEffect(() => {
        if (title) {
            setValue('slug', generateSlug(title), { shouldValidate: true });
        }
    }, [title, setValue]);

    const onSubmit = async (data: NoticeInput) => {
        startTransition(async () => {
            // Filter out empty strings for date fields to allow Zod to handle optional/nullable
            const formattedData = {
                ...data,
                expiryDate: data.expiryDate || null,
                eventDate: data.eventDate || null,
            };

            const result = await createNotice(formattedData);

            if (result.success) {
                alert('Notice created successfully!');
                router.push('/notices');
                router.refresh();
            } else {
                alert(result.error || 'Failed to create notice');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        {...register('title')}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.title ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm`}
                        placeholder="Enter notice title"
                    />
                    {errors.title && (
                        <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Slug display (readonly or just hidden as requested) */}
                {/* The user said "don't show input box of slug" */}
                <input type="hidden" {...register('slug')} />

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register('description')}
                        rows={3}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm resize-none`}
                        placeholder="Brief description of the notice"
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Full Content (Optional)
                    </label>
                    <textarea
                        {...register('content')}
                        rows={6}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.content ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm resize-none`}
                        placeholder="Detailed content of the notice"
                    />
                    {errors.content && (
                        <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
                    )}
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('category')}
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
                        {errors.category && (
                            <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Priority <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('priority')}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        >
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                        {errors.priority && (
                            <p className="text-xs text-red-500 mt-1">{errors.priority.message}</p>
                        )}
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
                            {...register('publishDate')}
                            className={`w-full px-4 py-3 bg-slate-50 border ${errors.publishDate ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm`}
                        />
                        {errors.publishDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.publishDate.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Expiry Date (Optional)
                        </label>
                        <input
                            type="date"
                            {...register('expiryDate')}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                        {errors.expiryDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.expiryDate.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Event Date (Optional)
                        </label>
                        <input
                            type="date"
                            {...register('eventDate')}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                        />
                        {errors.eventDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.eventDate.message}</p>
                        )}
                    </div>
                </div>

                {/* Author */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Author <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('author')}
                        className={`w-full px-4 py-3 bg-slate-50 border ${errors.author ? 'border-red-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm`}
                        placeholder="Author name"
                    />
                    {errors.author && (
                        <p className="text-xs text-red-500 mt-1">{errors.author.message}</p>
                    )}
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('isPublished')}
                            className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <span className="text-sm font-bold text-slate-700">Publish immediately</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            {...register('isPinned')}
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
