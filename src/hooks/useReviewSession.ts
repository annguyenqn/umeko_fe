'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDueReviews, submitManyReviews as apiSubmitReviews } from '@/services/review.service';
import type { ReviewResult } from '@/types/Review';
import { shuffleArray } from '@/utils/array';
import type { ReviewItem, ReviewSessionStats, ReviewView } from '@/types/review-session';

interface UseReviewSessionOptions {
  defaultSelectedCount?: number;
}

interface SubmitResult {
  success: boolean;
  message?: string;
}

export function useReviewSession(options?: UseReviewSessionOptions) {
  const { defaultSelectedCount = 10 } = options ?? {};

  // View / UI state
  const [currentView, setCurrentView] = useState<ReviewView>('stats');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Session states
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [currentItem, setCurrentItem] = useState<number>(0);
  const [reviewQueue, setReviewQueue] = useState<Array<{ vocabId: string; result: ReviewResult }>>([]);

  // Animations / transitions
  const [flipped, setFlipped] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [pendingTransition, setPendingTransition] = useState<boolean>(false);

  // Stats & selection
  const [totalDueWords, setTotalDueWords] = useState<number>(0);
  const [selectedWordCount, setSelectedWordCount] = useState<number>(defaultSelectedCount);

  const [sessionStats, setSessionStats] = useState<ReviewSessionStats>({
    total: 0,
    remembered: 0,
    somewhatRemembered: 0,
    forgotten: 0,
  });

  // Derived state
  const totalCards = reviewItems.length;
  const currentVocab = reviewItems[currentItem];

  // --- Core actions ---
  const fetchDueWordsCount = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { dueVocab } = await getDueReviews();
      setTotalDueWords(dueVocab.length);

      // ensure slider upper bound
      if (dueVocab.length < selectedWordCount) {
        setSelectedWordCount(Math.max(1, dueVocab.length));
      }
    } catch (err) {
      // Không throw để tránh kẹt UI
      // Có thể gắn toast/notification tuỳ dự án
      // eslint-disable-next-line no-console
      console.error('[FlashCardPage] Fetch due words count error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedWordCount]);

  const submitReviews = useCallback(async (reviews: Array<{ vocabId: string; result: ReviewResult }>): Promise<SubmitResult> => {
    if (!reviews || reviews.length === 0) {
      return { success: false, message: 'No reviews to submit' };
    }
    try {
      const result = await apiSubmitReviews(reviews);
      return result as SubmitResult;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[COMPONENT] Error in submitReviews:', error);
      return { success: false, message: 'Submit failed' };
    }
  }, []);

  const startReviewSession = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { dueVocab } = await getDueReviews();
      const shuffled = shuffleArray(dueVocab);
      const wordsToReview = shuffled.slice(0, selectedWordCount);

      if (wordsToReview.length === 0) {
        setCurrentView('stats');
        return;
      }

      const mapped: ReviewItem[] = wordsToReview.map((vocab) => ({
        vocabId: vocab.id,
        vocab: vocab.vocab,
        furigana: vocab.furigana,
        mean_vi: vocab.mean_vi,
        mean_en: vocab.mean_en,
        kanjis: vocab.kanjis,
      }));

      setReviewItems(mapped);
      setCurrentItem(0);
      setFlipped(false);
      setReviewQueue([]);
      setSessionStats({
        total: mapped.length,
        remembered: 0,
        somewhatRemembered: 0,
        forgotten: 0,
      });
      setCurrentView('review');
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Có lỗi xảy ra khi tải từ vựng. Vui lòng thử lại sau.');
      setCurrentView('stats');
    } finally {
      setIsLoading(false);
    }
  }, [selectedWordCount]);

  const moveToNextCard = useCallback((nextIndex: number) => {
    if (isTransitioning || pendingTransition) return;

    setPendingTransition(true);
    setIsTransitioning(true);
    setFlipped(false);

    window.setTimeout(() => {
      setCurrentItem(nextIndex);
      setIsTransitioning(false);
      setPendingTransition(false);
    }, 300);
  }, [isTransitioning, pendingTransition]);

  const handleReview = useCallback(async (result: ReviewResult): Promise<void> => {
    if (isTransitioning || !currentVocab) return;

    const newQueue = [...reviewQueue, { vocabId: currentVocab.vocabId, result }];
    setReviewQueue(newQueue);

    setSessionStats((prev) => {
      if (result === 'easy') return { ...prev, remembered: prev.remembered + 1 };
      if (result === 'good') return { ...prev, somewhatRemembered: prev.somewhatRemembered + 1 };
      return { ...prev, forgotten: prev.forgotten + 1 };
    });

    // single item
    if (totalCards === 1) {
      await submitReviews(newQueue);
      setCurrentView('summary');
      return;
    }

    // last item
    if (currentItem >= totalCards - 1) {
      await submitReviews(newQueue);
      setCurrentView('summary');
      return;
    }

    // next
    moveToNextCard(currentItem + 1);
  }, [currentVocab, reviewQueue, isTransitioning, currentItem, totalCards, submitReviews, moveToNextCard]);

  const endSession = useCallback(async (): Promise<void> => {
    if (reviewQueue.length > 0) {
      await submitReviews([...reviewQueue]);
    }
    setCurrentView('summary');
  }, [reviewQueue, submitReviews]);

  const startNewSession = useCallback((): void => {
    setCurrentView('stats');
    // refresh count
    void fetchDueWordsCount();
  }, [fetchDueWordsCount]);

  // Initial load
  useEffect(() => {
    void fetchDueWordsCount();
  }, [fetchDueWordsCount]);

  const api = useMemo(() => ({
    // state
    currentView,
    isLoading,
    reviewItems,
    currentItem,
    totalCards,
    currentVocab,
    flipped,
    isTransitioning,
    totalDueWords,
    selectedWordCount,
    sessionStats,

    // setters
    setCurrentView,
    setFlipped,
    setSelectedWordCount,

    // actions
    startReviewSession,
    handleReview,
    endSession,
    startNewSession,
  }), [
    currentView,
    isLoading,
    reviewItems,
    currentItem,
    totalCards,
    currentVocab,
    flipped,
    isTransitioning,
    totalDueWords,
    selectedWordCount,
    sessionStats,
    startReviewSession,
    handleReview,
    endSession,
    startNewSession,
  ]);

  return api;
}
