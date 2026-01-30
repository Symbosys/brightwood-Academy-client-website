import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FeePortal from '../../components/FeePortal';

export default function AdmissionsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-20">
                <section className="py-20 bg-primary text-white text-center">
                    <h1 className="text-5xl font-black font-outfit uppercase tracking-tighter">Admissions 2025-26</h1>
                    <p className="mt-4 text-white/60 font-bold uppercase tracking-widest">Join the Brightwood Family</p>
                </section>
                <FeePortal />
                {/* We could add an admission form here later */}
            </div>
            <Footer />
        </div>
    );
}
