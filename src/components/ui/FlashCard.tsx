import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import FlipCard from "./FlipCard";
import { Vocab } from "@/types/Vocab";

interface FlashCardProps {
    kanjiItems: Vocab[];
    t: (key: string) => string;
    language: "vi" | "en";
}

const FlashCard: React.FC<FlashCardProps> = ({ kanjiItems, t, language }) => {
    const [currentItem, setCurrentItem] = useState(0);
    const [shuffledKanjiItems, setShuffledKanjiItems] = useState(kanjiItems);
    const [selectedOption, setSelectedOption] = useState<"kanji" | "Furigana">("kanji");
    const [slide, setSlide] = useState(false);
    const [axis, setAxis] = useState<'x' | 'y'>(window.innerWidth >= 768 ? 'x' : 'y');
    const [flipped, setFlipped] = useState(false);

    const getLocalized = (vi: string, en: string) => {
        return language === "vi" ? vi : en;
    };

    useEffect(() => {
        const handleResize = () => {
            setAxis(window.innerWidth >= 768 ? 'x' : 'y');
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (kanjiItems.length === 0) {
        return <div>Đang tải dữ liệu...</div>;
    }

    const handlePaginationChange = (index: number) => {
        setSlide(true);
        setFlipped(false);
        setTimeout(() => {
            setCurrentItem(index);
            setSlide(false);
        }, 300);
    };

    const handleShuffle = () => {
        const shuffled = [...shuffledKanjiItems]
            .map((item) => ({ ...item, random: Math.random() }))
            .sort((a, b) => a.random - b.random)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ random, ...item }) => item);
        setShuffledKanjiItems(shuffled);
        setCurrentItem(0);
        setFlipped(false);
    };

    const currentKanji = shuffledKanjiItems[currentItem];
    const kanjiInfoList = currentKanji.kanjis || [];

    return (
        <>
            <div className="flex flex-col gap-3 justify-center items-center h-[650px] relative">
                <div className="flex">
                    <div className="flex mb-4 rounded-lg overflow-hidden border border-border bg-background">
                        <button
                            onClick={() => setSelectedOption("kanji")}
                            className={`px-6 py-2 font-bold text-[15px] tracking-wider transition-all duration-300 ease-in-out
                                ${selectedOption === "kanji"
                                    ? "bg-[#303956] text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#3b4454] dark:text-white dark:hover:bg-[#4b566a]"}
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
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#3b4454] dark:text-white dark:hover:bg-[#4b566a]"}
                                focus:outline-none`}
                        >
                            Furigana
                        </button>
                    </div>
                </div>

                <div className={`transition-transform duration-500 ease-out ${slide ? "translate-x-[-100%] opacity-0" : "translate-x-0 opacity-100"}`}>
                    <FlipCard
                        frontContent={
                            <h2 className="text-3xl md:text-5xl text-foreground">
                                {selectedOption === "kanji" ? currentKanji.vocab : currentKanji.furigana}
                            </h2>
                        }
                        backContent={
                            <div className="text-foreground text-lg md:text-2xl">
                                <p><strong>Furigana: </strong>{selectedOption === "kanji" ? currentKanji.furigana : currentKanji.vocab}</p>
                                <p><strong> {t("flashCard.mean") || "Mean"}: </strong>{getLocalized(currentKanji.meaning_vi ?? '', currentKanji.meaning_en ?? '')}</p>
                                {kanjiInfoList.length > 0 && (
                                    <div className={`mt-4 border-t pt-2 grid ${kanjiInfoList.length >= 3 ? 'grid-cols-2 gap-2' : 'grid-cols-1'}`}>
                                        {kanjiInfoList.map((kanji, index) => (
                                            <div key={index} className="p-2">
                                                <strong>Kanji: </strong><span className="text-2xl md:text-3xl">{kanji.kanji}</span><br />
                                                {language === "vi" && (
                                                    <>
                                                        <strong>Âm Hán: </strong>{kanji.han_viet}<br />
                                                    </>
                                                )}
                                                <strong>{t("flashCard.mean") || "Mean"}: </strong>{getLocalized(kanji.meaning_vi, kanji.meaning_en)}
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

                <div className="px-6 py-3">
                    <Pagination totalItems={shuffledKanjiItems.length} currentIndex={currentItem} onChange={handlePaginationChange} />
                </div>
            </div>
        </>
    );
};

export default FlashCard;
