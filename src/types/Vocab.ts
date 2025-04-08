export interface Example {
  id: string;
  example_text: string;
  furigana: string;
  meaning_vi: string;
  meaning_en: string;
}

export interface Kanji {
  id: string;
  kanji: string;
  han_viet: string;
  radicals: string;
  strokes: number;
  meaning_vi: string;
  meaning_en: string;
  on_reading: string[];
  kun_reading: string[];
  level: string;
}

export interface Vocabulary {
  id: string;
  vocab: string;
  furigana: string;
  mean_vi: string;
  mean_en: string;
  image_link:string;
  sound_link:string;
  kanjis: Kanji[];
  word_type:string;
  examples: Example[];
}
