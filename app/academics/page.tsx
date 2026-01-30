import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Curriculum from '../../components/Curriculum';
import Facilities from '../../components/Facilities';

export default function AcademicsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-20">
                <Curriculum />
                <Facilities />
            </div>
            <Footer />
        </div>
    );
}
