import { create } from 'zustand';
type VocabStore = {
    addedVocabIds: Set<string>;
    setAddedVocabIds: (newSet: Set<string>) => void;
    setAddedVocabIdsFromStorage: () => void;
  };


// Tạo store với kiểu VocabStore
export const useVocabStore = create<VocabStore>((set) => ({
  addedVocabIds: new Set<string>(), // Khởi tạo với Set rỗng
  setAddedVocabIds: (newSet: Set<string>) => set({ addedVocabIds: newSet }),
  setAddedVocabIdsFromStorage: () => {
    const storedVocabIds = sessionStorage.getItem("addedVocabIds");
    if (storedVocabIds) {
      set({ addedVocabIds: new Set(JSON.parse(storedVocabIds)) });
    }
  },
}));
