import { vocabApi } from '@/lib/axios'
import { Category, Lesson } from '@/types/Category'
import { Vocabulary } from '@/types/Vocab'
export async function getCategoriesService(): Promise<Category[]> {
  try {
    const response = await vocabApi.get<Category[]>('/categories')
    return response.data
  } catch (error) {
    console.error('[getCategoriesService] Error:', error)
    throw error
  }
}

export async function getLessonsByCategory(categoryId: string): Promise<Lesson[]> {
  try {
    const response = await vocabApi.get<Lesson[]>(`/category/${categoryId}/lessons`);
    return response.data;
  } catch (error) {
    console.error('[getLessonsByCategory] Error:', error);
    throw error;
  }
}
export async function getLessonVocabulary(
  lessonId: string,
  categoryId?: string // Tham số tùy chọn
): Promise<Vocabulary[]> {
  try {
    // Tạo URL cơ bản
    const url = `/lesson/${lessonId}`;

    // Tạo object params để truyền query parameter
    const params = categoryId ? { categoryId } : undefined;

    console.log("Calling API:", url, "with params:", params);

    // Gọi API với params
    const response = await vocabApi.get<Vocabulary[]>(url, { params });

    console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("[getLessonVocabulary] Error:", error);
    throw error;
  }
}
