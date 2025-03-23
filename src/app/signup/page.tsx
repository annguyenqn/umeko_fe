'use client'

import { SignUpForm } from "@/components/auth/SignUpForm"
import { Container } from "@/components/ui/container"
import { useLanguage } from "@/contexts/LanguageContext"
import { Nunito } from "next/font/google"

const nunito = Nunito({ subsets: ["latin"] })

export default function SignUpPage() {
    const { t } = useLanguage();

    return (
        <>
            <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="mb-6 sm:mb-8 text-center">
                        <div className="mb-3 sm:mb-4 text-center">
                            <span className="inline-block text-3xl sm:text-4xl">🎋</span>
                        </div>
                        <h1 className={`${nunito.className} text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-2`}>
                            {t('signup.title')}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            {t('signup.subtitle')}
                        </p>
                    </div>
                    <div className="rounded-xl sm:rounded-2xl border bg-card p-4 sm:p-8 shadow-lg">
                        <SignUpForm />
                    </div>
                </div>
            </Container>
        </>
    )
} 