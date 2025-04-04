'use client';

import { LessonSection } from '@/components/lessons/LessonSection';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLessonsByCategory } from '@/services/vocab.service';
import { Lesson } from '@/types/Category';
import Loading from '@/components/ui/loading';

export default function LevelPage() {
    const { level } = useParams();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('categoryId');

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

    if (loading) return <div><Loading /></div>;
    if (!lessons.length) return <div>No lessons found</div>;
    if (!level) {
        return <div>Level not found</div>;
    }
    const levelString = Array.isArray(level) ? level[0] : level;
    return <LessonSection level={levelString} lessons={lessons} />;
}
