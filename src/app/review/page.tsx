'use client';
import { useEffect, useState } from 'react';
import { getDueReviews, submitManyReviews as apiSubmitReviews } from '@/services/review.service';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, ChevronRight, Trophy } from 'lucide-react';
import { ReviewResult } from '@/types/Review';
import { motion, AnimatePresence } from 'framer-motion';
import FlipCard from '@/components/ui/FlipCard';
import { Slider } from '@/components/ui/slider';
import { Kanji } from '@/types/Vocab';

interface ReviewItem {
    vocabId: string;
    vocab: string;
    furigana: string;
    mean_vi: string;
    mean_en: string;
    kanjis: Kanji[];
}
interface ReviewSessionStats {
    total: number;
    remembered: number;
    somewhatRemembered: number;
    forgotten: number;
}

const ReviewPage: React.FC = () => {
    // App states
    const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
    const [currentItem, setCurrentItem] = useState(0);
    const [reviewQueue, setReviewQueue] = useState<{ vocabId: string; result: ReviewResult }[]>([]);
    const [flipped, setFlipped] = useState(false);
    const [axis, setAxis] = useState<'x' | 'y'>('x');
    const [isLoading, setIsLoading] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [pendingTransition, setPendingTransition] = useState(false);

    // New states for improved flow
    const [currentView, setCurrentView] = useState<'stats' | 'selection' | 'review' | 'summary'>('stats');
    const [totalDueWords, setTotalDueWords] = useState(0);
    const [selectedWordCount, setSelectedWordCount] = useState(10); // Default selection
    const [sessionStats, setSessionStats] = useState<ReviewSessionStats>({
        total: 0,
        remembered: 0,
        somewhatRemembered: 0,
        forgotten: 0
    });

    const t = (key: string) => ({ 'flashCard.mix': 'Mix', 'flashCard.mean': 'Mean' }[key] || key);
    const language: 'vi' | 'en' = 'vi';
    const getLocalized = (vi: string, en: string) => (language === 'vi' ? vi : en);

    // Fetch total due reviews count
    // Thêm kiểm tra trong fetchDueWordsCount
    const fetchDueWordsCount = async () => {
        setIsLoading(true);
        try {
            const { dueVocab } = await getDueReviews();
            console.log('[DEBUG] Fetched due words count:', dueVocab.length);
            setTotalDueWords(dueVocab.length);

            // Hiển thị thông tin chi tiết về từ vựng cần ôn tập nếu chỉ có 1 từ
            if (dueVocab.length === 1) {
                console.log('[DEBUG] Only one word needs review:', dueVocab[0]);
            }

            // Auto-adjust slider max value based on available words
            if (dueVocab.length < selectedWordCount) {
                setSelectedWordCount(Math.max(1, dueVocab.length));
            }
        } catch (err) {
            console.error('[FlashCardPage] Fetch due words count error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Start a new review session with selected number of words
    const startReviewSession = async () => {
        setIsLoading(true);
        try {
            const { dueVocab } = await getDueReviews();
            console.log('[FlashCard] Due vocab fetched:', dueVocab.length);

            // Take only the selected number of words
            const wordsToReview = dueVocab.slice(0, selectedWordCount);
            console.log('[FlashCard] Words to review:', wordsToReview.length);
            console.log('word to review', wordsToReview);


            // Nếu không có từ nào để ôn tập, hiển thị thông báo và quay về màn hình stats
            if (wordsToReview.length === 0) {
                console.log('[FlashCard] No words to review');
                setIsLoading(false);
                setCurrentView('stats');
                return;
            }

            const mapped = wordsToReview.map((vocab) => ({
                vocabId: vocab.id,
                vocab: vocab.vocab,
                furigana: vocab.furigana,
                mean_vi: vocab.mean_vi,
                mean_en: vocab.mean_en,
                kanjis: vocab.kanjis
            }));

            // Initialize session
            setReviewItems(mapped);
            setCurrentItem(0);
            setFlipped(false);
            setReviewQueue([]);

            // Reset session stats
            setSessionStats({
                total: mapped.length,
                remembered: 0,
                somewhatRemembered: 0,
                forgotten: 0
            });

            // Switch to review mode
            setCurrentView('review');
        } catch (err) {
            console.error('[FlashCardPage] Start review session error:', err);
            // Hiển thị thông báo lỗi
            alert('Có lỗi xảy ra khi tải từ vựng. Vui lòng thử lại sau.');
            setCurrentView('stats');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDueWordsCount();

        const resizeHandler = () => setAxis(window.innerWidth >= 768 ? 'x' : 'y');
        resizeHandler();
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    // Submit all reviews in queue
    // Kiểm tra lại implementation của submitManyReviews trong review.service.ts
    const submitReviews = async (reviews: { vocabId: string; result: ReviewResult }[]) => {
        console.log('[COMPONENT] Calling submitReviews with:', reviews);

        // Đảm bảo có ít nhất một review để gửi
        if (!reviews || reviews.length === 0) {
            console.warn('[COMPONENT] No reviews to submit');
            return { success: false, message: 'No reviews to submit' };
        }

        try {
            // Gọi API từ service
            console.log('[COMPONENT] Calling API submitManyReviews');
            const result = await apiSubmitReviews(reviews);
            console.log('[COMPONENT] API response:', result);
            return result;
        } catch (error) {
            console.error('[COMPONENT] Error in submitReviews:', error);
            throw error;
        }
    };


    // Handle card transition with animation
    const moveToNextCard = (index: number) => {
        if (isTransitioning || pendingTransition) return;

        setPendingTransition(true);
        setIsTransitioning(true);
        setFlipped(false);

        // Delay actual change to allow animations to complete
        setTimeout(() => {
            setCurrentItem(index);
            setIsTransitioning(false);
            setPendingTransition(false);
        }, 300);
    };


    // Process user's answer for current card
    const handleReview = (result: ReviewResult) => {
        if (isTransitioning) return;

        const current = reviewItems[currentItem];
        if (!current) return;

        // Thêm logging để debug
        console.log(`[DEBUG] Processing review for word: ${current.vocab} with result: ${result}`);

        // Add to review queue
        const newQueue = [...reviewQueue, { vocabId: current.vocabId, result }];
        setReviewQueue(newQueue);

        // Thêm logging review queue
        console.log(`[DEBUG] Updated review queue:`, newQueue);

        // Update stats based on result
        setSessionStats(prev => {
            if (result === 'easy') {
                return { ...prev, remembered: prev.remembered + 1 };
            } else if (result === 'good') {
                return { ...prev, somewhatRemembered: prev.somewhatRemembered + 1 };
            } else {
                return { ...prev, forgotten: prev.forgotten + 1 };
            }
        });

        // Xử lý ngay lập tức nếu chỉ có 1 từ
        if (reviewItems.length === 1) {
            console.log(`[DEBUG] Only one word in the review list, submitting immediately`);
            // Gọi API ngay lập tức và chuyển đến màn hình summary
            submitReviews([...newQueue])
                .then(() => {
                    console.log(`[DEBUG] Review submitted successfully for single word`);
                    setCurrentView('summary');
                })
                .catch(err => {
                    console.error(`[ERROR] Failed to submit review for single word:`, err);
                    // Vẫn chuyển sang summary để tránh mắc kẹt
                    setCurrentView('summary');
                });
            return;
        }

        // Xử lý cho trường hợp từ cuối cùng trong danh sách
        if (currentItem >= reviewItems.length - 1) {
            console.log(`[DEBUG] Last word in the review list, submitting all reviews`);
            // Gọi API và chuyển đến màn hình summary
            submitReviews([...newQueue])
                .then(() => {
                    console.log(`[DEBUG] All reviews submitted successfully`);
                    setCurrentView('summary');
                })
                .catch(err => {
                    console.error(`[ERROR] Failed to submit all reviews:`, err);
                    // Vẫn chuyển sang summary để tránh mắc kẹt
                    setCurrentView('summary');
                });
        } else {
            // Nếu còn từ tiếp theo, chuyển sang từ tiếp theo
            moveToNextCard(currentItem + 1);
        }
    };

    // Sửa lại hàm endSession để gọi API trực tiếp thay vì qua submitAllReviews
    const endSession = async () => {
        console.log(`[DEBUG] Ending session with ${reviewQueue.length} reviews in queue`);

        if (reviewQueue.length > 0) {
            try {
                console.log(`[DEBUG] Submitting reviews from endSession:`, reviewQueue);
                await submitReviews([...reviewQueue]);
                console.log(`[DEBUG] Reviews submitted successfully from endSession`);
            } catch (err) {
                console.error(`[ERROR] Failed to submit reviews from endSession:`, err);
            }
        }

        // Luôn chuyển sang màn hình summary, ngay cả khi có lỗi
        setCurrentView('summary');
    };

    // Start a new session from the beginning
    const startNewSession = () => {
        setCurrentView('stats');
        fetchDueWordsCount();
    };


    // Render loading state
    if (isLoading && currentView === 'stats') {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Đang tải thông tin từ vựng...</p>
                </div>
            </div>
        );
    }

    // Render initial statistics view
    if (currentView === 'stats') {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md mx-auto p-4"
                    >
                        <Card className="shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-2xl text-center">Ôn tập từ vựng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center space-y-6">
                                    <div className="flex flex-col items-center">
                                        <span className="text-5xl font-bold text-primary">{totalDueWords}</span>
                                        <span className="text-muted-foreground mt-2">Từ vựng cần ôn tập</span>
                                    </div>

                                    {totalDueWords > 0 ? (
                                        <button
                                            // size="lg"
                                            className="relative w-full h-10 font-medium overflow-hidden rounded-md bg-blue-500/30 backdrop-blur-lg border border-white/20 text-white  hover:shadow-xl hover:shadow-blue-600/50"
                                            onClick={() => setCurrentView('selection')}
                                        >
                                            <span className="relative z-10 flex items-center justify-center">
                                                Bắt đầu ôn tập
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </span>
                                            {/* <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(100%)]">
                                                <div className="relative h-full w-10 bg-white/30"></div>
                                            </div> */}
                                        </button>

                                    ) : (
                                        <div className="text-center p-4">
                                            <p className="text-muted-foreground">
                                                Không có từ vựng nào cần ôn tập vào lúc này.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // Render word count selection view
    if (currentView === 'selection') {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md mx-auto p-4"
                    >
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-center">Chọn số lượng từ</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium">Số từ:</span>
                                        <motion.span
                                            key={selectedWordCount}
                                            initial={{ scale: 1.2 }}
                                            animate={{ scale: 1 }}
                                            className="text-2xl font-bold text-primary"
                                        >
                                            {selectedWordCount}
                                        </motion.span>
                                    </div>

                                    <Slider
                                        value={[selectedWordCount]}
                                        min={1}
                                        max={Math.min(50, totalDueWords)}
                                        step={1}
                                        onValueChange={(value) => setSelectedWordCount(value[0])}
                                        className="py-4"
                                    />

                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>1</span>
                                        <span>{Math.min(50, totalDueWords)}</span>
                                    </div>

                                    <div className="flex justify-between space-x-4 pt-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setCurrentView('stats')}
                                        >
                                            Quay lại
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            onClick={startReviewSession}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center">
                                                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                                                    Đang tải
                                                </span>
                                            ) : (
                                                <>Bắt đầu ôn tập</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // Render summary view
    if (currentView === 'summary') {
        const { total, remembered, somewhatRemembered, forgotten } = sessionStats;
        const completedWords = remembered + somewhatRemembered + forgotten;

        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md mx-auto p-4"
                    >
                        <Card className="shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex justify-center mb-4">
                                    <div className="rounded-full bg-green-100 p-3">
                                        <Trophy className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl text-center">Kết quả ôn tập</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Số từ đã ôn tập:</span>
                                        <span className="font-medium">{completedWords}/{total}</span>
                                    </div>

                                    {/* Progress bars */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Nhớ rõ:</span>
                                                <span className="font-medium">{remembered} từ</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-green-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(remembered / total) * 100}%` }}
                                                    transition={{ delay: 0.2, duration: 1 }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Nhớ lõm bõm:</span>
                                                <span className="font-medium">{somewhatRemembered} từ</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-yellow-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(somewhatRemembered / total) * 100}%` }}
                                                    transition={{ delay: 0.4, duration: 1 }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Chưa nhớ:</span>
                                                <span className="font-medium">{forgotten} từ</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-red-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(forgotten / total) * 100}%` }}
                                                    transition={{ delay: 0.6, duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendation */}
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h3 className="font-medium text-blue-800 mb-1">Gợi ý:</h3>
                                        <p className="text-sm text-blue-700">
                                            {forgotten > remembered
                                                ? "Bạn cần ôn tập thêm những từ vựng này. Hãy thử học với số lượng ít hơn mỗi lần."
                                                : "Bạn đang tiến bộ tốt! Tiếp tục duy trì việc ôn tập hàng ngày để ghi nhớ lâu hơn."}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={startNewSession}
                                >
                                    Tiếp tục ôn tập
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    // Main review interface (flashcards)
    const vocabList = reviewItems[currentItem];
    const totalCards = reviewItems.length;
    if (!vocabList) {
        return (
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Đang tải từ vựng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <div className="flex flex-col gap-4 justify-center items-center p-4 md:p-8 w-full max-w-xl">
                {/* Header with progress indicator */}
                <div className="w-full flex items-center justify-between">
                    <div className="text-sm font-medium">
                        <span className="text-primary text-lg">{currentItem + 1}</span>
                        <span className="mx-1 text-muted-foreground">/</span>
                        <span className="text-muted-foreground">{totalCards}</span>
                        <span className="ml-2 text-muted-foreground">từ cần ôn tập</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={endSession}
                    >
                        Kết thúc
                    </Button>
                </div>

                {/* Progress bar - fixed to show actual progress */}
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-6">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: `${((currentItem) / totalCards) * 100}%` }}
                        animate={{ width: `${((currentItem + 1) / totalCards) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <FlipCard
                    frontContent={
                        <div className="flex flex-col items-center justify-center h-full">
                            <h2 className="text-3xl md:text-5xl text-foreground font-bold">{vocabList.vocab}</h2>
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
                            <p className="mb-2"><strong>Furigana: </strong>{vocabList.furigana}</p>
                            <p><strong>Nghĩa: </strong>{getLocalized(vocabList.mean_vi, vocabList.mean_en)}</p>
                            {vocabList.kanjis.length > 0 && (
                                <div className={`mt-4 border-t pt-2 grid ${vocabList.kanjis.length >= 3 ? 'grid-cols-2 gap-2' : 'grid-cols-1'}`}>
                                    {vocabList.kanjis.map((kanji, index) => (
                                        <div key={index} className="p-2">
                                            <strong>Kanji: </strong><span className="text-2xl md:text-3xl">{kanji.kanji}</span><br />
                                            {language === "vi" && (
                                                <>
                                                    <strong>Âm Hán: </strong>{kanji.han_viet}<br />
                                                </>
                                            )}
                                            <strong>Nghĩa: </strong>{getLocalized(kanji.meaning_vi, kanji.meaning_en)}
                                        </div>
                                    ))}
                                </div>
                            )}

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

export default ReviewPage;