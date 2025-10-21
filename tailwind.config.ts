import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'safe': '640px',
      },
      colors: {
        // Light theme colors
        light: {
          bg: {
            primary: '#FFFFFF',
            secondary: '#F8F9FA',
            tertiary: '#F1F3F5',
            elevated: '#FFFFFF',
          },
          text: {
            primary: '#1A1A1A',
            secondary: '#4A5568',
            tertiary: '#718096',
            inverse: '#FFFFFF',
          },
          border: {
            primary: '#E2E8F0',
            secondary: '#CBD5E0',
            focus: '#6B7AB8',
          }
        },
        // Dark theme colors
        dark: {
          bg: {
            primary: '#0C0D12',
            secondary: '#18181B',
            tertiary: '#27272A',
            elevated: '#27272A',
          },
          text: {
            primary: '#F4F4F5',
            secondary: '#A1A1AA',
            tertiary: '#71717A',
            inverse: '#1A1A1A',
          },
          border: {
            primary: '#3F3F46',
            secondary: '#52525B',
            focus: '#8A96D4',
          }
        },
        // Brand colors (same in both themes)
        primary: {
          50: '#F4F5F9',
          100: '#E9ECF3',
          200: '#D3D9E7',
          300: '#A8B5E5',
          400: '#8A96D4',
          500: '#6B7AB8', // Main brand color
          600: '#4A5586',
          700: '#2D3461',
          800: '#1A1F3A',
          900: '#0A0E27',
          950: '#050711',
        },
        accent: {
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        // Semantic colors that adapt to theme
        success: {
          light: '#059669',
          dark: '#10B981',
        },
        warning: {
          light: '#D97706',
          dark: '#F59E0B',
        },
        error: {
          light: '#DC2626',
          dark: '#EF4444',
        },
        info: {
          light: '#2563EB',
          dark: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        // Theme-specific glows
        'glow-primary': '0 0 20px rgba(107, 122, 184, 0.3)',
        'glow-accent': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
        // Light theme shadows
        'light-sm': '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        'light-md': '0 4px 8px -2px rgb(0 0 0 / 0.08)',
        'light-lg': '0 12px 24px -4px rgb(0 0 0 / 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config

