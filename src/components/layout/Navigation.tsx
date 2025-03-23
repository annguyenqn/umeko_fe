'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
import { useLanguage } from "@/contexts/LanguageContext"
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            {/* <span className="inline-block font-bold">梅子</span> */}
                            <span className="inline-block font-bold">UMEKO</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <nav className="flex gap-6">
                            <Link href="/kanji" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                {t('nav.kanji')}
                            </Link>
                            <Link href="/vocabulary" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                {t('nav.vocabulary')}
                            </Link>
                            <Link href="/study" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                                {t('nav.study')}
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <ThemeSwitcher />
                            <LanguageSwitcher />
                            <Button variant="ghost" asChild>
                                <Link href="/login">{t('nav.login')}</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">{t('nav.signup')}</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                        <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="border-t md:hidden">
                        <div className="flex flex-col space-y-4 p-4">
                            <Link
                                href="/kanji"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('nav.kanji')}
                            </Link>
                            <Link
                                href="/vocabulary"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('nav.vocabulary')}
                            </Link>
                            <Link
                                href="/study"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t('nav.study')}
                            </Link>
                            <div className="flex flex-col gap-2 pt-2">
                                <Button variant="ghost" asChild className="w-full justify-center">
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        {t('nav.login')}
                                    </Link>
                                </Button>
                                <Button asChild className="w-full justify-center">
                                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                        {t('nav.signup')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </nav>
    )
} 