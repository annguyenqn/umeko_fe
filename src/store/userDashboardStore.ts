// 📁 stores/useUserStore.ts

import { create } from 'zustand';
import { getUserDetails } from '@/services/user.service';
import { UserDetailsResponse } from '@/types/User';

interface UserState {
  data: UserDetailsResponse | null;
  loading: boolean;
  error: string | null;
  fetchUserDetails: () => Promise<void>;
  clearUserDetails: () => void;
}

export const useUserDashboardStore = create<UserState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchUserDetails: async () => {
    set({ loading: true, error: null });
    try {
      const result = await getUserDetails();
      set({ data: result, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearUserDetails: () => {
    set({ data: null, error: null, loading: false });
  },
}));
