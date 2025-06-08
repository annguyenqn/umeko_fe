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

// 1. Lấy danh sách các vocab set
export async function getCustomVocabSets(): Promise<CustomVocabSetResponse[]> {
  const res = await api.get<CustomVocabSetResponse[]>('/custom-vocab/sets');
  return res.data;
}

// 2. Tạo vocab set mới
export async function createCustomVocabSet(payload: CreateCustomVocabSetDto): Promise<CustomVocabSetResponse> {
  const res = await api.post<CustomVocabSetResponse>('/custom-vocab/sets', payload);
  return res.data;
}

// 3. Lấy danh sách vocab entry theo setId
export async function getVocabEntriesBySet(setId: string): Promise<CustomVocabEntryResponse[]> {
  const res = await api.get<CustomVocabEntryResponse[]>(`/custom-vocab/entries/${setId}`);
  return res.data;
}

// 4. Tạo vocab entry trong set
export async function createCustomVocabEntry(payload: CreateCustomVocabEntryDto): Promise<CustomVocabEntryResponse> {
  const res = await api.post<CustomVocabEntryResponse>('/custom-vocab/entries', payload);
  return res.data;
}

// ✅ 5. Xoá một vocab set theo ID
export async function deleteCustomVocabSet(setId: string): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/custom-vocab/sets/${setId}`);
  return res.data;
}

// ✅ 6. Xoá một vocab entry theo ID
export async function deleteCustomVocabEntry(entryId: string): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(`/custom-vocab/entries/${entryId}`);
  return res.data;
}
