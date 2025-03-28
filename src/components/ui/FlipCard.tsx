'use client';
import React, { useEffect, useCallback } from "react";

const FlipCard = ({ frontContent, backContent, axis = "x", flipped, setFlipped }) => {
    const handleFlip = useCallback(() => {
        setFlipped(prev => !prev);
    }, [setFlipped]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                handleFlip();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleFlip]);

    return (
        <div className="group relative h-[450px] md:w-[900px] w-80 [perspective:1000px]" onClick={handleFlip}>
            <div
                className={`absolute w-full h-full duration-1000 [transform-style:preserve-3d] 
                    ${flipped ? (axis === "y" ? "[transform:rotateY(180deg)]" : "[transform:rotateX(180deg)]") : ""}`}
            >
                {/* Front Side */}
                <div className="absolute w-full h-full rounded-xl 
                    bg-gradient-to-br from-white to-slate-100 dark:from-[#303956] dark:to-[#0a0b0e]
                    p-6 text-black dark:text-white 
                    [backface-visibility:hidden] flex items-center justify-center text-center border border-gray-300 dark:border-gray-600">
                    <span className="text-2xl md:text-4xl font-bold drop-shadow-md shadow-black">
                        {frontContent}
                    </span>
                </div>

                {/* Back Side */}
                <div
                    className="absolute w-full h-full rounded-xl 
                    bg-gradient-to-br from-slate-100 to-white dark:from-[#0a0b0e] dark:to-[#303956]
                    p-6 text-black dark:text-white 
                    [backface-visibility:hidden] flex items-center justify-center text-center border border-gray-300 dark:border-gray-600"
                    style={{ transform: axis === "y" ? "rotateY(180deg)" : "rotateX(180deg)" }}
                >
                    <div className="text-2xl md:text-4xl font-bold drop-shadow-md shadow-black">
                        {backContent}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
