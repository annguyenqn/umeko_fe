'use client';
import { useEffect, useState, useRef } from 'react';
import { getDueReviews, submitManyReviews } from '@/services/review.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { ReviewResult } from '@/types/Review';
import { motion } from 'framer-motion';
import FlipCard from '@/components/ui/FlipCard';

interface ReviewItem {
    vocabId: string;
    vocab: string;
    furigana: string;
    mean_vi: string;
    mean_en: string;
}

const FlashCardPage: React.FC = () => {
    const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
    const [currentItem, setCurrentItem] = useState(0);
    const [reviewQueue, setReviewQueue] = useState<{ vocabId: string; result: ReviewResult }[]>([]);
    const [flipped, setFlipped] = useState(false);
    const [axis, setAxis] = useState<'x' | 'y'>('x');
    const [hasFinished, setHasFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const batchSubmitIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pendingTransitionRef = useRef<boolean>(false);

    const t = (key: string) => ({ 'flashCard.mix': 'Mix', 'flashCard.mean': 'Mean' }[key] || key);
    const language: 'vi' | 'en' = 'vi';
    const getLocalized = (vi: string, en: string) => (language === 'vi' ? vi : en);

    const fetchReviews = async () => {
        setIsLoading(true);
        try {
            const { dueVocab } = await getDueReviews();
            const mapped = dueVocab.map((vocab) => ({
                vocabId: vocab.id,
                vocab: vocab.vocab,
                furigana: vocab.furigana,
                mean_vi: vocab.mean_vi,
                mean_en: vocab.mean_en,
            }));

            // Only update if we actually got new items
            if (mapped.length > 0) {
                setReviewItems(mapped);
                setCurrentItem(0);
                setFlipped(false);
                setHasFinished(false);
            } else if (reviewItems.length === 0) {
                // If we never had any items
                setReviewItems([]);
                setHasFinished(true);
            }
        } catch (err) {
            console.error('[FlashCardPage] Fetch review error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();

        const resizeHandler = () => setAxis(window.innerWidth >= 768 ? 'x' : 'y');
        resizeHandler();
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // Handle submitting all remaining reviews
    const submitAllReviews = async () => {
        if (reviewQueue.length > 0) {
            try {
                await submitManyReviews([...reviewQueue]);
                console.log('[FlashCard] Submitted all remaining reviews:', reviewQueue);
                setReviewQueue([]);
                // setHasFinished(true); - Không cần thiết nữa vì đã đặt trước khi gọi API
            } catch (err) {
                console.error('[FlashCard] Submit all error:', err);
                // Vẫn đánh dấu là hoàn thành, nhưng giữ lại queue để thử lại sau
                // setHasFinished(true); - Không cần thiết nữa
            }
        }
    };

    // Prevent conflicting transitions
    const moveToNextCard = (index: number) => {
        if (isTransitioning || pendingTransitionRef.current) return;

        pendingTransitionRef.current = true;
        setIsTransitioning(true);
        setFlipped(false);

        // Delay actual change to allow animations to complete
        setTimeout(() => {
            setCurrentItem(index);
            setIsTransitioning(false);
            pendingTransitionRef.current = false;
        }, 300);
    };

    const handleReview = (result: ReviewResult) => {
        if (isTransitioning) return;

        const current = reviewItems[currentItem];
        if (!current) return;

        const newQueue = [...reviewQueue, { vocabId: current.vocabId, result }];
        setReviewQueue(newQueue);

        if (currentItem < reviewItems.length - 1) {
            moveToNextCard(currentItem + 1);
        } else {
            // Thêm dòng này trước để cập nhật UI ngay lập tức
            setHasFinished(true);

            // Last card completed - submit all reviews and finish
            submitAllReviews();
        }
    };

    // const handleShuffle = () => {
    //     if (isTransitioning || reviewItems.length <= 1) return;

    //     const shuffled = [...reviewItems]
    //         .map((item) => ({ ...item, rand: Math.random() }))
    //         .sort((a, b) => a.rand - b.rand)
    //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //         .map(({ rand, ...rest }) => rest);

    //     setIsTransitioning(true);
    //     setFlipped(false);

    //     setTimeout(() => {
    //         setReviewItems(shuffled);
    //         setCurrentItem(0);
    //         setIsTransitioning(false);
    //     }, 300);
    // };

    // Submit batch every 5 seconds
    useEffect(() => {
        // Clear existing interval to prevent duplicates
        if (batchSubmitIntervalRef.current) {
            clearInterval(batchSubmitIntervalRef.current);
            batchSubmitIntervalRef.current = null;
        }

        batchSubmitIntervalRef.current = setInterval(async () => {
            if (reviewQueue.length > 0 && !hasFinished) {
                const batch = [...reviewQueue];
                setReviewQueue([]); // Clear queue first to prevent duplicate submissions

                try {
                    await submitManyReviews(batch);
                    console.log('[FlashCard] Submitted batch:', batch);
                } catch (err) {
                    console.error('[FlashCard] Submit error:', err);
                    // Put failed reviews back in queue
                    setReviewQueue(prev => [...prev, ...batch]);
                }
            }
        }, 5000);

        return () => {
            if (batchSubmitIntervalRef.current) {
                clearInterval(batchSubmitIntervalRef.current);
                batchSubmitIntervalRef.current = null;
            }
        };
    }, [reviewQueue, hasFinished]);

    // Only fetch reviews again when all current items are processed
    useEffect(() => {
        if (reviewItems.length > 0 && currentItem >= reviewItems.length && !hasFinished) {
            // All items reviewed, fetch more if available
            fetchReviews();
        }
    }, [currentItem, reviewItems.length, hasFinished]);

    const current = reviewItems[currentItem];
    const totalCards = reviewItems.length;

    // Loading state
    if (isLoading && reviewItems.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Đang tải từ vựng...</p>
                </div>
            </div>
        );
    }

    // 🎉 Success message after all cards are completed
    if (!current && hasFinished) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-green-600 mb-4">🎉 Bạn đã ôn tập xong!</h1>
                    <p className="text-lg md:text-2xl text-muted-foreground">
                        Không còn từ vựng cần ôn nữa. Hãy quay lại sau để tiếp tục luyện tập nhé!
                    </p>
                </motion.div>
            </div>
        );
    }

    // 💤 If no words need review
    if (!current) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto"
                >
                    <div className="text-5xl mb-6">💤</div>
                    <h2 className="text-2xl font-semibold mb-2">Không có từ nào cần ôn tập</h2>
                    <p className="text-muted-foreground">Hãy quay lại sau khi có từ vựng mới cần ôn tập</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="flex flex-col  gap-4 justify-center items-center p-4 md:p-8 w-1/2 ">
                {/* Progress indicator */}
                <div className="w-full mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium">
                        <span className="text-primary text-lg">{currentItem + 1}</span>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <span className="text-muted-foreground">{totalCards}</span>
                        <span className="ml-2 text-muted-foreground">từ cần ôn tập</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-6">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentItem) / totalCards) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <FlipCard
                    frontContent={
                        <div className="flex flex-col items-center justify-center h-full">
                            <h2 className="text-3xl md:text-5xl text-foreground font-bold">{current.vocab}</h2>
                            {!flipped && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-muted-foreground text-sm mt-4"
                                >
                                    (Nhấn để lật)
                                </motion.p>
                            )}
                        </div>
                    }
                    backContent={
                        <div className="text-foreground text-lg md:text-2xl">
                            <p className="mb-2"><strong>Furigana: </strong>{current.furigana}</p>
                            <p><strong>{t('flashCard.mean')}: </strong>{getLocalized(current.mean_vi, current.mean_en)}</p>
                        </div>
                    }
                    axis={axis}
                    flipped={flipped}
                    setFlipped={setFlipped}
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="w-full"
                >
                    <Card className="shadow-md">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <Button
                                    variant="destructive"
                                    className="flex-1 gap-2"
                                    onClick={() => handleReview('again')}
                                    disabled={isTransitioning}
                                >
                                    <XCircle className="w-5 h-5" /> Quên
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="flex-1 gap-2"
                                    onClick={() => handleReview('good')}
                                    disabled={isTransitioning}
                                >
                                    <AlertCircle className="w-5 h-5 text-yellow-500" /> Không nhớ lắm
                                </Button>
                                <Button
                                    variant="default"
                                    className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleReview('easy')}
                                    disabled={isTransitioning}
                                >
                                    <CheckCircle className="w-5 h-5" /> Nhớ
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default FlashCardPage;