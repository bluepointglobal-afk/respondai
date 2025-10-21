import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { SupabaseAuthProvider } from '@/components/auth/supabase-auth-provider'
import { MainNavigation, BreadcrumbNavigation } from '@/components/navigation/main-navigation'
import { AuthProvider } from '@/components/providers/auth-provider'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RespondAI - Professional Market Research Platform',
  description: 'Industry-standard market research with AI-powered insights, Van Westendorp pricing, MaxDiff analysis, and Kano Model classification',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <SupabaseAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <MainNavigation />
              <BreadcrumbNavigation />
              <main className="min-h-screen">
                {children}
              </main>
            </ThemeProvider>
          </SupabaseAuthProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

