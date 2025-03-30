export interface Category {
    id: string
    name: string
    description_vi: string
    description_en: string
  }
  export interface Lesson {
    id: string;
    lesson_number: number;
    level: 'N5' | 'N4' | 'N3';
    description_vi: string;
    description_en: string;
    category: Category;
}