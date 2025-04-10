'use client';

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLessonVocabulary, getLessonsByCategory } from "@/services/vocab.service";
import { VocabLessonContent } from "@/components/VocabLessonDetail";
import FlashCard from "@/components/ui/FlashCard";
import { useSearchParams } from "next/navigation";
import QuizGame from "@/components/ui/QuizGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vocabulary } from "@/types/Vocab";
import { Lesson } from "@/types/Category";
import Loading from "@/components/ui/loading";
import Link from "next/link";

export default function LessonPage() {
    const searchParams = useSearchParams();
    const lessonNumber = searchParams.get("lesson_number");
    const categoryId = searchParams.get("categoryId");
    const { t, language } = useLanguage();

    const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!lessonNumber || !categoryId) return;
            try {
                setLoading(true);
                const [vocabData, lessonData] = await Promise.all([
                    getLessonVocabulary(lessonNumber, categoryId),
                    getLessonsByCategory(categoryId),
                ]);
                setVocabList(vocabData);
                setLessons(lessonData);
            } catch (err) {
                console.error(err);
                setError("Không thể tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [lessonNumber, categoryId]);

    if (loading) return <div><Loading /></div>;
    if (error) return <div>{error}</div>;
    if (vocabList.length === 0) return <div>{t("notFound")}</div>;

    return (
        <div className="relative min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
            {/* Mini Lesson Menu */}
            <div className=" hidden md:block fixed top-20 right-4 z-20 bg-background shadow-lg rounded-xl p-4 w-60 max-h-[80vh] overflow-y-auto">
                <h3 className="text-sm font-semibold mb-4 text-center">
                    {t("vocab.TotalLesson")}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {lessons.map((lesson) => {
                        const isActive = lesson.lesson_number.toString() === lessonNumber;

                        return (
                            <Link
                                key={lesson.id}
                                href={`/vocabulary/${lesson.level.toLowerCase()}/${lesson.id}?lesson_number=${lesson.lesson_number}&categoryId=${lesson.category.id}`}
                                className={`relative group text-center text-[13px] font-medium px-2.5 py-2 rounded-xl border border-slate-500 transition-all overflow-hidden ${isActive
                                    ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0px_4px_32px_0_rgba(99,102,241,.70)]'
                                    : 'hover:bg-muted'
                                    }`}
                            >
                                {isActive ? (
                                    <div className="relative overflow-hidden h-5">
                                        <p className="group-hover:-translate-y-6 transition-all duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                            {lesson.lesson_number}
                                        </p>
                                        <p className="absolute top-6 left-0 w-full group-hover:top-0 transition-all duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                                            {lesson.lesson_number}
                                        </p>
                                    </div>
                                ) : (
                                    <span>{lesson.lesson_number}</span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>



            {/* Main Tabs */}
            <Tabs defaultValue="vocab" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="vocab">{t("vocab.listVocab")}</TabsTrigger>
                    <TabsTrigger value="flashcard">{t("vocab.flashcard") || "Flashcard"}</TabsTrigger>
                    <TabsTrigger value="QuizGame">{t("vocab.TestVocab") || "TestVocab"}</TabsTrigger>
                </TabsList>

                <TabsContent value="vocab">
                    <VocabLessonContent vocabList={vocabList} t={t} language={language} />
                </TabsContent>

                <TabsContent value="flashcard">
                    <FlashCard kanjiItems={vocabList} t={t} language={language} />
                </TabsContent>

                <TabsContent value="QuizGame">
                    <QuizGame vocabItems={vocabList} t={t} language={language} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
