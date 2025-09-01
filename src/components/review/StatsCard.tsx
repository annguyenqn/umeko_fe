'use client';

import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface StatsCardProps {
  totalDueWords: number;
  onStartSelection: () => void;
}

const StatsCard: FC<StatsCardProps> = ({ totalDueWords, onStartSelection }) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto p-4"
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center">Ôn tập từ vựng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-primary">{totalDueWords}</span>
                  <span className="text-muted-foreground mt-2">Từ vựng cần ôn tập</span>
                </div>

                {totalDueWords > 0 ? (
                  <button
                    className="relative w-full h-10 font-medium overflow-hidden rounded-md text-white dark:text-white bg-blue-600/90
                    dark:bg-blue-500/30 border border-blue-300 dark:border-white/20 backdrop-blur-md
                    hover:shadow-lg hover:bg-blue-700 dark:hover:shadow-blue-600/50 transition-all duration-300"
                    onClick={onStartSelection}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Bắt đầu ôn tập
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </span>
                  </button>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">Không có từ vựng nào cần ôn tập vào lúc này.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StatsCard;
