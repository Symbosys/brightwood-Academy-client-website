
import { ArrowRight, CheckCircle2, Award, Users, BookOpen, GraduationCap, Globe } from 'lucide-react';

const AboutPreview = () => {
    const stats = [
        { icon: Users, value: "30,000+", label: "Students Enrolled" },
        { icon: BookOpen, value: "41,000+", label: "Courses Uploaded" },
        { icon: GraduationCap, value: "11,000+", label: "People Certified" },
        { icon: Globe, value: "39,000+", label: "Global Teachers" }
    ];

    const features = [
        {
            number: "01",
            title: "Why Choose Us",
            description: "At Brightwood School, we believe in nurturing the whole child, balancing academic rigor with opportunities for personal growth through arts, sports, and community service."
        },
        {
            number: "02",
            title: "Our Mission",
            description: "We recognize and nurture the unique talents and interests of each student, providing a supportive environment for personal development and self-discovery."
        },
        {
            number: "03",
            title: "Our Vision",
            description: "Developing confident, resilient, and independent learners who are empowered to take ownership of their educational journey and personal growth."
        }
    ];

    return (
        <section id="about" className="py-32 bg-white relative overflow-hidden ">
            <div className="max-w-7xl mx-auto px-6">

                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h3 className="text-secondary text-[10px] font-black uppercase tracking-[0.5em] mb-6">
                        About Brightwood Academy
                    </h3>
                    <h1 className="text-5xl lg:text-7xl font-black font-outfit text-primary leading-[0.9] tracking-tighter uppercase italic mb-6">
                        Welcome to <br />
                        <span className="text-secondary not-italic">Brightwood Academy</span>
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">

                    {/* Left Column - Text Content */}
                    <div className="space-y-8">
                        <p className="text-lg text-slate-600 leading-relaxed font-outfit">
                            Brightwood School stands out for its exceptional academic programs and holistic student development. With a wide range of subjects and extracurricular activities, the school nurtures critical thinking and creativity.
                        </p>

                        <p className="text-lg text-slate-600 leading-relaxed font-outfit">
                            State-of-the-art facilities, including modern classrooms, science labs, and a sports complex, support comprehensive learning. Emphasizing values like respect and integrity, Brightwood fosters a positive and inclusive community.
                        </p>

                        <p className="text-lg text-slate-600 leading-relaxed font-outfit">
                            Brightwood School has a strong network of alumni who have gone on to achieve success in various fields. The school maintains an active alumni association that provides networking opportunities and support for current students.
                        </p>

                        <div className="pt-6">
                            <button className="px-8 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-sm hover:bg-secondary transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-secondary/20 hover:scale-105 transform duration-300">
                                Apply for Admission
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative mt-12">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-50">
                            <img
                                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80"
                                alt="Brightwood Academy Building"
                                className="w-full h-full object-cover transition-all duration-1000 hover:scale-105"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-2xl text-white shadow-2xl">
                            <Award size={32} className="text-secondary mb-2" />
                            <h4 className="text-2xl font-black font-outfit uppercase tracking-tighter">Excellence</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Since 1963</p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group relative">
                            <div className="bg-slate-50 p-8 rounded-2xl hover:bg-primary transition-all duration-500 h-full border-2 border-slate-100 hover:border-primary hover:shadow-2xl">
                                <div className="text-6xl font-black font-outfit text-secondary/20 group-hover:text-white/20 transition-colors mb-4">
                                    {feature.number}
                                </div>
                                <h3 className="text-2xl font-black font-outfit text-primary group-hover:text-white uppercase tracking-tighter mb-4 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-600 group-hover:text-white/90 leading-relaxed font-outfit transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default AboutPreview;
