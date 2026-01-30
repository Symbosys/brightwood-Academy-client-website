
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Smt. Anjali Sharma",
            role: "Parent | Govt. Employee",
            text: "Being a central government employee, brightwood is our first choice. The consistency in the curriculum across different regions is a boon for my daughter's education during our transfers.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80"
        },
        {
            name: "Master Rahul Gupta",
            role: "School Captain | Batch 2024",
            text: "KV has given me the confidence to compete at a national level. The focus on science exhibitions and sports alongside academics is what makes us true KVians.",
            image: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80"
        },
        {
            name: "Sh. Vijay Vardhan",
            role: "Alumni | IAS Officer",
            text: "The values instilled in me at brightwood  formed the bedrock of my career in public service. The sense of national integration is unparalleled in any other institution.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
        }
    ];

    return (
        <section className="py-32 bg-slate-50 overflow-hidden relative border-t-4 border-primary">

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24 space-y-4">
                    <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.5em]">The Voice of Brightwood</h3>
                    <h2 className="text-4xl lg:text-6xl font-black font-outfit text-primary leading-none uppercase tracking-tighter italic">
                        Stakeholders' <br /> <span className="text-secondary">Reflections.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-10 shadow-2xl relative border-t-8 border-primary group hover:border-secondary transition-all">
                            <Quote size={60} className="text-slate-100 absolute top-4 right-4" />

                            <div className="flex gap-2 mb-8">
                                {[...Array(5)].map((_, j) => (
                                    <Star key={j} size={14} className="fill-secondary text-secondary" />
                                ))}
                            </div>

                            <p className="text-slate-700 text-lg leading-relaxed font-medium italic mb-10 border-l-2 border-slate-100 pl-6">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary grayscale group-hover:grayscale-0 transition-all duration-700 shadow-lg">
                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-primary text-sm font-black uppercase tracking-tight">{t.name}</h4>
                                    <p className="text-secondary text-[10px] font-black uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Statutory Badges */}
                <div className="mt-24 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
                    {['Ministry of Education', 'CBSE Affiliated', 'National Integration', 'KVS Sangathan'].map(item => (
                        <span key={item} className="text-[12px] font-black uppercase tracking-[0.4em] text-primary">{item}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
