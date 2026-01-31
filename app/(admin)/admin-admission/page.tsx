import { getAllAdmissionApplications, getAdmissionStatistics } from '@/actions/admission';
import AdminAdmissionsClient from './AdminAdmissionsClient';


export default async function AdminAdmissionsPage() {
    // Fetch initial data on server
    const [applicationsResult, statsResult] = await Promise.all([
        getAllAdmissionApplications({ page: 1, limit: 10 }),
        getAdmissionStatistics(),
    ]);

    const applications = applicationsResult.success && applicationsResult.data ? applicationsResult.data : [];
    const pagination = applicationsResult.success && applicationsResult.pagination ? applicationsResult.pagination : null;
    const stats = statsResult.success && statsResult.data ? statsResult.data : null;

    return (
        <AdminAdmissionsClient
            initialApplications={applications}
            initialPagination={pagination}
            initialStats={stats}
        />
    );
}
