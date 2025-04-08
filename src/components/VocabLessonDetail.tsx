import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../components/ui/Dialog";
import { Volume, Volume2, Image as ImageIcon } from "lucide-react";
import { Vocabulary } from "@/types/Vocab";
import { useState, useCallback } from "react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
    console.log('vocab list', vocabList);

    const playAudio = useCallback((soundLink: string, id: string) => {
        if (currentPlayingId === id) {
            setCurrentPlayingId(null);
            return;
        }

        const dynamicAudio = new Audio(soundLink);
        dynamicAudio.play().then(() => {
            setCurrentPlayingId(id);
            dynamicAudio.onended = () => setCurrentPlayingId(null);
        }).catch((err) => console.error("Audio playback error:", err));
    }, [currentPlayingId]);



    const playAudioExample = useCallback((text: string, id: string) => {
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
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{t("vocab.listVocab")}</h1>

                <div className="space-y-6">
                    {vocabList.map((word) => (
                        <Card key={word.id} className="p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold text-primary">{word.vocab}</h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => playAudio(word.sound_link, `vocab-${word.id}`)}
                                            aria-label="Play pronunciation"
                                            className="hover:bg-accent rounded-full"
                                        >
                                            {currentPlayingId === `vocab-${word.id}` ? (
                                                <Volume2 className="h-5 w-5 text-blue-500" />
                                            ) : (
                                                <Volume className="h-5 w-5" />
                                            )}
                                        </Button>
                                    </div>
                                    <div className="md:text-right space-y-1">
                                        <p className="text-sm md:text-base font-medium text-foreground">
                                            {getLocalizedContent(word.mean_vi ?? '', word.mean_en ?? '')}
                                        </p>
                                        <p className="text-sm text-muted-foreground italic">{word.furigana}</p>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-medium">[Loại từ]:</span> {word.word_type}
                                        </p>
                                    </div>
                                </div>

                                {/* Image Dialog with Hidden Title */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="w-fit">
                                            <ImageIcon className="h-4 w-4 mr-2" />
                                            {t("vocab.viewImage")}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <VisuallyHidden>
                                            <DialogTitle>{t("vocab.imageDialogTitle")}</DialogTitle>
                                        </VisuallyHidden>
                                        <Image
                                            src={word.image_link}
                                            alt={`Image for ${word.vocab}`}
                                            width={800}
                                            height={600}
                                            className="w-full h-auto rounded-md"
                                            priority={false}
                                        />
                                    </DialogContent>
                                </Dialog>

                                {/* Examples */}
                                {word.examples?.slice(0, 2).map((ex, index) => (
                                    <div key={index} className="bg-muted/50 rounded-lg p-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                            <div>
                                                <p className="text-lg mb-2 font-medium">{ex.example_text}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {getLocalizedContent(ex.meaning_vi, ex.meaning_en)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => playAudioExample(ex.example_text, `example-${word.id}-${index}`)}
                                                aria-label="Play example pronunciation"
                                                className="hover:bg-accent rounded-full"
                                            >
                                                {currentPlayingId === `example-${word.id}-${index}` ? (
                                                    <Volume2 className="h-5 w-5 text-blue-500" />
                                                ) : (
                                                    <Volume className="h-5 w-5" />
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