'use client';

import { FC, useEffect, useState } from 'react';
import UserDashboard from '@/components/user/UserDashboard';
import { useUserDashboardStore } from '@/store/userDashboardStore';
import EmptyDashboardState from '@/components/user/EmptyDashboardState';
import { Skeleton } from '@/components/ui/skeleton';
import { withAuth } from '@/components/user/withAuth';

function DashboardPage() {
    const fetchUserDetails = useUserDashboardStore((s) => s.fetchUserDetails);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            await fetchUserDetails();
            setIsLoading(false);
        };

        loadData();
    }, [fetchUserDetails]);

    const data = useUserDashboardStore((s) => s.data);
    console.log('this is data', data);


    // Check if user has any vocabulary data
    const hasVocabData = data &&
        data.vocab?.vocabList?.length > 0 &&
        data.reviewHistory?.length > 0;

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <>
            {hasVocabData ? (
                <UserDashboard data={data!} />
            ) : (
                <EmptyDashboardState />
            )}
        </>
    );
}

// Skeleton loader for the dashboard while data is loading
function DashboardSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <Skeleton className="h-10 w-64 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-full rounded-lg" />
                    </div>
                ))}
            </div>

            <div className="space-y-3 pt-4">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-[450px] w-full rounded-lg" />
            </div>
        </div>
    );
}
export default withAuth(DashboardPage) as unknown as FC