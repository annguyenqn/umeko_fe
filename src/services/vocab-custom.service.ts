import { api } from '@/lib/axios';

export interface CreateCustomVocabSetDto {
  name: string;
  description: string;
}

export interface CreateCustomVocabEntryDto {
  vocabSetId: string;
  word: string;
  meaning: string;
  example: string;
  difficulty_level: number;
}

export interface CustomVocabSetResponse {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  entries?: CustomVocabEntryResponse[];
}

export interface CustomVocabEntryResponse {
  id: string;
  user_id: string;
  word: string;
  meaning: string;
  example: string;
  difficulty_level: number;
  created_at: string;
  vocabSet: { id: string };
}

export async function getCustomVocabSets(): Promise<CustomVocabSetResponse[]> {
  const res = await api.get<CustomVocabSetResponse[]>('/custom-vocab/sets');
  return res.data;
}

export async function createCustomVocabSet(payload: CreateCustomVocabSetDto): Promise<CustomVocabSetResponse> {
  const res = await api.post<CustomVocabSetResponse>('/custom-vocab/sets', payload);
  return res.data;
}

export async function getVocabEntriesBySet(setId: string): Promise<CustomVocabEntryResponse[]> {
  const res = await api.get<CustomVocabEntryResponse[]>(`/custom-vocab/entries/${setId}`);
  return res.data;
}

export async function createCustomVocabEntry(payload: CreateCustomVocabEntryDto): Promise<CustomVocabEntryResponse> {
  const res = await api.post<CustomVocabEntryResponse>('/custom-vocab/entries', payload);
  return res.data;
}

export async function deleteCustomVocabSet(setId: string): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/custom-vocab/sets/${setId}`);
  return res.data;
}

export async function deleteCustomVocabEntry(entryId: string): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/custom-vocab/entries/${entryId}`);
  return res.data;
}
