import { create } from 'zustand';
type VocabStore = {
    addedVocabIds: Set<string>;
    setAddedVocabIds: (newSet: Set<string>) => void;
    setAddedVocabIdsFromStorage: () => void;
  };



export const useVocabStore = create<VocabStore>((set) => ({
  addedVocabIds: new Set<string>(),
  setAddedVocabIds: (newSet: Set<string>) => set({ addedVocabIds: newSet }),
  setAddedVocabIdsFromStorage: () => {
    const storedVocabIds = sessionStorage.getItem("addedVocabIds");
    if (storedVocabIds) {
      set({ addedVocabIds: new Set(JSON.parse(storedVocabIds)) });
    }
  },
}));
