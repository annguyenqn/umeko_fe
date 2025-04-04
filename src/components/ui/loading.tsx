// components/Loading.tsx
import React from 'react';

const Loading: React.FC = () => {
    return (
        <>
            <div className="text-center mt-40">
                <div
                    className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500 mx-auto"
                ></div>
                <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                    Please wait a minute  <span>:))</span>
                </p>
            </div>

        </>
    );
};

export default Loading;
