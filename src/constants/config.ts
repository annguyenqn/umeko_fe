export const APP_CONFIG = {
  name: 'Umeko',
  description: 'Next.js Application',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
} as const;

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
    url: APP_CONFIG.url,
    siteName: APP_CONFIG.name,
  },
} as const; 