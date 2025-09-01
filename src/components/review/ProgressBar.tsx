'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number; // 0-based index
  total: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ current, total }) => {
  const percentCurrent = total > 0 ? ((current) / total) * 100 : 0;
  const percentNext = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full h-1 bg-muted rounded-full overflow-hidden mb-6">
      <motion.div
        className="h-full bg-primary"
        initial={{ width: `${percentCurrent}%` }}
        animate={{ width: `${percentNext}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default ProgressBar;
