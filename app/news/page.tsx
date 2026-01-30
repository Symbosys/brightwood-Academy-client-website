import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import NewsEvents from '../../components/NewsEvents';

export default function NewsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-20">
                <NewsEvents />
            </div>
            <Footer />
        </div>
    );
}
