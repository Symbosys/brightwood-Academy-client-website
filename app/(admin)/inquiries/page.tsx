import { getAllContactInquiries, getInquiryStatistics } from '@/actions/inquery';
import AdminInquiriesClient from './AdminInquiriesClient';



export default async function AdminInquiriesPage() {
    // Fetch initial data on server
    const [inquiriesResult, statsResult] = await Promise.all([
        getAllContactInquiries({ page: 1, limit: 10 }),
        getInquiryStatistics(),
    ]);

    const inquiries = inquiriesResult.success && inquiriesResult.data ? inquiriesResult.data : [];
    const pagination = inquiriesResult.success && inquiriesResult.pagination ? inquiriesResult.pagination : null;
    const stats = statsResult.success && statsResult.data ? statsResult.data : null;

    return (
        <AdminInquiriesClient
            initialInquiries={inquiries}
            initialPagination={pagination}
            initialStats={stats}
        />
    );
}
