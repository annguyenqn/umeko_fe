export const APP_CONFIG = {
  name: 'Umeko',
  description: 'Next.js Application',
  frontendUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  frontendApiUrl: process.env.NEXT_PUBLIC_API_URL, // Next.js API routes
  backendApiUrl: process.env.NEXT_PUBLIC_NEST_API_URL,  // NestJS API
} as const

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  // Add more routes as needed
} as const;

export const META = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_CONFIG.frontendUrl,
    siteName: APP_CONFIG.name,
  },
} as const; 