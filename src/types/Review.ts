// ✅ Type cho từng từ cần review

export type ReviewResult = 'again' | 'good' | 'easy'; 

export interface SubmitReviewDto {
  vocabId: string;
  result: ReviewResult;
}
interface Kanji {
  id: string;
  kanji: string;
  han_viet: string;
  radicals: string;
  strokes: number;
  meaning_vi: string;
  meaning_en: string;
  on_reading: string[];
  kun_reading: string[];
  level: string;
}
export interface DueVocab {
    id: string;
    vocab: string;
    furigana: string;
    mean_vi: string;
    mean_en: string;
    image_link: string;
    sound_link: string;
    word_type: string;
    kanjis: Kanji[];
  }
  
  // ✅ Type cho metadata review
  export interface ReviewMeta {
    _id: string;
    userId: string;
    vocabId: string;
    repetitionCount: number;
    efFactor: number;
    interval: number;
    lastReview: string; // ISO string
    nextReview: string; // ISO string
    lastResult: string;
    __v: number;
  }

  // ✅ Response tổng hợp
  export interface GetDueReviewsResponse {
    dueVocab: DueVocab[];
    reviewMeta: ReviewMeta[];
  }
  