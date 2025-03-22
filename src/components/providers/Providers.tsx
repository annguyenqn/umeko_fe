'use client'

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { queryClient } from "@/lib/query"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { ThemeProvider } from "./ThemeProvider"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </ThemeProvider>
    )
} 