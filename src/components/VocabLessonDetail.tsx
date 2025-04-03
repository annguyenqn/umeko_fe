import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Added shadcn button
import { Speaker } from "lucide-react"; // Added speaker icon from lucide-react
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

    // Function to handle audio playback
    const playAudio = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP'; // Set to Japanese, adjust as needed
        window.speechSynthesis.speak(utterance);
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
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-bold mb-1">{word.vocab}</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => playAudio(word.vocab)}
                                                aria-label="Play pronunciation"
                                            >
                                                <Speaker className="h-4 w-4" />
                                            </Button>
                                        </div>
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
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg mb-2">{ex.example_text}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {getLocalizedContent(ex.meaning_vi, ex.meaning_en)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => playAudio(ex.example_text)}
                                                aria-label="Play example pronunciation"
                                            >
                                                <Speaker className="h-4 w-4" />
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