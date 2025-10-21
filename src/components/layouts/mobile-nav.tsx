'use client'

import { LayoutDashboard, FileText, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tests', label: 'Tests', icon: FileText },
  { href: '/new', label: 'New', icon: Plus },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="
      md:hidden fixed bottom-0 inset-x-0 z-50
      h-16 pb-safe
      bg-light-bg-elevated/95 dark:bg-dark-bg-elevated/95
      backdrop-blur-xl
      border-t border-light-border-primary dark:border-dark-border-primary
    ">
      <div className="h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isNew = item.href === '/new'

          if (isNew) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  h-14 w-14 rounded-full
                  bg-gradient-to-br from-primary-500 to-accent-purple
                  flex flex-col items-center justify-center
                  text-white font-medium text-xs
                  shadow-lg
                  active:scale-95
                  transition-transform
                "
              >
                <Icon className="h-6 w-6" />
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all',
                isActive
                  ? 'text-primary-500'
                  : 'text-light-text-tertiary dark:text-dark-text-tertiary'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

