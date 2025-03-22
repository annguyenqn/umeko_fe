'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

import { Navigation } from '@/components/layout/Navigation'

export default function KanjiPage() {
    const { t } = useLanguage()

    return (
        <>
            <Navigation />
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-12 text-center">{t('kanji.title')}</h1>
                    <div className="flex flex-wrap justify-center gap-12">
                        {/* N5 Card - Teal theme */}
                        <div className="relative h-[26em] w-[28em] border-2 border-[rgba(20,184,166,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(20,184,166,1)] via-teal-700/80 to-[rgba(20,184,166,0.2)] dark:text-white text-neutral-900 font-nunito p-[2.5em] flex justify-center items-left flex-col gap-[1.5em] backdrop-blur-[12px] hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-500 group/card hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/30 via-emerald-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em] dark:bg-opacity-100 bg-opacity-70"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_60%)] group-hover/card:animate-pulse dark:bg-opacity-100 bg-opacity-70"></div>

                            <div className="absolute top-4 right-4 flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-teal-300/50 dark:bg-opacity-50 bg-opacity-80"></div>
                                <div className="w-2 h-2 rounded-full bg-teal-300/30 dark:bg-opacity-30 bg-opacity-60"></div>
                                <div className="w-2 h-2 rounded-full bg-teal-300/10 dark:bg-opacity-10 bg-opacity-40"></div>
                            </div>

                            <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-5">
                                <h1 className="text-[2.6em] font-bold bg-gradient-to-r from-teal-900 via-teal-700 to-teal-800 dark:from-white dark:via-teal-100 dark:to-teal-200 bg-clip-text text-transparent">
                                    {t('kanji.n5.title')}
                                </h1>
                                <p className="text-[1.1em] text-teal-900/90 dark:text-teal-100/90 leading-relaxed font-light">
                                    {t('kanji.n5.description')}
                                </p>
                            </div>

                            <Link href="/kanji/n5" className="relative h-fit w-fit px-[2em] py-[1em] mt-6 border-[1px] border-teal-500/30 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-teal-500/10">
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/40 via-emerald-500/40 to-teal-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 dark:bg-opacity-40 bg-opacity-70"></div>
                                <p className="relative z-10 font-medium tracking-wide text-teal-900 dark:text-white">{t('kanji.startLearning')}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="relative z-10 w-5 h-5 group-hover/btn:translate-x-[10%] transition-transform duration-300 text-teal-900 dark:text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path>
                                </svg>
                            </Link>
                        </div>

                        {/* N4 Card - Blue theme */}
                        <div className="relative h-[26em] w-[28em] border-2 border-[rgba(37,99,235,0.5)] rounded-[1.5em] bg-gradient-to-br from-[rgba(37,99,235,1)] via-blue-700/80 to-[rgba(37,99,235,0.2)] dark:text-white text-neutral-900 font-nunito p-[2.5em] flex justify-center items-left flex-col gap-[1.5em] backdrop-blur-[12px] hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 group/card hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-sky-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-[1.5em] dark:bg-opacity-100 bg-opacity-70"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_60%)] group-hover/card:animate-pulse dark:bg-opacity-100 bg-opacity-70"></div>

                            <div className="absolute top-4 right-4 flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-300/50 dark:bg-opacity-50 bg-opacity-80"></div>
                                <div className="w-2 h-2 rounded-full bg-blue-300/30 dark:bg-opacity-30 bg-opacity-60"></div>
                                <div className="w-2 h-2 rounded-full bg-blue-300/10 dark:bg-opacity-10 bg-opacity-40"></div>
                            </div>

                            <div className="relative z-10 transition-transform duration-300 group-hover/card:translate-y-[-2px] space-y-5">
                                <h1 className="text-[2.6em] font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 dark:from-white dark:via-blue-100 dark:to-blue-200 bg-clip-text text-transparent">
                                    {t('kanji.n4.title')}
                                </h1>
                                <p className="text-[1.1em] text-blue-900/90 dark:text-blue-100/90 leading-relaxed font-light">
                                    {t('kanji.n4.description')}
                                </p>
                            </div>

                            <Link href="/kanji/n4" className="relative h-fit w-fit px-[2em] py-[1em] mt-6 border-[1px] border-blue-500/30 rounded-full flex justify-center items-center gap-[0.7em] overflow-hidden group/btn hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-300 backdrop-blur-[12px] bg-blue-500/10">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/40 via-sky-500/40 to-blue-600/40 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 dark:bg-opacity-40 bg-opacity-70"></div>
                                <p className="relative z-10 font-medium tracking-wide text-blue-900 dark:text-white">{t('kanji.startLearning')}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="relative z-10 w-5 h-5 group-hover/btn:translate-x-[10%] transition-transform duration-300 text-blue-900 dark:text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
} 