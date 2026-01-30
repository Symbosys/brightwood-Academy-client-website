import { FileText, Bell, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
    // Mock statistics - replace with actual data from server actions
    const stats = [
        {
            name: 'Total Admissions',
            value: '156',
            change: '+12%',
            trend: 'up',
            icon: FileText,
            color: 'bg-blue-500',
        },
        {
            name: 'Active Notices',
            value: '23',
            change: '+5',
            trend: 'up',
            icon: Bell,
            color: 'bg-purple-500',
        },
        {
            name: 'Pending Inquiries',
            value: '18',
            change: '-3',
            trend: 'down',
            icon: MessageSquare,
            color: 'bg-amber-500',
        },
        {
            name: 'Admin Users',
            value: '8',
            change: '+1',
            trend: 'up',
            icon: Users,
            color: 'bg-emerald-500',
        },
    ];

    const recentActivities = [
        {
            id: 1,
            type: 'admission',
            message: 'New admission application from John Doe',
            time: '5 minutes ago',
        },
        {
            id: 2,
            type: 'notice',
            message: 'Notice "Exam Schedule 2025" published',
            time: '1 hour ago',
        },
        {
            id: 3,
            type: 'inquiry',
            message: 'New inquiry from parent about fee structure',
            time: '2 hours ago',
        },
        {
            id: 4,
            type: 'admin',
            message: 'New admin user "Sarah Wilson" added',
            time: '3 hours ago',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-white">
                <h1 className="text-3xl font-black font-outfit mb-2">
                    Welcome back, Admin! 👋
                </h1>
                <p className="text-white/80 font-medium">
                    Here's what's happening with your school today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                <TrendingUp size={16} className={stat.trend === 'down' ? 'rotate-180' : ''} />
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-800 mb-1">{stat.value}</h3>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            {stat.name}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black font-outfit text-primary">Recent Activity</h2>
                        <button className="text-sm font-bold text-primary hover:text-secondary transition-colors">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-800">{activity.message}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock size={12} className="text-slate-400" />
                                        <p className="text-xs text-slate-500">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black font-outfit text-primary mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full px-4 py-3 bg-primary hover:bg-secondary text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary/20">
                            + New Admission
                        </button>
                        <button className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold text-sm rounded-xl transition-all">
                            + Create Notice
                        </button>
                        <button className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-all">
                            View Inquiries
                        </button>
                        <button className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-all">
                            + Add Admin User
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admission Status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black font-outfit text-primary mb-4">
                        Admission Status
                    </h3>
                    <div className="space-y-3">
                        {[
                            { status: 'Pending', count: 45, color: 'bg-amber-500' },
                            { status: 'Under Review', count: 32, color: 'bg-blue-500' },
                            { status: 'Approved', count: 58, color: 'bg-emerald-500' },
                            { status: 'Rejected', count: 21, color: 'bg-red-500' },
                        ].map((item) => (
                            <div key={item.status} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                                    <span className="text-sm font-bold text-slate-700">{item.status}</span>
                                </div>
                                <span className="text-sm font-black text-slate-800">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notice Categories */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-black font-outfit text-primary mb-4">
                        Notice Categories
                    </h3>
                    <div className="space-y-3">
                        {[
                            { category: 'Admission', count: 8, color: 'bg-blue-500' },
                            { category: 'Examination', count: 5, color: 'bg-purple-500' },
                            { category: 'Events', count: 6, color: 'bg-pink-500' },
                            { category: 'Important', count: 4, color: 'bg-red-500' },
                        ].map((item) => (
                            <div key={item.category} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                                    <span className="text-sm font-bold text-slate-700">{item.category}</span>
                                </div>
                                <span className="text-sm font-black text-slate-800">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
