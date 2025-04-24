import {api} from '@/lib/axios'
import { UserDetailsResponse } from '@/types/User';
import { ApiResponse } from '@/types/api';


export async function getUserDetails(): Promise<UserDetailsResponse> {
    try {
      const res = await api.get<ApiResponse<UserDetailsResponse>>('/users/me/details');
      return res.data.data;
    } catch (error: any) {
      console.error('[USER SERVICE] Get details failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user details');
    }
  }