'use client';

import { LessonSection } from '@/components/lessons/LessonSection';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLessonsByCategory } from '@/services/vocab.service';
import { Lesson } from '@/types/Category';

export default function LevelPage() {
    const { level } = useParams();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId'); // Lấy categoryId từ URL query

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLessons() {
            if (!level || !categoryId) {
                setLoading(false);
                return notFound();
            }

            try {
                const data = await getLessonsByCategory(categoryId);
                setLessons(data);
            } catch (error) {
                console.error('Failed to fetch lessons:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchLessons();
    }, [level, categoryId]);

    if (loading) return <div>Loading...</div>;
    if (!lessons.length) return <div>No lessons found</div>;
    if (!level) {
        return <div>Level not found</div>; // Handle the case where level is undefined
    }
    return <LessonSection level={level} lessons={lessons} />;
}
