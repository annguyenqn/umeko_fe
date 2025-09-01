'use client';

import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import type { ReviewSessionStats } from '@/types/review-session';

interface SummaryCardProps {
  stats: ReviewSessionStats;
  onContinue: () => void;
}

const SummaryCard: FC<SummaryCardProps> = ({ stats, onContinue }) => {
  const { total, remembered, somewhatRemembered, forgotten } = stats;
  const completedWords = remembered + somewhatRemembered + forgotten;

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto p-4"
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Kết quả ôn tập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Số từ đã ôn tập:</span>
                  <span className="font-medium">
                    {completedWords}/{total}
                  </span>
                </div>

                {/* Progress groups */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Nhớ rõ:</span>
                      <span className="font-medium">{remembered} từ</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(remembered / Math.max(1, total)) * 100}%` }}
                        transition={{ delay: 0.2, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Nhớ lõm bõm:</span>
                      <span className="font-medium">{somewhatRemembered} từ</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(somewhatRemembered / Math.max(1, total)) * 100}%` }}
                        transition={{ delay: 0.4, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Chưa nhớ:</span>
                      <span className="font-medium">{forgotten} từ</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(forgotten / Math.max(1, total)) * 100}%` }}
                        transition={{ delay: 0.6, duration: 1 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-1">Gợi ý:</h3>
                  <p className="text-sm text-blue-700">
                    {forgotten > remembered
                      ? 'Bạn cần ôn tập thêm những từ vựng này. Hãy thử học với số lượng ít hơn mỗi lần.'
                      : 'Bạn đang tiến bộ tốt! Tiếp tục duy trì việc ôn tập hàng ngày để ghi nhớ lâu hơn.'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={onContinue}>
                Tiếp tục ôn tập
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SummaryCard;
