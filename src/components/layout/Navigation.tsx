'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, LogOut, SquareUserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/useAuthStore'

export function Navigation() {
    const { t } = useLanguage()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, logout, isAuthenticated } = useAuthStore()
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    // if (!hasHydrated) return null
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="inline-block font-bold">UMEKO</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <nav className="flex gap-6">
                            <Link href="/kanji" className="text-sm font-medium text-muted-foreground hover:text-primary">
                                {t('nav.kanji')}
                            </Link>
                            <Link href="/vocabulary" className="text-sm font-medium text-muted-foreground hover:text-primary">
                                {t('nav.vocabulary')}
                            </Link>
                            <Link href="/review" className="text-sm font-medium text-muted-foreground hover:text-primary">
                                Ôn tập
                            </Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <ThemeSwitcher />
                            <LanguageSwitcher />
                            {isAuthenticated && user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <Avatar>
                                                <AvatarImage src={user.avatar || undefined} />
                                                <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{user.firstName}</span>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href="/user/dashboard" className="w-full flex gap-2">
                                                <SquareUserRound></SquareUserRound>  {'Tiến độ học'}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={logout} className="gap-2 text-destructive">
                                            <LogOut className="w-4 h-4" /> {t('nav.logout') || 'Đăng xuất'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <>
                                    <Button variant="ghost" asChild>
                                        <Link href="/login">{t('nav.login')}</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/">{t('nav.signup')}</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeSwitcher />
                        {/* <LanguageSwitcher /> */}
                        <Button variant="ghost" size="icon" onClick={toggleMenu}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="border-t md:hidden">
                        <div className="flex flex-col space-y-4 p-4">
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary">
                                {t('nav.kanji')}
                            </Link>
                            <Link href="/vocabulary" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary">
                                {t('nav.vocabulary')}
                            </Link>
                            <Link href="/review" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary">
                                Ôn tập
                            </Link>

                            <div className="flex flex-col gap-2 pt-2">
                                {isAuthenticated && user ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar || undefined} />
                                                <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{user.firstName}</span>
                                        </div>
                                        <Button variant="ghost" asChild className="justify-start">
                                            <Link className='flex gap-2' href="/user/dashboard" onClick={() => setIsMenuOpen(false)}>
                                                <SquareUserRound></SquareUserRound> {'Tiến độ học'}
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" className="justify-start text-destructive" onClick={logout}>
                                            <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </nav>
    )
}
