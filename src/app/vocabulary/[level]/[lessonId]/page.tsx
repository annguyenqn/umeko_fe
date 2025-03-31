'use client';

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLessonVocabulary } from "@/services/vocab.service";
import { VocabLessonContent } from "@/components/VocabLessonDetail";
import FlashCard from "@/components/ui/FlashCard";
import { useSearchParams } from "next/navigation";
import QuizGame from "@/components/ui/QuizGame";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vocabulary } from "@/types/Vocab";

export default function LessonPage() {
    const searchParams = useSearchParams();
    const lessonNumber = searchParams.get("lesson_number");
    const { t, language } = useLanguage();

    const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchVocab() {
            if (lessonNumber) {
                try {
                    setLoading(true);
                    const data = await getLessonVocabulary(lessonNumber);
                    setVocabList(data);
                } catch (err) {
                    console.log(err);
                    setError("Không thể tải dữ liệu từ vựng.");
                } finally {
                    setLoading(false);
                }
            }
        }

        fetchVocab();
    }, [lessonNumber]);  // Reload khi lessonNumber thay đổi

    if (loading) return <div>{t("loading")}</div>;
    if (error) return <div>{error}</div>;
    if (vocabList.length === 0) return <div>{t("notFound")}</div>;

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
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
