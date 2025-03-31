import { Card } from "@/components/ui/card";
import { Vocabulary } from "@/types/Vocab";

type Props = {
    vocabList: Vocabulary[];
    t: (key: string) => string;
    language: "vi" | "en";
};

export const VocabLessonContent: React.FC<Props> = ({ vocabList, t, language }) => {
    const getLocalizedContent = (vi: string, en: string) => {
        return language === "vi" ? vi : en;
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{t("vocab.listVocab")}</h1>

                <div className="space-y-6">
                    {vocabList.map((word) => (
                        <Card key={word.id} className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{word.vocab}</h3>
                                        <p className="text-sm text-muted-foreground">{word.furigana}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {getLocalizedContent(word.mean_vi ?? '', word.mean_en ?? '')}
                                        </p>
                                    </div>
                                </div>

                                {word.examples?.slice(0, 2).map((ex, index) => (
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
