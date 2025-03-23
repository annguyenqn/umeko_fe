'use client'

import { LessonSection } from '@/components/lessons/LessonSection'
import { N5_LESSONS } from '@/data/lessons'

export default function N5VocabPage() {
    return <LessonSection level="N5" lessons={N5_LESSONS} />
} 