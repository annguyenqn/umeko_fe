'use client';

import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLessonVocabulary, getLessonsByCategory } from "@/services/vocab.service";
import { VocabLessonContent } from "@/components/VocabLessonDetail";
import FlashCard from "@/components/ui/FlashCard";
import { useSearchParams } from "next/navigation";
import QuizGame from "@/components/ui/QuizGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vocabulary } from "@/types/Vocab";
import { Lesson } from "@/types/Category";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import Loading from "@/components/ui/loading";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/ScrollArea";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useUserDashboardStore } from "@/store/userDashboardStore";
import { useAuthStore } from "@/store/useAuthStore";
export default function LessonPage() {
    const searchParams = useSearchParams();
    const lessonNumber = searchParams.get("lesson_number");
    const categoryId = searchParams.get("categoryId");
    const { t, language } = useLanguage();

    const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const fetchUserDetails = useUserDashboardStore((s) => s.fetchUserDetails);
    const dashboardData = useUserDashboardStore((s) => s.data);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserDetails();
        }
    }, [isAuthenticated, fetchUserDetails]);

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


    const learnedVocabMap = useMemo(() => {
        const map = new Map<string, string>();

        if (dashboardData?.vocab?.vocabList?.length) {
            dashboardData.vocab.vocabList.forEach((vocab) => {
                if (vocab.learningStatus) {
                    map.set(vocab.id, vocab.learningStatus);
                }
            });
        }

        return map;
    }, [dashboardData]);


    if (loading) return <div><Loading /></div>;
    if (error) return <div>{error}</div>;
    if (vocabList.length === 0) return <div>{t("notFound")}</div>;

    return (
        <div className="relative min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
            <div className="z-30 mb-4 flex justify-end md:absolute md:top-8 md:right-8">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="rounded-full shadow-md">
                            {t("vocab.TotalLesson")}
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[260px] sm:w-[300px] pt-6">
                        <SheetTitle>
                            <VisuallyHidden>{t("vocab.TotalLesson")}</VisuallyHidden>
                        </SheetTitle>

                        <ScrollArea className="h-[75vh] pr-2 pt-2">
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
                                            {lesson.lesson_number}
                                        </Link>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>

            <Tabs defaultValue="vocab" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="vocab">{t("vocab.listVocab")}</TabsTrigger>
                    <TabsTrigger value="flashcard">{t("vocab.flashcard") || "Flashcard"}</TabsTrigger>
                    <TabsTrigger value="QuizGame">{t("vocab.TestVocab") || "TestVocab"}</TabsTrigger>
                </TabsList>

                <TabsContent value="vocab">
                    <VocabLessonContent vocabList={vocabList} t={t} language={language} learnedVocabMap={learnedVocabMap} />
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
