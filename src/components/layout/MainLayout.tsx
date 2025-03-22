import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className={`min-h-screen bg-white ${inter.className}`}>
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
                <div className="container mx-auto px-4 py-4">
                    {/* Add your header content here */}
                    <nav>{/* Add navigation items here */}</nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

            <footer className="border-t bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {/* Add your footer content here */}
                </div>
            </footer>
        </div>
    );
} 