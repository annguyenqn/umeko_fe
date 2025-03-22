# Umeko Frontend

A modern Next.js application with TypeScript and best practices.

## Project Structure

```
src/
├── app/              # Next.js app directory with routes and layouts
├── components/       # React components
│   ├── common/      # Shared components
│   ├── layout/      # Layout components
│   └── ui/          # UI components
├── hooks/           # Custom React hooks
├── lib/            # Third-party library configurations
├── services/       # API services and data fetching
├── styles/         # Global styles and CSS modules
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── constants/      # Constants and configuration
└── config/         # App configuration files
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- 📁 Organized folder structure
- 🎯 TypeScript support
- 🔄 API integration setup
- 🎨 Modern UI components
- 🪝 Custom React hooks
- 🛠 Utility functions
- 📝 Constants and configurations
- 🔒 Environment variable management

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
