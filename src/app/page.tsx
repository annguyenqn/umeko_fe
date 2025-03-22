'use client'

import { Navigation } from "@/components/layout/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <BackgroundBeams />
      <main className="flex-1">
        {/* Hero Section with Beam Background */}
        <section className="relative w-full py-12 md:py-24 lg:py-32">
          <BackgroundBeams />
          <Container className="relative flex flex-col items-center px-4 sm:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 leading-[1.4]">
                  {t('hero.title')}
                </h1>
                <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-muted-foreground">
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
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background/50 backdrop-blur-sm">
          <Container className="px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t('features.title')}
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                {t('features.subtitle')}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <Card className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{t('features.kanji.title')}</CardTitle>
                  <CardDescription>{t('features.kanji.description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {t('features.kanji.content')}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{t('features.vocabulary.title')}</CardTitle>
                  <CardDescription>{t('features.vocabulary.description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {t('features.vocabulary.content')}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{t('features.srs.title')}</CardTitle>
                  <CardDescription>{t('features.srs.description')}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {t('features.srs.content')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <Container className="px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t('howItWorks.title')}
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                {t('howItWorks.subtitle')}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">{step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{t(`howItWorks.step${step}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`howItWorks.step${step}.description`)}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <Container className="px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
                {t('cta.subtitle')}
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">{t('cta.button')}</Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
    </div>
  )
}
