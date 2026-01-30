
const Facilities = () => {
    const facilities = [
        {
            title: "SMART Classrooms",
            desc: "Equipped with interactive whiteboards and digital resources for an immersive learning experience.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80"
        },
        {
            title: "Composite Science Lab",
            desc: "Well-equipped Physics, Chemistry, and Biology labs as per CBSE norms for practical excellence.",
            image: "https://images.unsplash.com/photo-1564410267841-915d8e4d71ea?auto=format&fit=crop&q=80"
        },
        {
            title: "Sports Complex",
            desc: "Vast playground for Cricket, Football, and Basketball with professional coaching facilities.",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80"
        },
        {
            title: "Computer Center",
            desc: "Modern IT lab with high-speed internet and latest software for Skill-based subjects.",
            image: "https://images.unsplash.com/photo-1547480053-7d174f67b557?auto=format&fit=crop&q=80"
        }
    ];

    return (
        <section className="py-32 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20">
                    <div className="space-y-4">
                        <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.5em]">Our Infrastructure</h3>
                        <h2 className="text-4xl lg:text-6xl font-black font-outfit text-primary leading-none tracking-tighter uppercase">
                            Modern <br /> Amenities.
                        </h2>
                    </div>
                    <p className="text-slate-500 max-w-md text-lg leading-relaxed">
                        We provide a safe, secure, and technologically advanced environment conducive to high-quality learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {facilities.map((f, i) => (
                        <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg border border-slate-100 bg-slate-50">
                            <img
                                src={f.image}
                                alt={f.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                <h4 className="text-xl font-black font-outfit uppercase tracking-tighter mb-2 group-hover:text-secondary transition-colors">{f.title}</h4>
                                <p className="text-[10px] font-medium text-white/70 uppercase tracking-widest leading-relaxed opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Facilities;
