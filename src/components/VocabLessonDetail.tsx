// components/VocabLessonContent.tsx

import { Card } from "@/components/ui/card";

import { LessonDetail } from "@/types/lesson";
type Props = {
    lesson: LessonDetail;
    t: (key: string) => string;
    language: "vi" | "en";
};

export const VocabLessonContent: React.FC<Props> = ({ lesson, t, language }) => {
    const getLocalizedContent = (vi: string, en: string) => {
        return language === "vi" ? vi : en;
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
                            {lesson.level}
                        </span>
                        <span className="text-muted-foreground">
                            {lesson.book} - {t("vocab.lesson")} {lesson.lesson_number}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                        {t("vocab.lesson")} {lesson.lesson_number}
                    </h1>
                    <p className="text-muted-foreground">
                        {getLocalizedContent(lesson.description_vi, lesson.description_en)}
                    </p>
                </div>

                <div className="space-y-6">
                    {lesson.vocab.map((word) => (
                        <Card key={word.id} className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{word.vocab}</h3>
                                        <p className="text-sm text-muted-foreground">{word.furigana}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {getLocalizedContent(word.meaning_vi ?? '', word.meaning_en ?? '')}
                                        </p>
                                    </div>
                                </div>

                                {word.examples?.map((ex, index) => (
                                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-lg mb-2">{ex.example_text}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {getLocalizedContent(ex.meaning_vi, ex.meaning_en)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
