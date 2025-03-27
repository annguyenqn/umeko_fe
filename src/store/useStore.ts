// 📁 stores/useStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language, defaultLanguage } from '@/config/i18n'

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: Language
  studyReminders: boolean
  dailyGoal: number
}

interface StudyProgress {
  totalKanjiLearned: number
  totalVocabLearned: number
  streakDays: number
  lastStudyDate: string | null
}

interface StoreState {
  // User Preferences
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
  setLanguage: (language: Language) => void
  setTheme: (theme: UserPreferences['theme']) => void

  // Study Progress
  progress: StudyProgress
  updateProgress: (progress: Partial<StudyProgress>) => void
  incrementKanjiLearned: () => void
  incrementVocabLearned: () => void
  updateStreak: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Preferences
      preferences: {
        theme: 'system',
        language: defaultLanguage,
        studyReminders: true,
        dailyGoal: 20,
      },
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      setLanguage: (language) =>
        set((state) => ({
          preferences: { ...state.preferences, language },
        })),
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),

      // Study Progress
      progress: {
        totalKanjiLearned: 0,
        totalVocabLearned: 0,
        streakDays: 0,
        lastStudyDate: null,
      },
      updateProgress: (newProgress) =>
        set((state) => ({
          progress: { ...state.progress, ...newProgress },
        })),
      incrementKanjiLearned: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            totalKanjiLearned: state.progress.totalKanjiLearned + 1,
          },
        })),
      incrementVocabLearned: () =>
        set((state) => ({
          progress: {
            ...state.progress,
            totalVocabLearned: state.progress.totalVocabLearned + 1,
          },
        })),
      updateStreak: () =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const lastStudyDate = state.progress.lastStudyDate
          
          if (!lastStudyDate || lastStudyDate !== today) {
            return {
              progress: {
                ...state.progress,
                streakDays: state.progress.streakDays + 1,
                lastStudyDate: today,
              },
            }
          }
          return state
        }),
    }),
    {
      name: 'umeko-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        progress: state.progress,
      }),
    }
  )
)
