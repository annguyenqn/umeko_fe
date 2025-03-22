import { Button } from "@/components/ui/button"
import { languages } from "@/config/i18n"
import { useLanguage } from "@/contexts/LanguageContext"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'vi' : 'en')
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
        >
            <span>{languages[language].flag}</span>
            <span className="hidden sm:inline-block">{languages[language].label}</span>
        </Button>
    )
} 