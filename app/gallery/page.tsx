import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Gallery from '../../components/Gallery';

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-20">
                <Gallery />
            </div>
            <Footer />
        </div>
    );
}
