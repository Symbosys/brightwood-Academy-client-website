
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
    const images = [
        {
            src: "/image/Gallery/zn1yijjyamh8e1f7tfy0.jpg",
            title: "School Cabinet Investiture",
            span: "lg:col-span-2 lg:row-span-2"
        },
        {
            src: "/image/Gallery/uhzzgny19ldo0vqh6ram.jpg",
            title: "Yoga & Physical Education",
            span: "lg:col-span-1 lg:row-span-1"
        },
        {
            src: "/image/Gallery/uhzzgny19ldo0vqh6ram.jpg",
            title: "Yoga Teacher",
            span: "lg:col-span-1 lg:row-span-1"
        },
        {
            src: "/image/Gallery/nh1craw5w8eg7uyfxtds.jpg",
            title: "Language Lab Activity",
            span: "lg:col-span-2 lg:row-span-1"
        },
        {
            src: "/image/Gallery/qmgzjoylrws5gqvnvqnx.jpg",
            title: "Cultural Archive",
            span: "lg:col-span-2 lg:row-span-1"
        }
    ];

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
                    <button className="flex items-center gap-4 text-primary font-black text-[10px] uppercase tracking-[0.5em] group border-b-2 border-primary/10 pb-2">
                        <span>Digital Archive</span>
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-slate-200">
                            <ArrowRight size={18} />
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className={`relative overflow-hidden group rounded-sm ${img.span} shadow-2xl`}>
                            <div className="w-full h-full relative overflow-hidden bg-slate-100">
                                <img
                                    src={img.src}
                                    alt={img.title}
                                    className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-primary/90 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em]">{img.title}</h4>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Gallery;
