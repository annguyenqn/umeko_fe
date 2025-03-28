

export interface KanjiData {
    id: number;
    kanji: string;        // Ký tự Kanji
    kun_reading: string[]; // Âm Kun (mảng vì có nhiều cách đọc)
    on_reading: string[];  // Âm On (mảng vì có nhiều cách đọc)
    han_viet: string;     // Âm Hán Việt
    meaning_vi: string;   // Nghĩa tiếng Việt
    meaning_en: string;   // Nghĩa tiếng Anh
    radicals: string;     // Bộ thủ
    strokes: number;      // Số nét
    level: string;        // Cấp độ JLPT (N5, N4, N3, v.v.)
    examples?: Example[]; // Danh sách Example liên quan đến Kanji
  }

export interface Vocab {
  id: number;
  vocab: string;
  furigana: string;
  meaning_vi?: string | undefined;
  meaning_en?: string | undefined;
  level?: string;
  word_type?: string;
  kanjis: KanjiData[];
  examples?: Example[];
}
export interface Example {
    example_text: string;     // Câu ví dụ
    example_furigana: string;      // Cách đọc câu
    meaning_vi: string;   // Nghĩa tiếng Việt
    meaning_en: string;   // Nghĩa tiếng Anh
  }