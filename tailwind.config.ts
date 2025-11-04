import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors based on your palette
        primary: {
          50: '#f0f6ff',   // Very light blue
          100: '#e0ecff',  // Light blue tint
          200: '#b8daff',  // Lighter version of 8FABD4
          300: '#8FABD4',  // Your light blue
          400: '#6a8bc7',  // Between your light and dark blue
          500: '#4A70A9',  // Your main blue
          600: '#3d5d8f',  // Darker version
          700: '#314a75',  // Even darker
          800: '#263a5e',  // Very dark blue
          900: '#1a2940',  // Almost black blue
          950: '#000000',  // Your black
        },
        // Secondary/accent colors
        secondary: {
          50: '#fefefe',   // Almost white
          100: '#EFECE3',  // Your cream/beige
          200: '#e6e1d5',  // Slightly darker cream
          300: '#ddd6c7',  // Medium cream
          400: '#d4cab9',  // Darker cream
          500: '#c5b8a3',  // Brown tint
          600: '#b0a088',  // Light brown
          700: '#8f8169',  // Medium brown
          800: '#6e624b',  // Dark brown
          900: '#4d432e',  // Very dark brown
        },
        // Neutral grays (based on your black)
        neutral: {
          50: '#f9f9f9',   // Almost white
          100: '#f1f1f1',  // Very light gray
          200: '#e5e5e5',  // Light gray
          300: '#d1d1d1',  // Medium light gray
          400: '#a3a3a3',  // Medium gray
          500: '#737373',  // Medium dark gray
          600: '#525252',  // Dark gray
          700: '#404040',  // Very dark gray
          800: '#262626',  // Almost black
          900: '#171717',  // Very dark
          950: '#000000',  // Your pure black
        },
        // Functional colors with your palette influence
        success: {
          50: '#f0f9ff',
          500: '#4A70A9',  // Using your blue for success
          600: '#3d5d8f',
        },
        warning: {
          50: '#fefcf0',
          500: '#d4cab9',  // Using cream tone for warning
          600: '#b0a088',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',  // Traditional red for errors
          600: '#dc2626',
        },
        info: {
          50: '#f0f6ff',
          500: '#8FABD4',  // Your light blue for info
          600: '#6a8bc7',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Custom gradients using your palette
        'brand-gradient': 'linear-gradient(135deg, #4A70A9 0%, #8FABD4 100%)',
        'hero-gradient': 'linear-gradient(135deg, #000000 0%, #4A70A9 50%, #8FABD4 100%)',
        'subtle-gradient': 'linear-gradient(135deg, #EFECE3 0%, #8FABD4 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
export default config