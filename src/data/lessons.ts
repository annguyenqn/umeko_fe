import { LessonDetail } from "@/types/lesson";

export const N5_LESSONS: LessonDetail[] = [
  {
    id: 'lesson-1',
    book: "Minna no Nihongo",
    lesson_number: "1",
    level: "N5",
    description_vi: "Giới thiệu bản thân và những câu chào hỏi cơ bản.",
    description_en: "Self-introduction and basic greetings.",
    vocab: [
      {
        id: "1",
        vocab: "こんにちは",
        furigana: "こんにちは",
        mean_vi: "Xin chào",
        mean_en: "Hello",
        example: [
          {
            example_text: "こんにちは、元気ですか？",
            meaning_vi: "Xin chào, bạn khỏe không?",
            meaning_en: "Hello, how are you?"
          }
        ]
      },
      {
        id: "2",
        vocab: "ありがとう",
        furigana: "ありがとう",
        mean_vi: "Cảm ơn",
        mean_en: "Thank you",
        example: [
          {
            example_text: "手伝ってくれてありがとう。",
            meaning_vi: "Cảm ơn vì đã giúp đỡ.",
            meaning_en: "Thank you for helping me."
          }
        ]
      },
      {
        id: "3",
        vocab: "はじめまして",
        furigana: "はじめまして",
        mean_vi: "Rất vui được gặp bạn (lần đầu)",
        mean_en: "Nice to meet you",
        example: [
          {
            example_text: "はじめまして、田中です。",
            meaning_vi: "Rất vui được gặp bạn, tôi là Tanaka.",
            meaning_en: "Nice to meet you, I'm Tanaka."
          }
        ]
      },
      {
        id: "4",
        vocab: "さようなら",
        furigana: "さようなら",
        mean_vi: "Tạm biệt",
        mean_en: "Goodbye",
        example: [
          {
            example_text: "学校が終わって、さようなら。",
            meaning_vi: "Tan học rồi, tạm biệt nhé.",
            meaning_en: "School is over, goodbye."
          }
        ]
      },
      {
        id: "5",
        vocab: "おはようございます",
        furigana: "おはようございます",
        mean_vi: "Chào buổi sáng",
        mean_en: "Good morning",
        example: [
          {
            example_text: "毎朝先生におはようございますと言います。",
            meaning_vi: "Mỗi sáng tôi chào thầy giáo.",
            meaning_en: "Every morning I say good morning to the teacher."
          }
        ]
      }
    ]
  },
  {
    id: 'lesson-2',
    book: "Minna no Nihongo",
    lesson_number: "2",
    level: "N5",
    description_vi: "Từ vựng về đồ vật và vị trí trong phòng học.",
    description_en: "Vocabulary about classroom objects and their locations.",
    vocab: [
      {
        id: "1",
        vocab: "つくえ",
        furigana: "つくえ",
        mean_vi: "Cái bàn",
        mean_en: "Desk",
        example: [
          {
            example_text: "つくえの上に本があります。",
            meaning_vi: "Có một quyển sách trên bàn.",
            meaning_en: "There is a book on the desk."
          }
        ]
      },
      {
        id: "2",
        vocab: "いす",
        furigana: "いす",
        mean_vi: "Cái ghế",
        mean_en: "Chair",
        example: [
          {
            example_text: "いすにすわってください。",
            meaning_vi: "Hãy ngồi vào ghế.",
            meaning_en: "Please sit on the chair."
          }
        ]
      },
      {
        id: "3",
        vocab: "ほん",
        furigana: "ほん",
        mean_vi: "Quyển sách",
        mean_en: "Book",
        example: [
          {
            example_text: "このほんはとてもおもしろいです。",
            meaning_vi: "Cuốn sách này rất thú vị.",
            meaning_en: "This book is very interesting."
          }
        ]
      },
      {
        id: "4",
        vocab: "ペン",
        furigana: "ペン",
        mean_vi: "Cây bút",
        mean_en: "Pen",
        example: [
          {
            example_text: "あたらしいペンをかいました。",
            meaning_vi: "Tôi đã mua một cây bút mới.",
            meaning_en: "I bought a new pen."
          }
        ]
      },
      {
        id: "5",
        vocab: "かばん",
        furigana: "かばん",
        mean_vi: "Cặp sách",
        mean_en: "Bag",
        example: [
          {
            example_text: "かばんの中にノートがあります。",
            meaning_vi: "Trong cặp có một quyển vở.",
            meaning_en: "There is a notebook in the bag."
          }
        ]
      }
    ]
  }
];

export const N4_LESSONS: LessonDetail[] = [
  {
    id: 'lesson-1',
    book: "Minna no Nihongo II",
    lesson_number: "1",
    level: "N4",
    description_vi: "Từ vựng về hoạt động hàng ngày và thói quen.",
    description_en: "Vocabulary about daily activities and routines.",
    vocab: [
      {
        id: "1",
        vocab: "起きる",
        furigana: "おきる",
        mean_vi: "Thức dậy",
        mean_en: "Wake up",
        example: [
          {
            example_text: "毎朝6時に起きます。",
            meaning_vi: "Tôi thức dậy lúc 6 giờ mỗi sáng.",
            meaning_en: "I wake up at 6 a.m. every morning."
          }
        ]
      },
      {
        id: "2",
        vocab: "寝る",
        furigana: "ねる",
        mean_vi: "Đi ngủ",
        mean_en: "Go to sleep",
        example: [
          {
            example_text: "11時に寝ます。",
            meaning_vi: "Tôi đi ngủ lúc 11 giờ.",
            meaning_en: "I go to bed at 11 p.m."
          }
        ]
      },
      {
        id: "3",
        vocab: "働く",
        furigana: "はたらく",
        mean_vi: "Làm việc",
        mean_en: "Work",
        example: [
          {
            example_text: "会社で働いています。",
            meaning_vi: "Tôi đang làm việc tại công ty.",
            meaning_en: "I work at a company."
          }
        ]
      },
      {
        id: "4",
        vocab: "休む",
        furigana: "やすむ",
        mean_vi: "Nghỉ ngơi",
        mean_en: "Rest",
        example: [
          {
            example_text: "今日は休みます。",
            meaning_vi: "Hôm nay tôi nghỉ.",
            meaning_en: "I'm taking a rest today."
          }
        ]
      },
      {
        id: "5",
        vocab: "勉強する",
        furigana: "べんきょうする",
        mean_vi: "Học tập",
        mean_en: "Study",
        example: [
          {
            example_text: "毎晩日本語を勉強します。",
            meaning_vi: "Tôi học tiếng Nhật mỗi tối.",
            meaning_en: "I study Japanese every night."
          }
        ]
      }
    ]
  }
];
