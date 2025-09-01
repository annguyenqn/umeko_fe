'use client';

import type { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ReviewControlsProps {
  disabled?: boolean;
  onAgain: () => void;
  onGood: () => void;
  onEasy: () => void;
}

const ReviewControls: FC<ReviewControlsProps> = ({ disabled = false, onAgain, onGood, onEasy }) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button variant="destructive" className="flex-1 gap-2 text-white hover:bg-red-700" onClick={onAgain} disabled={disabled}>
            <XCircle className="w-5 h-5" /> Quên
          </Button>
          <Button variant="secondary" className="flex-1 gap-2 hover:bg-gray-200" onClick={onGood} disabled={disabled}>
            <AlertCircle className="w-5 h-5 text-yellow-500" /> Không nhớ lắm
          </Button>
          <Button variant="default" className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white" onClick={onEasy} disabled={disabled}>
            <CheckCircle className="w-5 h-5" /> Nhớ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewControls;
