'use client'
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useCallback } from "react";

const Pagination = ({
    totalItems,
    currentIndex,
    onChange,
}: {
    totalItems: number;
    currentIndex: number;
    onChange: (index: number) => void;
}) => {
    const handleNextItem = useCallback(() => {
        if (currentIndex < totalItems - 1) {
            onChange(currentIndex + 1);
        }
    }, [currentIndex, totalItems, onChange]);

    const handlePreviousItem = useCallback(() => {
        if (currentIndex > 0) {
            onChange(currentIndex - 1);
        }
    }, [currentIndex, onChange]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowRight") {
                handleNextItem();
            } else if (event.key === "ArrowLeft") {
                handlePreviousItem();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleNextItem, handlePreviousItem]);

    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={handlePreviousItem}
                disabled={currentIndex === 0}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
            >
                <ArrowLeft />
            </button>
            <span className="text-lg">
                {currentIndex + 1} / {totalItems}
            </span>
            <button
                onClick={handleNextItem}
                disabled={currentIndex === totalItems - 1}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-200 disabled:opacity-50"
            >
                <ArrowRight />
            </button>
        </div>
    );
};

export default Pagination;
