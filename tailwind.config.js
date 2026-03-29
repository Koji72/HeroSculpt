/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        teko: ['Teko', 'sans-serif'],
      },
      colors: {
        gray: {
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
        },
        slate: {
          950: '#020617',
        }
      },
      boxShadow: {
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      ringColor: {
        'gray-300': '#d1d5db',
      },
      ringOffsetColor: {
        'slate-900': '#020617',
      }
    },
  },
  plugins: [],
  ignoreFiles: [
    'backup_*/**/*',
    'UI EXAMPLES/**/*',
    'docs/ui-prototype/**/*',
    '**/node_modules/**/*',
    '**/.git/**/*'
  ]
} 