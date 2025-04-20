

'use client';

import { useRef } from 'react';
import { initReviews } from '@/services/review.service';

let vocabQueue: string[] = [];

export function useInitReviewBatch(delay = 5000) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const addToQueue = (vocabId: string) => {
    vocabQueue.push(vocabId);

    // Nếu chưa có timer thì bắt đầu đếm ngược
    if (!timer.current) {
      timer.current = setTimeout(async () => {
        const uniqueIds = Array.from(new Set(vocabQueue));
        vocabQueue = [];
        timer.current = null;

        if (uniqueIds.length > 0) {
          try {
            await initReviews(uniqueIds);
            console.log('✅ Batched review sent:', uniqueIds);
          } catch (error) {
            console.error('❌ Error sending batch:', error);
          }
        }
      }, delay);
    }
  };

  return { addToReviewQueue: addToQueue };
}
