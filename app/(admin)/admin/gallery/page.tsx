'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Eye,
    EyeOff,
    Loader2,
    Upload,
    X,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import {
    getGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    toggleImageVisibility,
    uploadImageAction
} from '@/actions/gallery';
import { GALLERY_CATEGORIES } from '@/validation/gallery';

export default function GalleryAdminPage() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingImage, setEditingImage] = useState<any>(null);
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        category: string;
        eventName: string;
        eventDate: string;
        isPublished: boolean;
        order: number;
    }>({
        title: '',
        description: '',
        category: GALLERY_CATEGORIES[0] || 'OTHERS',
        eventName: '',
        eventDate: '',
        isPublished: true,
        order: 0,
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const result = await getGalleryImages({
                category: filterCategory as any || undefined,
                limit: 100
            });
            if (result.success) {
                setImages(result.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch gallery images:", error);
        } finally {
            setLoading(false);
        }
    }, [filterCategory]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit. Please upload a smaller image.');
                e.target.value = ''; // Reset input
                return;
            }

            setUploadFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: GALLERY_CATEGORIES[0] || 'OTHERS',
            eventName: '',
            eventDate: '',
            isPublished: true,
            order: 0,
        });
        setUploadFile(null);
        setPreviewUrl(null);
        setEditingImage(null);
        setStatus(null);
    };

    const handleOpenModal = (image: any = null) => {
        resetForm();
        if (image) {
            setEditingImage(image);
            setFormData({
                title: image.title,
                description: image.description || '',
                category: image.category,
                eventName: image.eventName || '',
                eventDate: image.eventDate ? new Date(image.eventDate).toISOString().split('T')[0] : '',
                isPublished: image.isPublished,
                order: image.order,
            });
            setPreviewUrl(image.imageUrl);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setStatus(null);

        try {
            let imageUrl = editingImage?.imageUrl;
            let publicId = editingImage?.publicId;

            // 1. Upload new image if provided
            if (uploadFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', uploadFile);

                const uploadResult = await uploadImageAction(uploadFormData);
                if (!uploadResult.success || !('secure_url' in uploadResult)) {
                    throw new Error(uploadResult.error || "Image upload failed");
                }
                imageUrl = uploadResult.secure_url;
                publicId = uploadResult.public_id;
            }

            if (!imageUrl || !publicId) {
                throw new Error("Image is required");
            }

            const finalData = {
                ...formData,
                imageUrl,
                publicId,
                thumbnailUrl: imageUrl, // For now use same URL
            };

            let result;
            if (editingImage) {
                result = await updateGalleryImage({ ...finalData, id: editingImage.id });
            } else {
                result = await createGalleryImage(finalData);
            }

            if (result.success) {
                setStatus({ success: true, message: result.message });
                await fetchImages();
                setTimeout(() => setShowModal(false), 1500);
            } else {
                setStatus({ success: false, error: result.error });
            }
        } catch (error: any) {
            setStatus({ success: false, error: error.message || "An unexpected error occurred" });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) return;

        setActionLoading(true);
        try {
            const result = await deleteGalleryImage(id);
            if (result.success) {
                await fetchImages();
            } else {
                alert(result.error || "Failed to delete image");
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleVisibility = async (id: string) => {
        try {
            const result = await toggleImageVisibility(id);
            if (result.success) {
                setImages(prev => prev.map(img => img.id === id ? { ...img, isPublished: !img.isPublished } : img));
            }
        } catch (error) {
            console.error("Visibility toggle error:", error);
        }
    };

    const filteredImages = images.filter(img =>
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (img.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tighter leading-none">School Gallery</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage website photos and events</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-secondary transition-all active:scale-95 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    Add New Image
                </button>
            </div>

            {/* Filters & Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search images..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 focus:border-primary outline-none font-semibold text-slate-700 shadow-sm transition-all"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 focus:border-primary outline-none font-semibold text-slate-700 shadow-sm transition-all appearance-none"
                    >
                        <option value="">All Categories</option>
                        {GALLERY_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-end gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest bg-white px-6 rounded-2xl border border-slate-100 shadow-sm">
                    {filteredImages.length} Images Found
                </div>
            </div>

            {/* Images Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="animate-spin text-primary" size={48} />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Loading Gallery...</p>
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ImageIcon size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-400 uppercase tracking-tighter">No images found</h3>
                    <p className="text-slate-400 text-sm font-semibold mt-2">Try adjusting your filters or add a new photo</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredImages.map((image) => (
                        <div key={image.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col">
                            {/* Image Container */}
                            <div className="relative aspect-square overflow-hidden bg-slate-100">
                                <Image
                                    src={image.imageUrl}
                                    alt={image.title}
                                    fill
                                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${!image.isPublished ? 'grayscale opacity-60' : ''}`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <div className="flex gap-2 w-full">
                                        <button
                                            onClick={() => handleOpenModal(image)}
                                            className="flex-1 bg-white text-primary py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-xl"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(image.id)}
                                            className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all shadow-xl"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Status Bagde */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${image.isPublished ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'
                                        }`}>
                                        {image.isPublished ? 'Published' : 'Hidden'}
                                    </span>
                                    <span className="bg-primary/90 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                                        {image.category}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleToggleVisibility(image.id)}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                                >
                                    {image.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <h4 className="font-black text-primary uppercase text-sm tracking-tight truncate">{image.title}</h4>
                                {image.eventName && (
                                    <p className="text-secondary text-[10px] font-black uppercase tracking-widest mt-1">
                                        {image.eventName}
                                    </p>
                                )}
                                <p className="text-slate-400 text-xs mt-2 line-clamp-2 font-medium">
                                    {image.description || 'No description provided'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => !actionLoading && setShowModal(false)} />

                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl animate-fade-in-up">
                        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-primary uppercase tracking-tighter leading-none">
                                    {editingImage ? 'Edit Image' : 'Add New Gallery Photo'}
                                </h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
                                    {editingImage ? 'Modify existing record' : 'Upload and categorize new photo'}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-10">
                            {status && (
                                <div className={`p-5 rounded-2xl flex items-center gap-4 animate-shake ${status.success ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'
                                    }`}>
                                    {status.success ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                    <span className="font-bold text-sm uppercase tracking-wider">{status.message || status.error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Left Side: Media */}
                                <div className="space-y-6">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 block">Photo Content *</label>
                                    <div
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className={`group relative aspect-square rounded-3xl border-2 border-dashed border-slate-200 hover:border-primary transition-all overflow-hidden flex flex-col items-center justify-center gap-4 cursor-pointer bg-slate-50/50 hover:bg-slate-50 ${previewUrl ? 'border-none' : ''}`}
                                    >
                                        {previewUrl ? (
                                            <>
                                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                                                    <Upload size={32} />
                                                    <span className="font-black text-xs uppercase tracking-widest">Change Image</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:scale-110 transition-all">
                                                    <Plus size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-black text-sm text-slate-600 uppercase tracking-tight">Select Photo</p>
                                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">PNG, JPG or WEBP up to 5MB</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {uploadFile && (
                                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-primary uppercase truncate max-w-[150px]">{uploadFile.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => { setUploadFile(null); setPreviewUrl(null); }} className="text-slate-400 hover:text-red-500 transition-colors">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Details */}
                                <div className="space-y-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Image Title *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter a descriptive title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-b-2 border-slate-100 focus:border-primary focus:bg-white outline-none transition-all font-semibold text-slate-700"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Category *</label>
                                                <select
                                                    required
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    className="w-full px-6 py-4 bg-slate-50 border-b-2 border-slate-100 focus:border-primary outline-none font-semibold text-slate-700 appearance-none"
                                                >
                                                    {GALLERY_CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Sort Order</label>
                                                <input
                                                    type="number"
                                                    value={formData.order}
                                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                                    className="w-full px-6 py-4 bg-slate-50 border-b-2 border-slate-100 focus:border-primary outline-none font-semibold text-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">Description</label>
                                            <textarea
                                                rows={3}
                                                placeholder="Add some details about this moment..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-b-2 border-slate-100 focus:border-primary outline-none font-semibold text-slate-700 resize-none"
                                            />
                                        </div>

                                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Event Details (Optional)</h4>
                                            <div className="grid grid-cols-1 gap-6">
                                                <div>
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Event Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Annual Sports Meet 2025"
                                                        value={formData.eventName}
                                                        onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 outline-none font-semibold text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Event Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.eventDate}
                                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 outline-none font-semibold text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 py-4">
                                            <input
                                                type="checkbox"
                                                id="isPublished"
                                                checked={formData.isPublished}
                                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                                className="w-5 h-5 accent-primary cursor-pointer"
                                            />
                                            <label htmlFor="isPublished" className="text-xs font-black uppercase text-slate-500 tracking-widest cursor-pointer">Publish immediately</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-4 pt-8 border-t border-slate-100">
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-4 bg-slate-100 text-slate-600 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="px-12 py-4 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/30 flex items-center gap-3 group disabled:opacity-70"
                                >
                                    {actionLoading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                                    )}
                                    {actionLoading ? "SAVING..." : (editingImage ? "UPDATE PHOTO" : "UPLOAD TO GALLERY")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {actionLoading && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-primary/20 backdrop-blur-md animate-fade-in">
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 border border-white/50 animate-fade-in-up">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-slate-100 rounded-full animate-pulse"></div>
                            <Loader2 size={40} className="text-primary animate-spin absolute inset-0 m-auto" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-black text-primary uppercase tracking-tighter leading-none">Processing</h3>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 animate-pulse">Please wait a moment...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
