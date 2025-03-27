'use client'

import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'vi' : 'en')
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="w-9 px-0"
        >
            {language === 'en' ? (
                <span className="text-lg">🇺🇸</span>
            ) : (
                <span className="text-lg">🇻🇳</span>
            )}
        </Button>
    )
}

// Alternative version using Lucide icons instead of flags
export function LanguageSwitcherAlt() {
    const { language, setLanguage } = useLanguage()

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'vi' : 'en')
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="w-9 px-0"
            title={language === 'en' ? 'Switch to Vietnamese' : 'Switch to English'}
        >
            <Languages className="h-4 w-4" />
        </Button>
    )
} 