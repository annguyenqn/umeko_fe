import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume, Volume2 } from "lucide-react";
import { Vocabulary } from "@/types/Vocab";
import { useState, useCallback } from "react";

type Props = {
    vocabList: Vocabulary[];
    t: (key: string) => string;
    language: "vi" | "en";
};

export const VocabLessonContent: React.FC<Props> = ({ vocabList, t, language }) => {
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

    const getLocalizedContent = (vi: string, en: string) => {
        return language === "vi" ? vi : en;
    };

    const playAudio = useCallback((text: string, id: string) => {
        window.speechSynthesis.cancel();
        if (currentPlayingId === id) {
            setCurrentPlayingId(null);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.onend = () => setCurrentPlayingId(null);
        setCurrentPlayingId(id);
        window.speechSynthesis.speak(utterance);
    }, [currentPlayingId]);

    return (
        <div className="min-h-screen p-4 md:p-8"> {/* Giảm padding trên mobile */}
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{t("vocab.listVocab")}</h1>

                <div className="space-y-6">
                    {vocabList.map((word) => (
                        <Card key={word.id} className="p-4 md:p-6"> {/* Giảm padding trên mobile */}
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold">{word.vocab}</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => playAudio(word.vocab, `vocab-${word.id}`)}
                                            aria-label="Play pronunciation"
                                        >
                                            {currentPlayingId === `vocab-${word.id}` ? (
                                                <Volume2 className="h-4 w-4" />
                                            ) : (
                                                <Volume className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <div className="md:text-right">
                                        <p className="text-sm md:text-base font-medium">
                                            {getLocalizedContent(word.mean_vi ?? '', word.mean_en ?? '')}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1">{word.furigana}</p>
                                    </div>
                                </div>

                                {word.examples?.slice(0, 2).map((ex, index) => (
                                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                            <div>
                                                <p className="text-lg mb-2">{ex.example_text}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {getLocalizedContent(ex.meaning_vi, ex.meaning_en)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => playAudio(ex.example_text, `example-${word.id}-${index}`)}
                                                aria-label="Play example pronunciation"
                                            >
                                                {currentPlayingId === `example-${word.id}-${index}` ? (
                                                    <Volume2 className="h-4 w-4" />
                                                ) : (
                                                    <Volume className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
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