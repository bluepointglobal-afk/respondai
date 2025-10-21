'use client'

import { redirect } from 'next/navigation'

export default function NextAuthSignInPage() {
  // Redirect to our custom login page
  redirect('/auth/login')
}