'use client';

import { useLanguage } from "@/contexts/LanguageContext";
import { N5_LESSONS, N4_LESSONS } from "@/data/lessons";
import { VocabLessonContent } from "@/components/VocabLessonDetail";
import FlashCard from "@/components/ui/FlashCard";
import { useParams } from "next/navigation";
import QuizGame from "@/components/ui/QuizGame";
// 👉 shadcn Tabs component
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LessonPage() {
    const { level, lessonId } = useParams();
    const { t, language } = useLanguage();

    const lessons = level === "n5" ? N5_LESSONS : N4_LESSONS;
    const lesson = lessons.find((l) => l.id === lessonId);

    if (!lesson) {
        return <div>{t("notFound")}</div>;
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
            <Tabs defaultValue="vocab" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="vocab">{t("vocab.listVocab")}</TabsTrigger>
                    <TabsTrigger value="flashcard">{t("vocab.flashcard") || "Flashcard"}</TabsTrigger>
                    <TabsTrigger value="QuizGame">{t("vocab.TestVocab") || "TestVocab"}</TabsTrigger>
                </TabsList>

                <TabsContent value="vocab">
                    <VocabLessonContent lesson={lesson} t={t} language={language} />
                </TabsContent>

                <TabsContent value="flashcard">
                    <FlashCard kanjiItems={lesson.vocab} t={t} language={language} />
                </TabsContent>

                <TabsContent value="QuizGame">
                    <QuizGame vocabItems={lesson.vocab} t={t} language={language} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
