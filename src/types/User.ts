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
  learningStatus?: LearningStatus; 
}

export interface VocabSection {
  vocabList: VocabItem[];
  total: number;
}

export type ReviewResult = 'again' | 'good' | 'easy'; 

export interface ReviewHistoryItem {
  id: string;
  userId: string;
  vocabId: string;
  reviewDate: string; // ISO string, parse khi dùng nếu cần
  result: ReviewResult;
  notes: string | null;
}

export interface UserProgress {
  userId: string;
  totalWordsLearned: number;
  totalReviews: number;
  lastReview: string;
}

export interface UserDetailsResponse {
  user: BasicUser;
  vocab: VocabSection;
  reviewHistory: ReviewHistoryItem[];
  progress: UserProgress;
}
