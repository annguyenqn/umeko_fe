'use client';

import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface SelectionCardProps {
  totalDueWords: number;
  selectedWordCount: number;
  onChangeSelectedCount: (value: number) => void;
  onBack: () => void;
  onStart: () => void;
  isLoading?: boolean;
}

const SelectionCard: FC<SelectionCardProps> = ({
  totalDueWords,
  selectedWordCount,
  onChangeSelectedCount,
  onBack,
  onStart,
  isLoading = false,
}) => {
  const maxSelectable = Math.min(50, totalDueWords);

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
            <CardHeader>
              <CardTitle className="text-2xl text-center">Chọn số lượng từ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Số từ:</span>
                  <motion.span key={selectedWordCount} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-2xl font-bold text-primary">
                    {selectedWordCount}
                  </motion.span>
                </div>

                <Slider
                  value={[selectedWordCount]}
                  min={1}
                  max={maxSelectable}
                  step={1}
                  onValueChange={(value) => onChangeSelectedCount(value[0])}
                  className="py-4"
                />

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1</span>
                  <span>{maxSelectable}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between space-x-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={onBack}>
                Quay lại
              </Button>
              <Button className="flex-1" onClick={onStart} disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                    Đang tải
                  </span>
                ) : (
                  <>Bắt đầu ôn tập</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SelectionCard;
