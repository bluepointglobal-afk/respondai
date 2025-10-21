#!/bin/bash

echo "🚀 Setting up RespondAI with Supabase..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
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
EOF
    echo "✅ .env.local created!"
    echo "⚠️  Please update DATABASE_URL with your Supabase database password"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to Supabase
echo "🗄️  Pushing schema to Supabase..."
echo "⚠️  Make sure you've updated DATABASE_URL with your password!"
npx prisma db push

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update DATABASE_URL in .env.local with your Supabase password"
echo "2. Enable Google OAuth in your Supabase dashboard"
echo "3. Run: npm run dev"
echo "4. Test Google Auth on http://localhost:3003/auth/signin"
echo ""
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/wqfokdehhtglizwpczqp"
