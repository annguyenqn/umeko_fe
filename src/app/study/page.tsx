'use client';
import { useEffect, useState, useRef } from 'react';
import { getDueReviews, submitManyReviews } from '@/services/review.service';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import FlipCard from '@/components/ui/FlipCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { ReviewResult } from '@/types/Review';

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
    const [slide, setSlide] = useState(false);
    const [flipped, setFlipped] = useState(false);
    const [axis, setAxis] = useState<'x' | 'y'>('x');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const t = (key: string) => ({ 'flashCard.mix': 'Mix', 'flashCard.mean': 'Mean' }[key] || key);
    const language: 'vi' | 'en' = 'vi';
    const getLocalized = (vi: string, en: string) => (language === 'vi' ? vi : en);

    const fetchReviews = async () => {
        try {
            const { dueVocab } = await getDueReviews();
            const mapped = dueVocab.map((vocab) => ({
                vocabId: vocab.id,
                vocab: vocab.vocab,
                furigana: vocab.furigana,
                mean_vi: vocab.mean_vi,
                mean_en: vocab.mean_en,
            }));
            setReviewItems(mapped);
            setCurrentItem(0);
            setFlipped(false);
        } catch (err) {
            console.error('[FlashCardPage] Fetch review error:', err);
        }
    };

    useEffect(() => {
        fetchReviews();

        const resizeHandler = () => setAxis(window.innerWidth >= 768 ? 'x' : 'y');
        resizeHandler();
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    const handlePaginationChange = (index: number) => {
        setSlide(true);
        setFlipped(false);
        setTimeout(() => {
            setCurrentItem(index);
            setSlide(false);
        }, 300);
    };

    const handleReview = (result: ReviewResult) => {
        const current = reviewItems[currentItem];
        if (!current) return;

        setReviewQueue((prev) => [...prev, { vocabId: current.vocabId, result }]);

        if (currentItem < reviewItems.length - 1) {
            handlePaginationChange(currentItem + 1);
        } else {
            setIsDialogOpen(true);
        }
    };

    const handleShuffle = () => {
        const shuffled = [...reviewItems]
            .map((item) => ({ ...item, rand: Math.random() }))
            .sort((a, b) => a.rand - b.rand)
            .map(({ rand, ...rest }) => rest);
        setReviewItems(shuffled);
        setCurrentItem(0);
        setFlipped(false);
    };

    // Submit batch mỗi 5 giây
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(async () => {
            if (reviewQueue.length > 0) {
                const batch = [...reviewQueue];
                setReviewQueue([]);
                try {
                    await submitManyReviews(batch);
                    console.log('[FlashCard] Submitted batch:', batch);
                    await fetchReviews();
                } catch (err) {
                    console.error('[FlashCard] Submit error:', err);
                }
            }
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [reviewQueue]);

    const current = reviewItems[currentItem];

    // 🎉 Thông báo sau khi người dùng nhấn OK
    if (!current && hasFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold text-green-600 mb-4">🎉 Bạn đã ôn tập xong!</h1>
                <p className="text-lg md:text-2xl text-muted-foreground">
                    Không còn từ vựng cần ôn nữa. Hãy quay lại sau để tiếp tục luyện tập nhé!
                </p>
            </div>
        );
    }

    // 💤 Nếu từ đầu đã không có từ nào cần ôn
    if (!current) {
        return <div className="text-center py-12 text-xl text-muted-foreground">Không có từ nào cần ôn tập.</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-3 justify-center items-center h-screen relative">
                <div className="flex mb-4 rounded-lg overflow-hidden border border-border bg-background">
                    <button
                        onClick={handleShuffle}
                        className="px-6 py-2 font-bold text-[15px] tracking-wider bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#3b4454] dark:text-white dark:hover:bg-[#4b566a]"
                    >
                        {t('flashCard.mix')}
                    </button>
                </div>

                <div className={`transition-transform duration-500 ease-out ${slide ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'}`}>
                    <FlipCard
                        frontContent={<h2 className="text-3xl md:text-5xl text-foreground">{current.vocab}</h2>}
                        backContent={
                            <div className="text-foreground text-lg md:text-2xl">
                                <p><strong>Furigana: </strong>{current.furigana}</p>
                                <p><strong>{t('flashCard.mean')}: </strong>{getLocalized(current.mean_vi, current.mean_en)}</p>
                            </div>
                        }
                        axis={axis}
                        flipped={flipped}
                        setFlipped={setFlipped}
                    />
                </div>

                <Card className="w-full max-w-md">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-2">
                        <Button variant="destructive" className="flex-1 gap-2" onClick={() => handleReview('again')}>
                            <XCircle className="w-5 h-5" /> Quên
                        </Button>
                        <Button variant="secondary" className="flex-1 gap-2" onClick={() => handleReview('good')}>
                            <AlertCircle className="w-5 h-5 text-yellow-500" /> Không nhớ lắm
                        </Button>
                        <Button variant="default" className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleReview('easy')}>
                            <CheckCircle className="w-5 h-5" /> Nhớ
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogTitle>🎉 Hoàn thành ôn tập!</DialogTitle>
                    <DialogDescription>Bạn đã ôn tập hết tất cả từ vựng. Hãy tiếp tục luyện tập để ghi nhớ lâu hơn nhé!</DialogDescription>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            if (reviewItems.length === 0) {
                                setHasFinished(true);
                            }
                        }}
                    >
                        OK
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FlashCardPage;
