
const Achievements = () => {
    const stats = [
        { label: "CBSE Class X Results", value: "100", suffix: "%" },
        { label: "CBSE Class XII Results", value: "98.5", suffix: "%" },
        { label: "National Sports Winners", value: "150", suffix: "+" },
        { label: "KVS Foundation Year", value: "1963", suffix: "" },
    ];

    return (
        <section className="bg-primary py-24 relative overflow-hidden mb-20">
            {/* Background Texture - Symbols of Growth */}
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                <div className="w-[800px] h-[800px] border-[50px] border-white rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-16 text-center">
                    <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.5em] mb-4">Pride of the Brightwood Academy</h3>
                    <h2 className="text-4xl text-white font-black font-outfit uppercase tracking-tighter">Academic & Performance <span className="text-secondary">Insights.</span></h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group border-r border-white/10 last:border-0">
                            <div className="flex justify-center items-baseline gap-1 mb-2">
                                <span className="text-5xl lg:text-7xl font-black font-outfit text-white group-hover:text-secondary transition-all">
                                    {stat.value}
                                </span>
                                <span className="text-2xl font-black text-secondary">{stat.suffix}</span>
                            </div>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em] mt-4">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary via-white/20" />
        </section>
    );
};

export default Achievements;
