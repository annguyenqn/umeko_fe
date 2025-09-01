'use client';

import type { FC } from 'react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingState: FC<LoadingStateProps> = ({ message = 'Đang tải...', fullScreen = true }) => {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : ''} w-full`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
