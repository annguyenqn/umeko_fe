export interface Lesson {
  id: string;
  title: string;
  description: string;
  totalWords: number;
  progress?: number;
  level: 'N5' | 'N4';
  category: string;
}

export interface LessonSectionProps {
  level: 'N5' | 'N4';
  lessons: LessonDetail[];
}

interface Example {
  example_text: string;
  meaning_vi: string;
  meaning_en: string;
}

export interface VocabWord {
  id: string;
  vocab: string;
  furigana: string;
  mean_vi: string;
  mean_en: string;
  example: Example[];
}

export interface LessonDetail {
  id: string;
  book: string;
  lesson_number: string;
  level: 'N5' | 'N4';
  description_vi: string;
  description_en: string;
  vocab: VocabWord[];
} 