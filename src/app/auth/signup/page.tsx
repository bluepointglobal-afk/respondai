'use client'

import { redirect } from 'next/navigation'

export default function NextAuthSignUpPage() {
  // Redirect to our custom register page
  redirect('/auth/register')
}