// 📁 app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import UserDashboard from '@/components/user/UserDashboard';
import { useUserStore } from '@/store/userStore';

export default function DashboardPage() {
    const fetchUserDetails = useUserStore((s) => s.fetchUserDetails);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const data = useUserStore((s) => s.data);

    return <>{data && <UserDashboard data={data} />}</>;
}
