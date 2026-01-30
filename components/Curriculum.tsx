
import { Globe, Lightbulb, Trophy, BookOpen } from 'lucide-react';

const Curriculum = () => {
    const programs = [
        {
            icon: BookOpen,
            title: "Foundation Stage",
            desc: "Focusing on play-way and activity-based learning for the tiny tots (Pre-Nursery to KG).",
            color: "border-secondary"
        },
        {
            icon: Lightbulb,
            title: "Scholastic Brilliance",
            desc: "A rigorous NCERT-mapped curriculum (Primary to Secondary) ensuring core subject mastery.",
            color: "border-primary"
        },
        {
            icon: Trophy,
            title: "Co-Scholastic Track",
            desc: "Extensive exposure to Yoga, Music, Classical Dance, and Vedic Mathematics.",
            color: "border-secondary"
        },
        {
            icon: Globe,
            title: "Global Ready",
            desc: "Integration of Artificial Intelligence, French, and German for the global citizens of tomorrow.",
            color: "border-primary"
        }
    ];

    return (
        <section id="academics" className="py-32 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-24 space-y-4">
                    <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Academic Roadmap</h3>
                    <h2 className="text-4xl lg:text-6xl font-black font-outfit text-primary leading-none tracking-tighter">
                        Holistic Learning <br /> <span className="text-secondary">Environment.</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg pt-4">
                        We follow a multi-dimensional curriculum designed by experts to ensure balanced growth of IQ (Intellect), EQ (Emotion), and SQ (Spirituality).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {programs.map((p, i) => (
                        <div key={i} className={`p-8 bg-white border-t-4 ${p.color} shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-300 group`}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-8 transition-colors ${p.color.includes('primary') ? 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-secondary/5 text-secondary group-hover:bg-secondary group-hover:text-white'}`}>
                                <p.icon size={26} />
                            </div>
                            <h3 className="text-lg font-black font-outfit text-primary mb-4 uppercase tracking-tight">{p.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom Highlight */}
                <div className="mt-20 p-8 md:p-12 bg-primary relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative z-10 space-y-2">
                        <h4 className="text-white text-2xl font-black font-outfit uppercase tracking-tight">CBSE Center of Excellence</h4>
                        <p className="text-white/60 text-sm font-bold uppercase tracking-widest">Ensuring quality standard in every lecture</p>
                    </div>
                    <button className="relative z-10 px-8 py-4 bg-secondary text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-primary transition-all rounded-md">
                        View Detailed Syllabus
                    </button>
                    {/* Background Graphic */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4" />
                </div>

            </div>
        </section>
    );
};

export default Curriculum;
