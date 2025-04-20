// 📁 app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import UserDashboard from '@/components/user/UserDashboard';
import { useUserDashboardStore } from '@/store/userDashboardStore';

export default function DashboardPage() {
    const fetchUserDetails = useUserDashboardStore((s) => s.fetchUserDetails);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const data = useUserDashboardStore((s) => s.data);

    return <>{data && <UserDashboard data={data} />}</>;
}
