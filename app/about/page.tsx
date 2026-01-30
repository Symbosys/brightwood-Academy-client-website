import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AboutPreview from '../../components/AboutPreview';
import Achievements from '../../components/Achievements';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-20"> {/* Offset for Fixed Navbar */}
                <AboutPreview />
                <Achievements />
            </div>
            <Footer />
        </div>
    );
}
