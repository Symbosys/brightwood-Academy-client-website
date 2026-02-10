"use client";

import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface GalleryImage {
    imageUrl: string;
    title: string;
    category: string;
    id?: string;
}

interface GalleryProps {
    initialImages?: GalleryImage[];
}

const Gallery = ({ initialImages = [] }: GalleryProps) => {
    const [activeFilter, setActiveFilter] = useState('ALL');

    const categories = ['ALL', 'ACADEMIC', 'SPORTS', 'CULTURAL', 'EVENTS', 'INFRASTRUCTURE', 'ACHIEVEMENTS', 'CELEBRATIONS', 'OTHERS'];

    const displayImages = activeFilter === 'ALL' 
        ? initialImages 
        : initialImages.filter(img => img.category === activeFilter);

    const getSpanClass = (index: number) => {
        const pattern = [
            "lg:col-span-2 lg:row-span-2",
            "lg:col-span-1 lg:row-span-1",
            "lg:col-span-1 lg:row-span-1",
            "lg:col-span-2 lg:row-span-1",
            "lg:col-span-2 lg:row-span-1",
        ];
        return pattern[index % pattern.length];
    };

    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20">
                    <div className="space-y-4">
                        <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
                            <ImageIcon size={16} /> Photo Archive
                        </h3>
                        <h2 className="text-4xl lg:text-6xl font-black font-outfit text-primary leading-none uppercase tracking-tighter italic">
                            Brightwood <br /> <span className="text-secondary">Chronicles.</span>
                        </h2>
                    </div>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full border-2 ${
                                activeFilter === cat 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-transparent text-primary/40 border-slate-100 hover:border-primary/20'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayImages.length > 0 ? (
                        displayImages.map((img, idx) => (
                            <div key={idx} className={`relative overflow-hidden group rounded-sm ${getSpanClass(idx)} shadow-2xl`}>
                                <div className="w-full h-full relative overflow-hidden bg-slate-100 min-h-[300px]">
                                    <img
                                        src={img.imageUrl}
                                        alt={img.title}
                                        className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-primary/90 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">{img.title}</h4>
                                        <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest mt-1">{img.category}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-sm">
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No images found in this category</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Gallery;
