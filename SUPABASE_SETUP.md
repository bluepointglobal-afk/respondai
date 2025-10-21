# 🚀 Supabase Setup for RespondAI

## Your Supabase Credentials ✅
- **Project URL**: https://wqfokdehhtglizwpczqp.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZm9rZGVoaHRnbGl6d3BjenFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzgwNjUsImV4cCI6MjA3NjI1NDA2NX0.cFZ2kPoW8igLWibueQfVtwAaQc6ou4ZvgIdmkNfWK7I

## 🔧 Environment Variables Setup

Create `.env.local` file in your project root with:

```bash
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR_DB_PASSWORD]@db.wqfokdehhtglizwpczqp.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://wqfokdehhtglizwpczqp.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZm9rZGVoaHRnbGl6d3BjenFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NzgwNjUsImV4cCI6MjA3NjI1NDA2NX0.cFZ2kPoW8igLWibueQfVtwAaQc6ou4ZvgIdmkNfWK7I"

# NextAuth (keeping for compatibility)
NEXTAUTH_URL="http://localhost:3003"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (for Supabase Auth)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# OpenAI (for AI features)
OPENAI_API_KEY=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3003"
NEXT_PUBLIC_APP_NAME="RespondAI"
```

## 🔑 Get Your Database Password

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `wqfokdehhtglizwpczqp`
3. Go to **Settings** → **Database**
4. Copy the **Database Password**
5. Replace `[YOUR_DB_PASSWORD]` in the DATABASE_URL

## 🔐 Enable Google OAuth in Supabase

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Set **Redirect URL**: `https://wqfokdehhtglizwpczqp.supabase.co/auth/v1/callback`

## 🚀 Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Push schema to Supabase
npx prisma db push

# 4. Start development server
npm run dev
```

## ✅ What's Ready

- ✅ **Supabase Integration**: Client and auth provider created
- ✅ **Database Schema**: Updated for PostgreSQL
- ✅ **Authentication**: Supabase auth provider ready
- ✅ **Google OAuth**: Configuration ready

## 🎯 Next Steps

1. **Create `.env.local`** with the variables above
2. **Get your database password** from Supabase dashboard
3. **Enable Google OAuth** in Supabase dashboard
4. **Run the setup commands** above
5. **Test Google Auth** on your sign-in page

Your RespondAI platform will then have full Supabase integration with Google OAuth! 🚀
