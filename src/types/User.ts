import { ReviewResult } from "./Review"
export interface User{
    id: string
    email: string
    refreshToken: string
    firstName: string
    lastName: string
    role: 'user' | 'admin' // hoặc string nếu không rõ toàn bộ role
    isEmailVerified: boolean
    avatar?: string
    createdAt: string // ISO date string
    updatedAt: string
  }



export interface BasicUser {
  id: string;
  firstName: string;
  lastName: string;
}
export type LearningStatus = 'new' | 'learning' | 'mastered' | 'forgotten' | 'graduated';
export interface VocabItem {
  id: string;
  vocab: string;
  furigana: string;
  mean_vi: string;
  mean_en: string;
  image_link: string;
  sound_link: string;
  word_type: string;
  learningStatus: LearningStatus; 
}

export interface VocabSection {
  vocabList: VocabItem[];
  total: number;
}



export interface ReviewHistoryItem {
  id: string;
  userId: string;
  vocabId: string;
  reviewDate: string; 
  result: ReviewResult;
  notes: string | null;
}

export interface UserProgress {
  userId: string;
  totalWordsLearned: number;
  totalReviews: number;
  lastReview: string;
}
interface ProgressData {
  userId: string;
  totalWordsLearned: number;
  totalReviews: number;
  lastReview: string;
}


export interface UserDetailsResponse {
  user: {
      id: string;
      firstName: string;
      lastName: string;
  };
  vocab: {
      vocabList: VocabItem[];
      total: number;
  };
  reviewHistory: ReviewHistoryItem[];
  progress: ProgressData;
}
