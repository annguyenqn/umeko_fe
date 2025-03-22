'use client'

import { Navigation } from "@/components/layout/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24">
          <Container className="flex flex-col items-center px-4 sm:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
                  {t('hero.title')}
                </h1>
                <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
                  {t('hero.subtitle')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/signup">{t('hero.startLearning')}</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/about">{t('hero.learnMore')}</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-gray-100 dark:bg-gray-800">
          <Container className="px-4 sm:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>{t('features.kanji.title')}</CardTitle>
                  <CardDescription>{t('features.kanji.description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    {t('features.kanji.content')}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>{t('features.vocabulary.title')}</CardTitle>
                  <CardDescription>{t('features.vocabulary.description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    {t('features.vocabulary.content')}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle>{t('features.srs.title')}</CardTitle>
                  <CardDescription>{t('features.srs.description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    {t('features.srs.content')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>
      </main>
    </div>
  )
}
