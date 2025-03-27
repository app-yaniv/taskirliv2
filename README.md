# Taskirli - A Rental Site

A modern rental platform built with Next.js, TypeScript, and Tailwind CSS.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Setup

### Creating the Profiles Table

You need to create the profiles table in your Supabase project to store user profile information. There are two ways to do this:

#### Option 1: Using the Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy the contents of `src/utils/supabase/schema.sql` and paste it into the query editor
5. Run the query

#### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push -f src/utils/supabase/schema.sql
```

### Automatic Profile Creation

The SQL migration includes a trigger that automatically creates a profile record whenever a new user registers. This ensures that every user will have a corresponding entry in the profiles table.

## Features

- User authentication with Supabase
- User profiles and profile management
- RTL support for Hebrew language
- Responsive design

## Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)

## Deployment Instructions

This project is set up for server-side rendering with Next.js, which enables dynamic data fetching from Supabase.

### Deploying to Vercel

1. **Sign up for Vercel**: Create an account at [vercel.com](https://vercel.com)

2. **Import your GitHub repository**: Connect your GitHub account and import this repository

3. **Configure environment variables**: Add the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key

4. **Deploy**: Click the "Deploy" button

### Using GitHub Actions (Alternative)

To use the included GitHub Actions workflow for automated deployment:

1. Add the following secrets to your GitHub repository:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. Push to the `master` branch to trigger the deployment

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start the production server
npm start
```
