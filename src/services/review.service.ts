// src/services/review.service.ts
import { api } from '@/lib/axios';

export async function initReviews(vocabIds: string[]): Promise<void> {
  try {
    const res = await api.post('/users/me/reviews/inits', { vocabIds });
    console.log('[REVIEW SERVICE] Init reviews success:', res.data);
  } catch (error: any) {
    console.error('[REVIEW SERVICE] Init reviews failed:', error);
    throw new Error(error.response?.data?.message || 'Failed to initialize reviews');
  }
}
