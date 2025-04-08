'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { useLanguage } from "@/contexts/LanguageContext"
import Link from "next/link"
import dynamic from "next/dynamic"

// Tải động BackgroundBeams với kiểu rõ ràng
const BackgroundBeams = dynamic(
  () => import("@/components/ui/background-beams").then((mod) => mod.BackgroundBeams),
  { ssr: false }
);

export default function Home() {
  const { t } = useLanguage();
  const getText = (key: string, fallback: string) => t(key) || fallback;

  return (
    <div className="flex min-h-screen flex-col">
      <BackgroundBeams className="z-0" />
      <main className="flex-1" role="main">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32" aria-labelledby="hero-title">
          <BackgroundBeams className="z-0" />
          <Container className="relative flex flex-col items-center px-4 sm:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  id="hero-title"
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 leading-[1.4]"
                >
                  {getText('hero.title', 'Learn Japanese with Umeko')}
                </h1>
                <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg text-muted-foreground">
                  {getText('hero.subtitle', 'Master Japanese vocabulary and Kanji efficiently.')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/signup">{getText('hero.startLearning', 'Start Learning')}</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/about">{getText('hero.learnMore', 'Learn More')}</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-background/50 backdrop-blur-sm"
          aria-labelledby="features-title"
        >
          <Container className="px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2
                id="features-title"
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4"
              >
                {getText('features.title', 'Features')}
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                {getText('features.subtitle', 'Explore what makes Umeko unique.')}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <Card className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{getText('features.kanji.title', 'Kanji Learning')}</CardTitle>
                  <CardDescription>
                    {getText('features.kanji.description', 'Master Kanji with ease.')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {getText('features.kanji.content', 'Learn Kanji through interactive lessons.')}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{getText('features.vocabulary.title', 'Vocabulary Building')}</CardTitle>
                  <CardDescription>
                    {getText('features.vocabulary.description', 'Expand your Japanese vocabulary.')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {getText('features.vocabulary.content', 'Practice with real-world examples.')}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{getText('features.srs.title', 'Spaced Repetition')}</CardTitle>
                  <CardDescription>
                    {getText('features.srs.description', 'Optimize retention with SRS.')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {getText('features.srs.content', 'Review at the perfect intervals.')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" aria-labelledby="how-it-works-title">
          <Container className="px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2
                id="how-it-works-title"
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4"
              >
                {getText('howItWorks.title', 'How It Works')}
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                {getText('howItWorks.subtitle', 'Simple steps to get started.')}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-primary">{step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">
                    {getText(`howItWorks.step${step}.title`, `Step ${step}`)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getText(`howItWorks.step${step}.description`, `Description for step ${step}.`)}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5" aria-labelledby="cta-title">
          <Container className="px-4 sm:px-6">
            <div className="text-center">
              <h2
                id="cta-title"
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4"
              >
                {getText('cta.title', 'Ready to Start?')}
              </h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
                {getText('cta.subtitle', 'Join now and begin your Japanese journey.')}
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">{getText('cta.button', 'Sign Up Now')}</Link>
              </Button>
            </div>
          </Container>
        </section>
      </main>
    </div>
  )
}