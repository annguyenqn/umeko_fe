import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vocab } from "@/types/Vocab";

interface QuizGameProps {
    vocabItems: Vocab[];
    t: (key: string) => string;
    language: "vi" | "en";

}

const QuizGame: React.FC<QuizGameProps> = ({ vocabItems, t, language }) => {
    const [questionType, setQuestionType] = useState<"hiragana" | "meaning_vi">("hiragana");
    const [remainingQuestions, setRemainingQuestions] = useState<Vocab[]>([...vocabItems]);
    const [currentQuestion, setCurrentQuestion] = useState<Vocab | null>(null);
    const [options, setOptions] = useState<Vocab[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [wrongCount, setWrongCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(1);

    useEffect(() => {
        if (vocabItems.length > 0) {
            setRemainingQuestions([...vocabItems]);
            generateQuestion();
        }
    }, [vocabItems]);

    const generateQuestion = () => {
        if (remainingQuestions.length === 0) return;

        const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
        const selectedQuestion = remainingQuestions[randomIndex];
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
        setRemainingQuestions(prev => prev.filter(item => item.id !== selectedQuestion.id));
    };

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
        if (remainingQuestions.length === 0) return;
        setQuestionIndex(prev => prev + 1);
        generateQuestion();
    };

    const getLocalized = (vi: string, en: string) => {
        return language === "vi" ? vi : en;
    };
    const restartQuiz = () => {
        setRemainingQuestions([...vocabItems]);
        setCorrectCount(0);
        setWrongCount(0);
        setQuestionIndex(1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        generateQuestion();
    };


    return (
        <Card className="w-[850px] max-w-full p-8 mx-auto mb-4 md:mt-28 bg-white text-slate-900 dark:bg-[#303956] dark:text-white shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle className="text-2xl">
                    <Select value={questionType} onValueChange={(value) => setQuestionType(value as "hiragana" | "meaning_vi")}>
                        <SelectTrigger
                            className="w-[130px] text-lg py-3 mb-5 bg-white text-slate-900 dark:bg-[#303956] dark:text-white border border-slate-400 dark:border-slate-600">
                            <SelectValue placeholder="Chọn loại câu hỏi" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-slate-900 dark:bg-[#303956] dark:text-white">
                            <SelectItem value="hiragana">Furigana</SelectItem>
                            <SelectItem value="meaning_vi">{t("quiz.mean") || "Mean"}</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="text-lg mt-3">
                        <p>{questionIndex}/{vocabItems.length}</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {remainingQuestions.length === 0 ? (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold"> {t("quiz.resultTitle") || "Result Title"}</h2>
                        <p className="mt-4 text-green-500 text-lg">
                            {t("quiz.correctCount") || "Correct Count"}
                            {correctCount}</p>
                        <p className="mt-4 text-red-500 text-lg">{t("quiz.wrongCount") || "Wrong Count"}{wrongCount}</p>
                        <Button
                            onClick={restartQuiz}
                            className="mt-6 w-full py-6 text-lg text-white bg-blue-500 hover:bg-blue-700"
                        >
                            {t("quiz.retry") || "Retry"}
                        </Button>
                    </div>
                ) : (
                    currentQuestion && (
                        <>
                            <p className="text-3xl font-semibold text-center mb-8">
                                {questionType === "hiragana" && currentQuestion.furigana}
                                {questionType === "meaning_vi" && getLocalized(currentQuestion.meaning_vi ?? '', currentQuestion.meaning_en ?? '')}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {options.map(option => (
                                    <Button
                                        key={option.id}
                                        onClick={() => handleAnswer(option.vocab)}
                                        className={`text-lg py-4 h-[70px] rounded-lg transition-colors font-bold 
                                            border border-slate-300 dark:border-slate-600 hover:border-[#f9e7e8]
                                            shadow-md hover:shadow-lg
                                            ${selectedAnswer === option.vocab
                                                ? isCorrect
                                                    ? "bg-green-600 text-white"
                                                    : "bg-red-600 text-white"
                                                : "bg-transparent hover:bg-[#e7bfc7] text-slate-900 dark:text-white dark:hover:bg-[#3f486b]"
                                            }
                                            ${selectedAnswer && !isCorrect && option.vocab === currentQuestion?.vocab
                                                ? "border-4 border-dashed border-green-400 bg-white text-slate-800 dark:bg-[#4a5470] dark:text-white dark:border-green-400"
                                                : ""}`}
                                        disabled={selectedAnswer !== null}
                                    >
                                        {option.vocab}
                                    </Button>
                                ))}
                            </div>
                            {selectedAnswer && !isCorrect && (
                                <Button onClick={nextQuestion} className="w-full py-6 mt-6 text-lg text-white bg-blue-500 hover:bg-blue-700">
                                    {t("quiz.next") || "Next"}
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
