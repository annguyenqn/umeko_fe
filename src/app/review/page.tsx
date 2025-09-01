// src/app/review/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import FlipCard from '@/components/ui/FlipCard';

import { useReviewSession } from '@/hooks/useReviewSession';
import LoadingState from '@/components/review/LoadingState';
import StatsCard from '@/components/review/StatsCard';
import SelectionCard from '@/components/review/SelectionCard';
import SummaryCard from '@/components/review/SummaryCard';
import ProgressBar from '@/components/review/ProgressBar';
import ReviewControls from '@/components/review/ReviewControls';

const ReviewPage: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isLoading,
    currentItem,
    totalCards,
    currentVocab,
    flipped,
    setFlipped,
    isTransitioning,
    totalDueWords,
    selectedWordCount,
    setSelectedWordCount,
    sessionStats,
    startReviewSession,
    handleReview,
    endSession,
    startNewSession,
  } = useReviewSession({ defaultSelectedCount: 10 });

  const [axis, setAxis] = useState<'x' | 'y'>('x');
  useEffect(() => {
    const resizeHandler = (): void => setAxis(window.innerWidth >= 768 ? 'x' : 'y');
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // i18n đơn giản như bản gốc
  const language: 'vi' | 'en' = 'vi';
  const getLocalized = (vi: string, en: string): string => (language === 'vi' ? vi : en);

  // --- Render branches ---
  if (isLoading && currentView === 'stats') {
    return <LoadingState message="Đang tải thông tin từ vựng..." />;
  }

  if (currentView === 'stats') {
    return <StatsCard totalDueWords={totalDueWords} onStartSelection={() => setCurrentView('selection')} />;
  }

  if (currentView === 'selection') {
    return (
      <SelectionCard
        totalDueWords={totalDueWords}
        selectedWordCount={selectedWordCount}
        onChangeSelectedCount={setSelectedWordCount}
        onBack={() => setCurrentView('stats')}
        onStart={() => void startReviewSession()}
        isLoading={isLoading}
      />
    );
  }

  if (currentView === 'summary') {
    return <SummaryCard stats={sessionStats} onContinue={startNewSession} />;
  }

  // REVIEW VIEW
  if (!currentVocab || totalCards === 0) {
    return <LoadingState message="Đang tải từ vựng..." />;
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
          <Button variant="outline" size="sm" onClick={() => void endSession()}>
            Kết thúc
          </Button>
        </div>

      <ProgressBar current={currentItem} total={totalCards} />

        <FlipCard
          frontContent={
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-3xl md:text-5xl text-foreground font-bold">{currentVocab.vocab}</h2>
              {!flipped && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-muted-foreground text-sm mt-4">
                  (Nhấn để lật)
                </motion.p>
              )}
            </div>
          }
          backContent={
            <div className="text-foreground text-lg md:text-2xl">
              <p className="mb-2">
                <strong>Furigana: </strong>
                {currentVocab.furigana}
              </p>
              <p>
                <strong>Nghĩa: </strong>
                {getLocalized(currentVocab.mean_vi, currentVocab.mean_en)}
              </p>
              {currentVocab.kanjis.length > 0 && (
                <div
                  className={`mt-4 border-t pt-2 grid ${
                    currentVocab.kanjis.length >= 3 ? 'grid-cols-2 gap-2' : 'grid-cols-1'
                  }`}
                >
                  {currentVocab.kanjis.map((kanji, index) => (
                    <div key={index} className="p-2">
                      <strong>Kanji: </strong>
                      <span className="text-2xl md:text-3xl">{kanji.kanji}</span>
                      <br />
                      {language === 'vi' && (
                        <>
                          <strong>Âm Hán: </strong>
                          {kanji.han_viet}
                          <br />
                        </>
                      )}
                      <strong>Nghĩa: </strong>
                      {getLocalized(kanji.meaning_vi, kanji.meaning_en)}
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

        <ReviewControls
          disabled={isTransitioning}
          onAgain={() => void handleReview('again')}
          onGood={() => void handleReview('good')}
          onEasy={() => void handleReview('easy')}
        />
      </div>
    </div>
  );
};

export default ReviewPage;
