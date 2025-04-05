'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useEffect, useState } from 'react'
import { getCategoriesService } from '@/services/vocab.service'
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
                        className="relative h-[13em] w-[17em] border border-opacity-50 rounded-xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200/50 dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-gray-700/50 text-neutral-900 dark:text-white font-nunito p-3 flex flex-col justify-between backdrop-blur-md shadow-md hover:shadow-xl hover:shadow-gray-400/40 dark:hover:shadow-gray-700/40 transition-all duration-500 group/card hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 via-gray-300/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-xl dark:from-gray-600/30 dark:via-gray-500/20 dark:to-transparent"></div>

                        {/* Category Name */}
                        <h1 className="text-lg font-bold bg-gradient-to-r from-neutral-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent mb-1">
                            {category.name}
                        </h1>

                        {/* Category Description */}
                        <p className="text-sm text-neutral-700 dark:text-gray-200 leading-tight font-light mb-2">
                            {language === 'vi' ? category.description_vi : category.description_en}
                        </p>

                        {/* Start Button */}
                        <Link
                            href={{
                                pathname: `/vocabulary/${category.name.toLowerCase()}/list`,
                                query: { categoryId: category.id },
                            }}
                            className="w-full text-center px-3 py-2 border border-gray-300 rounded-full flex items-center justify-center gap-2 group/btn hover:border-gray-400 hover:shadow-md hover:shadow-gray-300/30 active:scale-95 transition-all duration-300 backdrop-blur-md bg-gray-100/50 dark:bg-gray-700/50 dark:hover:shadow-gray-600/30"
                        >
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                Start
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-4 h-4 group-hover/btn:translate-x-[10%] transition-transform duration-300 text-neutral-900 dark:text-white"
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