import { getAllNotices, getNoticeStatistics } from '@/actions/notice';
import AdminNoticesClient from './AdminNoticesClient';



export default async function AdminNoticesPage() {
    // Fetch initial data on server
    const [noticesResult, statsResult] = await Promise.all([
        getAllNotices({ page: 1, limit: 10 }),
        getNoticeStatistics(),
    ]);

    const notices = noticesResult.success && noticesResult.data ? noticesResult.data : [];
    const pagination = noticesResult.success && noticesResult.pagination ? noticesResult.pagination : null;
    const stats = statsResult.success && statsResult.data ? statsResult.data : null;

    return (
        <AdminNoticesClient
            initialNotices={notices}
            initialPagination={pagination}
            initialStats={stats}
        />
    );
}
