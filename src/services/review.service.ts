// src/services/review.service.ts
import { api } from '@/lib/axios';
import { GetDueReviewsResponse, SubmitReviewDto } from '@/types/Review';
import { ApiResponse } from '@/types/api';

export async function initReviews(vocabIds: string[]): Promise<void> {
  try {
    const res = await api.post('/users/me/reviews/inits', { vocabIds });
    console.log('[REVIEW SERVICE] Init reviews success:', res.data);
  } catch (error: any) {
    console.error('[REVIEW SERVICE] Init reviews failed:', error);
    throw new Error(error.response?.data?.message || 'Failed to initialize reviews');
  }
}

export async function submitManyReviews(reviews: SubmitReviewDto[]): Promise<void> {
  try {
    await api.post('/users/me/reviews/submit-many', reviews);
    console.log('[REVIEW SERVICE] Submitted review results successfully');
  } catch (error: any) {
    console.error('[REVIEW SERVICE] Submit reviews failed:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit review results');
  }
}


export async function getDueReviews(): Promise<GetDueReviewsResponse> {
  try {
    const res = await api.get<{
      status: string;
      message: string;
      data: GetDueReviewsResponse;
      error: any;
    }>('/users/me/reviews/due');

    return res.data.data;
  } catch (error: any) {
    console.error('[REVIEW SERVICE] Get due reviews failed:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch due reviews');
  }
}