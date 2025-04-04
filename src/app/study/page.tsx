"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import FlipCard from "@/components/ui/FlipCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface KanjiItem {
    vocab: string;
    furigana: string;
    mean_vi: string;
    mean_en: string;
    kanjis: Array<{
        kanji: string;
        han_viet: string;
        meaning_vi: string;
        meaning_en: string;
    }>;
}

const FlashCardPage: React.FC = () => {
    // Dữ liệu giả cho kanjiItems
    const fakeKanjiItems: KanjiItem[] = [
        {
            vocab: "こんにちは",
            furigana: "konnichiwa",
            mean_vi: "Xin chào",
            mean_en: "Hello",
            kanjis: [], // Không có kanji
        },
        {
            vocab: "食べる",
            furigana: "たべる",
            mean_vi: "Ăn",
            mean_en: "Eat",
            kanjis: [
                {
                    kanji: "食",
                    han_viet: "THỰC",
                    meaning_vi: "Ăn",
                    meaning_en: "Eat",
                },
            ],
        },
        {
            vocab: "学生",
            furigana: "がくせい",
            mean_vi: "Học sinh",
            mean_en: "Student",
            kanjis: [
                {
                    kanji: "学",
                    han_viet: "HỌC",
                    meaning_vi: "Học",
                    meaning_en: "Study",
                },
                {
                    kanji: "生",
                    han_viet: "SINH",
                    meaning_vi: "Sinh, sống",
                    meaning_en: "Life, birth",
                },
            ],
        },
    ];

    const kanjiItems = fakeKanjiItems;

    const [currentItem, setCurrentItem] = useState(0);
    const [shuffledKanjiItems, setShuffledKanjiItems] = useState(kanjiItems);
    const [selectedOption, setSelectedOption] = useState<"kanji" | "Furigana">("kanji");
    const [slide, setSlide] = useState(false);
    const [axis, setAxis] = useState<"x" | "y">("x");
    const [flipped, setFlipped] = useState(false);
    const [reviewStatus, setReviewStatus] = useState<("pass" | "partial" | "fail")[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Giả lập hàm t (dịch)
    const t = (key: string) => {
        const translations: { [key: string]: string } = {
            "flashCard.mix": "Mix",
            "flashCard.mean": "Mean",
        };
        return translations[key] || key;
    };

    // Hardcode language
    const language: "vi" | "en" = "vi"; // Có thể thay đổi thành "en"

    const getLocalized = (vi: string, en: string) => {
        return language === "vi" ? vi : en;
    };

    useEffect(() => {
        const updateAxis = () => {
            setAxis(window.innerWidth >= 768 ? "x" : "y");
        };

        updateAxis(); // gọi lần đầu
        window.addEventListener("resize", updateAxis);

        return () => window.removeEventListener("resize", updateAxis);
    }, []);

    const handlePaginationChange = (index: number) => {
        setSlide(true);
        setFlipped(false);
        setTimeout(() => {
            setCurrentItem(index);
            setSlide(false);
        }, 300);
    };
    const handleReview = (status: "pass" | "partial" | "fail") => {
        const updatedReviewStatus = [...reviewStatus];
        updatedReviewStatus[currentItem] = status;
        setReviewStatus(updatedReviewStatus);

        if (currentItem < shuffledKanjiItems.length - 1) {
            handlePaginationChange(currentItem + 1);
        } else {
            setIsDialogOpen(true); // Mở Dialog khi hoàn thành
        }
    };
    const handleShuffle = () => {
        const shuffled = [...shuffledKanjiItems]
            .map((item) => ({ ...item, random: Math.random() }))
            .sort((a, b) => a.random - b.random)
            .map(({ random, ...item }) => item);
        setShuffledKanjiItems(shuffled);
        setCurrentItem(0);
        setFlipped(false);
    };

    const currentKanji = shuffledKanjiItems[currentItem];
    const kanjiInfoList = currentKanji.kanjis || [];

    return (
        <>
            <div className="flex flex-col gap-3 justify-center items-center h-screen relative">
                <div className="flex">
                    <div className="flex mb-4 rounded-lg overflow-hidden border border-border bg-background">
                        <button
                            onClick={() => setSelectedOption("kanji")}
                            className={`px-6 py-2 font-bold text-[15px] tracking-wider transition-all duration-300 ease-in-out
                            ${selectedOption === "kanji"
                                    ? "bg-[#303956] text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#3b4454] dark:text-white dark:hover:bg-[#4b566a]"
                                }
                            focus:outline-none`}
                        >
                            Kanji
                        </button>

                        <button
                            onClick={handleShuffle}
                            className="px-3 md:px-6 py-2 font-bold text-[15px] tracking-wider transition-all duration-300 ease-in-out
                            bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#3b4454] dark:text-white dark:hover:bg-[#4b566a] focus:outline-none"
                        >
                            {t("flashCard.mix") || "Mix"}
                        </button>

                        <button
                            onClick={() => setSelectedOption("Furigana")}
                            className={`px-6 py-2 font-bold text-[15px] tracking-wider transition-all duration-300 ease-in-out
                            ${selectedOption === "Furigana"
                                    ? "bg-[#303956] text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#3b4454] dark:text-white dark:hover:bg-[#4b566a]"
                                }
                            focus:outline-none`}
                        >
                            Furigana
                        </button>
                    </div>
                </div>

                <div
                    className={`transition-transform duration-500 ease-out ${slide ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"
                        }`}
                >
                    <FlipCard
                        frontContent={
                            <h2 className="text-3xl md:text-5xl text-foreground">
                                {selectedOption === "kanji" ? currentKanji.vocab : currentKanji.furigana}
                            </h2>
                        }
                        backContent={
                            <div className="text-foreground text-lg md:text-2xl">
                                <p>
                                    <strong>Furigana: </strong>
                                    {selectedOption === "kanji" ? currentKanji.furigana : currentKanji.vocab}
                                </p>
                                <p>
                                    <strong> {t("flashCard.mean") || "Mean"}: </strong>
                                    {getLocalized(currentKanji.mean_vi ?? "", currentKanji.mean_en ?? "")}
                                </p>
                                {kanjiInfoList.length > 0 && (
                                    <div
                                        className={`mt-4 border-t pt-2 grid ${kanjiInfoList.length >= 3 ? "grid-cols-2 gap-2" : "grid-cols-1"
                                            }`}
                                    >
                                        {kanjiInfoList.map((kanji, index) => (
                                            <div key={index} className="p-2">
                                                <strong>Kanji: </strong>
                                                <span className="text-2xl md:text-3xl">{kanji.kanji}</span>
                                                <br />
                                                {language === "vi" && (
                                                    <>
                                                        <strong>Âm Hán: </strong>
                                                        {kanji.han_viet}
                                                        <br />
                                                    </>
                                                )}
                                                <strong>{t("flashCard.mean") || "Mean"}: </strong>
                                                {getLocalized(kanji.meaning_vi, kanji.meaning_en)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        }
                        axis={axis}
                        flipped={flipped}
                        setFlipped={setFlipped}
                    />
                </div>
                <Card className="w-full max-w-md">
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-2">
                        <Button
                            variant="destructive"
                            className="flex-1 gap-2"
                            onClick={() => handleReview("fail")}
                        >
                            <XCircle className="w-5 h-5" /> Quên
                        </Button>

                        <Button
                            variant="secondary"
                            className="flex-1 gap-2"
                            onClick={() => handleReview("partial")}
                        >
                            <AlertCircle className="w-5 h-5 text-yellow-500" /> Không nhớ lắm
                        </Button>

                        <Button
                            variant="default"
                            className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleReview("pass")}
                        >
                            <CheckCircle className="w-5 h-5" /> Nhớ
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogTitle>🎉 Hoàn thành ôn tập!</DialogTitle>
                    <DialogDescription>
                        Bạn đã ôn tập hết tất cả từ vựng. Hãy tiếp tục luyện tập để ghi nhớ lâu hơn nhé!
                    </DialogDescription>
                    <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FlashCardPage;