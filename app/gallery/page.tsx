import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Gallery from '../../components/Gallery';
import { getGalleryImages } from '@/actions/gallery';
import { getAllNotices } from '@/actions/notice';

export default async function GalleryPage() {
    const [imagesResponse, noticesResponse] = await Promise.all([
        getGalleryImages({ isPublished: true, limit: 100 }),
        getAllNotices({ limit: 5, isPublished: true })
    ]);

    const images = imagesResponse.success ? imagesResponse.data || [] : [];
    const notices = noticesResponse.success ? noticesResponse.data || [] : [];

    return (
        <div className="min-h-screen bg-white">
            <Navbar notices={notices} />
            <div className="pt-20">
                <Gallery initialImages={images as any} />
            </div>
            <Footer />
        </div>
    );
}
