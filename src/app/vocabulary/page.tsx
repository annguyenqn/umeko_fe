'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'
import { getCategoriesService, } from '@/services/vocab.service'
import { Category } from '@/types/Category'
export default function VocabularyPage() {
    const { language } = useLanguage()
    const [categories, setCategories] = useState<Category[]>([])


    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategoriesService()
                setCategories(data)
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            }
        }
        fetchCategories()
    }, [])

    return (
        <div className="min-h-[20vh] p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Vocab Levels</h1>
            <div className="max-w-4xl flex flex-wrap justify-center gap-4">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="relative h-[13em] w-[17em] border border-opacity-50 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700/80 to-blue-200/20 dark:text-white text-neutral-900 font-nunito p-3 flex flex-col justify-between backdrop-blur-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-500 group/card hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-sky-500/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-xl"></div>

                        {/* Tên category */}
                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-800 dark:from-white dark:via-blue-100 dark:to-blue-200 bg-clip-text text-transparent mb-1">
                            {category.name}
                        </h1>

                        {/* Mô tả category */}
                        <p className="text-sm text-blue-900/90 dark:text-blue-100/90 leading-tight font-light mb-2">
                            {language === 'vi' ? category.description_vi : category.description_en}
                        </p>

                        {/* Nút Start */}
                        <Link
                            href={{
                                pathname: `/vocabulary/${category.name.toLowerCase()}/list`,
                                query: { categoryId: category.id },
                            }}
                            className="w-full text-center px-3 py-2 border border-blue-500/30 rounded-full flex items-center justify-center gap-2 group/btn hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all duration-300 backdrop-blur-md bg-blue-500/10"
                        >
                            <p className="text-sm font-medium text-blue-900 dark:text-white">
                                Start
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4 group-hover/btn:translate-x-[10%] transition-transform duration-300 text-blue-900 dark:text-white"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"></path>
                            </svg>
                        </Link>
                    </div>
                ))}
            </div>
        </div>



    )
}
