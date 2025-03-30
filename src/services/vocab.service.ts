import { vocabApi } from '@/lib/axios'
import { Category, Lesson } from '@/types/Category'
import { Vocabulary } from '@/types/Vocab'
  export async function getCategoriesService(): Promise<Category[]> {
    try {
      const response = await vocabApi.get<Category[]>('/vocabularies/categories')
      return response.data
    } catch (error) {
      console.error('[getCategoriesService] Error:', error)
      throw error
    }
  }

  export async function getLessonsByCategory(categoryId: string): Promise<Lesson[]> {
    try {
        const response = await vocabApi.get<Lesson[]>(`/vocabularies/category/${categoryId}/lessons`);
        return response.data;
    } catch (error) {
        console.error('[getLessonsByCategory] Error:', error);
        throw error;
    }
}
export async function getLessonVocabulary(lessonId: string): Promise<Vocabulary[]> {
  try {
    console.log("Calling API:", `/vocabularies/lesson/${lessonId}`);
    
    const response = await vocabApi.get<Vocabulary[]>(`/vocabularies/lesson/${lessonId}`);
    console.log("API Response:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("[getLessonVocabulary] Error:", error);
    throw error;
  }
}
