'use client'

import { LessonSection } from '@/components/lessons/LessonSection'
import { N4_LESSONS } from '@/data/lessons'

export default function N4VocabPage() {
    return <LessonSection level="N4" lessons={N4_LESSONS} />
} 