
'use client'
import React, { useState, useEffect, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vocabulary } from "@/types/Vocab";

interface QuizGameProps {
    vocabItems: Vocabulary[];
    t: (key: string) => string;
    language: "vi" | "en";
}

const QuizGame: React.FC<QuizGameProps> = ({ vocabItems, t, language }) => {
    const [questionType, setQuestionType] = useState<"hiragana" | "meaning_vi">("hiragana");
    const [remainingQuestions, setRemainingQuestions] = useState<Vocabulary[]>([...vocabItems]);
    const [currentQuestion, setCurrentQuestion] = useState<Vocabulary | null>(null);
    const [options, setOptions] = useState<Vocabulary[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [wrongCount, setWrongCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(1);
    const [quizCompleted, setQuizCompleted] = useState(false);
    console.log('remain question', remainingQuestions);

    // Add animation styling
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes scale-in {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in {
                animation: scale-in 0.4s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const generateQuestion = useCallback(() => {
        setRemainingQuestions((prevRemaining) => {
            if (prevRemaining.length === 0) {
                setQuizCompleted(true);
                return prevRemaining;
            }

            const randomIndex = Math.floor(Math.random() * prevRemaining.length);
            const selectedQuestion = prevRemaining[randomIndex];
            const correctAnswer = selectedQuestion.vocab;

            const shuffledOptions = vocabItems
                .filter(item => item.vocab !== correctAnswer)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            shuffledOptions.push(selectedQuestion);
            shuffledOptions.sort(() => Math.random() - 0.5);

            setCurrentQuestion(selectedQuestion);
            setOptions(shuffledOptions);
            setSelectedAnswer(null);
            setIsCorrect(null);

            return prevRemaining.filter(item => item.id !== selectedQuestion.id);
        });
    }, [vocabItems]);

    useEffect(() => {
        if (vocabItems.length > 0) {
            setRemainingQuestions([...vocabItems]);
            setQuizCompleted(false);
            generateQuestion();
        }
    }, [vocabItems, generateQuestion]);

    const handleAnswer = (answer: string) => {
        const correct = answer === currentQuestion?.vocab;
        setSelectedAnswer(answer);
        setIsCorrect(correct);

        if (correct) {
            setCorrectCount(prev => prev + 1);
            setTimeout(() => {
                nextQuestion();
            }, 800);
        } else {
            setWrongCount(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (remainingQuestions.length === 0) {
            setQuizCompleted(true);
            return;
        }
        setQuestionIndex(prev => prev + 1);
        generateQuestion();
    };

    const restartQuiz = () => {
        setRemainingQuestions([...vocabItems]);
        setCorrectCount(0);
        setWrongCount(0);
        setQuestionIndex(1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setQuizCompleted(false);
        generateQuestion();
    };

    const getLocalized = (vi: string, en: string) => {
        return language === "vi" ? vi : en;
    };

    return (
        <Card className="w-[850px] max-w-full p-8 mx-auto mb-4 md:mt-28 bg-white text-slate-900 dark:bg-[#303956] dark:text-white shadow-xl rounded-2xl border border-slate-200 dark:border-slate-700">
            <CardHeader>
                <CardTitle className="text-2xl flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[oklch(0.22_0.03_264.76)] to-[oklch(0.25_0.05_264.76)] dark:from-[oklch(0.45_0.08_264.76)] dark:to-[oklch(0.55_0.12_264.76)]">
                            {"Quiz Từ vựng"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {"Kiểm tra kiến thức của bạn"}
                        </p>
                    </div>

                    <Select
                        value={["hiragana", "meaning_vi"].includes(questionType) ? questionType : "hiragana"}
                        onValueChange={(value) => setQuestionType(value as "hiragana" | "meaning_vi")}
                    >
                        <SelectTrigger className="w-[160px] text-lg py-3 bg-white text-slate-900 dark:bg-[#3a445f] dark:text-white border border-[oklch(0.22_0.03_264.76)] dark:border-[oklch(0.35_0.06_264.76)] rounded-xl shadow-md">
                            <SelectValue placeholder="Chọn loại câu hỏi" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-slate-900 dark:bg-[#3a445f] dark:text-white border border-[oklch(0.22_0.03_264.76)] dark:border-[oklch(0.35_0.06_264.76)] rounded-xl">
                            <SelectItem value="hiragana" className="focus:bg-gray-600">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-[oklch(0.22_0.03_264.76)] rounded-full mr-2"></span>
                                    Furigana
                                </div>
                            </SelectItem>
                            <SelectItem value="meaning_vi" className="focus:bg-gray-600">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-[oklch(0.22_0.03_264.76)] rounded-full mr-2"></span>
                                    {t("quiz.mean") || "Mean"}
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardTitle>
            </CardHeader>

            <CardContent>
                {quizCompleted ? (
                    <div className="text-center py-6 relative overflow-hidden">

                        <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[oklch(0.35_0.08_264.76)] to-[oklch(0.45_0.12_264.76)]">{t("quiz.resultTitle") || "Result"}</h2>

                        <div className="flex flex-col space-y-8 mb-10">
                            {/* Score circle */}
                            <div className="mx-auto relative">
                                <div className="rounded-full w-48 h-48 flex flex-col items-center justify-center border-8 border-gray-100 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                                    <span className="text-5xl font-bold text-[oklch(0.35_0.08_264.76)] dark:text-[oklch(0.55_0.12_264.76)]">{correctCount}</span>
                                    <span className="text-xl text-gray-500 dark:text-gray-400">/ {vocabItems.length}</span>
                                </div>
                                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 bg-gradient-to-r from-green-400 to-blue-500 text-white text-sm font-bold py-1 px-3 rounded-full">
                                    {Math.round((correctCount / vocabItems.length) * 100)}%
                                </div>
                            </div>

                            {/* Stats cards */}
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className="rounded-xl p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-800 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{correctCount}</div>
                                            <div className="text-sm text-green-700 dark:text-green-300">{t("quiz.correctCount") || "Correct"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-800 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{wrongCount}</div>
                                            <div className="text-sm text-red-700 dark:text-red-300">{t("quiz.wrongCount") || "Wrong"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback message based on score */}
                        <div className="mb-8">
                            <p className="text-lg">
                                {correctCount === vocabItems.length ? (
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        Điểm tuyệt đối! Làm rất tốt!
                                    </span>
                                ) : correctCount >= vocabItems.length * 0.8 ? (
                                    <span className="font-medium text-[oklch(0.35_0.08_264.76)] dark:text-[oklch(0.55_0.12_264.76)]">
                                        Làm tốt lắm! Tiếp tục luyện tập nhé!
                                    </span>
                                ) : correctCount >= vocabItems.length * 0.5 ? (
                                    <span className="font-medium text-yellow-600 dark:text-yellow-400">
                                        Cố gắng tốt! Hãy thử lại để cải thiện hơn!
                                    </span>
                                ) : (
                                    <span className="font-medium text-pink-600 dark:text-pink-400">
                                        Tiếp tục luyện tập nhé! Bạn sẽ tiến bộ thôi!
                                    </span>
                                )}
                            </p>

                        </div>

                        <Button
                            onClick={restartQuiz}
                            className="mt-6 w-full max-w-md mx-auto py-6 text-lg font-bold text-white bg-gradient-to-r from-[oklch(0.28_0.06_264.76)] to-[oklch(0.35_0.08_264.76)] hover:from-[oklch(0.25_0.05_264.76)] hover:to-[oklch(0.30_0.07_264.76)] rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                        >
                            {t("quiz.retry") || "Try Again"}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </Button>
                    </div>
                ) : (
                    currentQuestion && (
                        <>
                            <div className="relative mb-12">
                                <p className="text-3xl font-semibold text-center py-8 px-6 rounded-xl bg-gradient-to-r from-[oklch(0.92_0.02_264.76)] to-[oklch(0.90_0.03_264.76)] dark:from-[oklch(0.18_0.04_264.76)] dark:to-[oklch(0.22_0.05_264.76)] shadow-md border border-[oklch(0.85_0.03_264.76)] dark:border-[oklch(0.30_0.06_264.76)]">
                                    {questionType === "hiragana" && currentQuestion.furigana}
                                    {questionType === "meaning_vi" && getLocalized(currentQuestion.mean_vi ?? '', currentQuestion.mean_en ?? '')}
                                </p>

                                {/* Progress indicator */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 rounded-full px-5 py-1.5 bg-white dark:bg-slate-700 border border-[oklch(0.85_0.03_264.76)] dark:border-[oklch(0.30_0.06_264.76)] shadow-md">
                                    <span className="text-sm font-medium">
                                        {questionIndex}/{vocabItems.length}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {options.map(option => (
                                    <Button
                                        key={option.id}
                                        onClick={() => handleAnswer(option.vocab)}
                                        className={`text-lg py-4 h-[70px] rounded-xl transition-all duration-300 font-bold relative overflow-hidden
                                            ${selectedAnswer === option.vocab
                                                ? isCorrect
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900/40"
                                                    : "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200 dark:shadow-red-900/40"
                                                : "bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-[oklch(0.95_0.02_264.76)] hover:to-[oklch(0.92_0.03_264.76)] dark:hover:from-[oklch(0.20_0.04_264.76)] dark:hover:to-[oklch(0.18_0.05_264.76)] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transform hover:scale-[1.02]"}
                                            ${selectedAnswer && !isCorrect && option.vocab === currentQuestion?.vocab
                                                ? "border-2 border-dashed border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300"
                                                : ""}`}
                                        disabled={selectedAnswer !== null}
                                    >
                                        {/* Animated feedback icon for correct/incorrect answers */}
                                        {selectedAnswer === option.vocab && isCorrect && (
                                            <span className="absolute right-3 flex items-center justify-center animate-scale-in">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                        )}
                                        {selectedAnswer === option.vocab && !isCorrect && (
                                            <span className="absolute right-3 flex items-center justify-center animate-scale-in">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </span>
                                        )}
                                        {option.vocab}
                                    </Button>
                                ))}
                            </div>
                            {selectedAnswer && !isCorrect && (
                                <Button
                                    onClick={nextQuestion}
                                    className="w-full py-6 mt-6 text-lg font-medium text-white bg-gradient-to-r from-[oklch(0.28_0.06_264.76)] to-[oklch(0.35_0.08_264.76)] hover:from-[oklch(0.25_0.05_264.76)] hover:to-[oklch(0.30_0.07_264.76)] rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                >
                                    {t("quiz.next") || "Next"}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            )}
                        </>
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default QuizGame;