'use client'

import { useLanguage } from "@/contexts/LanguageContext"
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { LessonSectionProps } from '@/types/lesson'

export function LessonSection({ level, lessons }: LessonSectionProps) {
    const { t, language } = useLanguage()

    // Helper function to get content based on language
    const getLocalizedContent = (vi: string, en: string) => {
        return language === 'vi' ? vi : en
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">
                        {t(`vocab.${level.toLowerCase()}.title`)}
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        {`${lessons.length} ${t('vocab.totalLessons')}`}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <Link
                            key={lesson.id}
                            href={`/kanji/${level.toLowerCase()}/${lesson.id}`}
                            className="transition-transform hover:-translate-y-1"
                        >
                            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">
                                                {`${lesson.book} - ${t('vocab.lesson')} ${lesson.lesson_number}`}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {getLocalizedContent(lesson.description_vi, lesson.description_en)}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                            {lesson.level}
                                        </span>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span>
                                                {`${lesson.vocab.length} ${t('vocab.words')}`}
                                            </span>
                                            <span className="text-primary">
                                                50%
                                            </span>
                                        </div>
                                        <Progress value={50} className="h-1" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
} 