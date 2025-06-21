'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../components/ui/Dialog";
import { Volume, Volume2, Image as ImageIcon, Book, Plus, CheckCircle2 } from "lucide-react";
import { Vocabulary } from "@/types/Vocab";
import { useState, useCallback } from "react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LearningStatus } from "@/types/User";
import { useInitReviewBatch } from "@/hooks/useInitReviewBatch";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { useVocabStore } from "@/store/useVocabStore";

const learningStatusViMap: Record<LearningStatus, string> = {
    new: 'Người mới',
    learning: 'Đang học',
    mastered: 'Đã thành thạo',
    forgotten: 'Quên òi',
    graduated: 'Trùm từ này'
};

type Props = {
    vocabList: Vocabulary[];
    t: (key: string) => string;
    language: "vi" | "en";
    learnedVocabMap: Map<string, string>;
};


export const VocabLessonContent: React.FC<Props> = ({ vocabList, t, language, learnedVocabMap }) => {
    const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
    const { addedVocabIds, setAddedVocabIds } = useVocabStore();
    const { addToReviewQueue } = useInitReviewBatch();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const getLocalizedContent = (vi: string, en: string) => language === "vi" ? vi : en;

    const handleAddVocab = (vocabId: string) => {
        const updatedVocabIds = new Set(addedVocabIds);
        updatedVocabIds.add(vocabId);
        setAddedVocabIds(updatedVocabIds);
        addToReviewQueue(vocabId);
    };

    const isIOS = () => {
        if (typeof window === 'undefined') return false;
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    };



    const playTTSMobileSafe = useCallback((text: string, id: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.onend = () => setCurrentPlayingId(null);

        // Nếu đang phát chính nó → cancel để stop
        if (currentPlayingId === id && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setCurrentPlayingId(null);
            return;
        }

        // Nếu đang phát cái khác → cancel cái cũ
        if (currentPlayingId && currentPlayingId !== id) {
            window.speechSynthesis.cancel();
        }

        setCurrentPlayingId(id);

        if (isIOS()) {
            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 150);
        } else {
            window.speechSynthesis.speak(utterance);
        }
    }, [currentPlayingId]);


    // const playTTS = useCallback((text: string, id: string) => {
    //     window.speechSynthesis.cancel();
    //     if (currentPlayingId === id) {
    //         setCurrentPlayingId(null);
    //         return;
    //     }

    //     const utterance = new SpeechSynthesisUtterance(text);
    //     utterance.lang = 'ja-JP';
    //     utterance.onend = () => setCurrentPlayingId(null);
    //     setCurrentPlayingId(id);
    //     window.speechSynthesis.speak(utterance);
    // }, [currentPlayingId]);

    const playAudio = useCallback((soundLink: string | undefined, vocabText: string, id: string) => {
        if (currentPlayingId === id) {
            setCurrentPlayingId(null);
            return;
        }

        if (!soundLink) {
            playTTSMobileSafe(vocabText, id);
            return;
        }

        const dynamicAudio = new Audio(soundLink);
        dynamicAudio.play().then(() => {
            setCurrentPlayingId(id);
            dynamicAudio.onended = () => setCurrentPlayingId(null);
        }).catch((err) => {
            console.error("Audio playback error:", err);
            playTTSMobileSafe(vocabText, id);
        });
    }, [currentPlayingId, playTTSMobileSafe]);


    const getStatusColor = (status: LearningStatus) => {
        switch (status) {
            case 'new': return 'bg-gray-200 text-gray-700';
            case 'learning': return 'bg-blue-100 text-blue-800';
            case 'mastered': return 'bg-green-100 text-green-800';
            case 'forgotten': return 'bg-yellow-100 text-yellow-800';
            case 'graduated': return 'bg-purple-100 text-purple-800';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{t("vocab.listVocab")}</h1>

                <div className="space-y-6">
                    {vocabList.map((word) => {
                        const status = learnedVocabMap.get(word.id) as LearningStatus | undefined;
                        const isAdded = addedVocabIds.has(word.id);

                        return (
                            <Card key={word.id} className="p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold text-primary">{word.vocab}</h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => playAudio(word.sound_link, word.vocab, `vocab-${word.id}`)}
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

                                    {/* Trạng thái hoặc nút thêm */}
                                    {status ? (
                                        <span className={`text-xs px-3 py-1 rounded-full w-fit ${getStatusColor(status)}`}>
                                            {learningStatusViMap[status]}
                                        </span>
                                    ) : isAuthenticated ? (
                                        isAdded ? (
                                            <motion.div
                                                key={`added-${word.id}`}
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                className="flex items-center gap-2 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-xl w-fit shadow-sm"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: [1.3, 1] }}
                                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                                >
                                                    <CheckCircle2 className="w-4 h-6 text-green-500" />
                                                </motion.div>
                                                <span>Đã thêm</span>
                                            </motion.div>

                                        ) : (
                                            <Button
                                                onClick={() => handleAddVocab(word.id)}
                                                className="w-[140px] bg-black h-[40px] my-3 flex items-center justify-center gap-2 rounded-xl cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-400 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 text-white text-sm font-medium"
                                            >
                                                <Book className="w-4 h-4" />
                                                Học từ này
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        )
                                    ) : null}


                                    {/* Image Dialog */}
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
                                                    onClick={() => playTTSMobileSafe(ex.example_text, `example-${word.id}-${index}`)}
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
                        );
                    })}
                </div>
            </div>
        </div>
    );
};