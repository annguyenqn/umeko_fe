import type { Kanji } from '@/types/Vocab';

export interface ReviewItem {
  vocabId: string;
  vocab: string;
  furigana: string;
  mean_vi: string;
  mean_en: string;
  kanjis: Kanji[];
}

export interface ReviewSessionStats {
  total: number;
  remembered: number;
  somewhatRemembered: number;
  forgotten: number;
}

export type ReviewView = 'stats' | 'selection' | 'review' | 'summary';