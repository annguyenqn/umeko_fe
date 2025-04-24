// types/api.ts
export type ApiResponse<T> = {
    status: string;
    message: string;
    data: T;
    error?: any;
  };
  