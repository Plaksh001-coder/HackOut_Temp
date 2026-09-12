/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#031E19',
          900: '#062D26',
          850: '#0A3B32',
          800: '#0D473D',
          700: '#115C50',
          600: '#177969',
          500: '#1C9683',
          100: '#D5EFEB',
          50: '#EDF9F7',
        },
        mint: {
          500: '#10B981',
          400: '#34D399',
          300: '#6EE7B7',
          200: '#A7F3D0',
          100: '#D1FAE5',
          50: '#ECFDF5',
        },
        sage: {
          50: '#F4F9F6',
          100: '#E9F2EE',
          200: '#D6E6DF',
          300: '#BDD6CB',
          400: '#9DBFB1',
          500: '#7FA897',
        },
        industrial: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(6, 45, 38, 0.06), 0 2px 6px -1px rgba(6, 45, 38, 0.03)',
        'card': '0 10px 30px -4px rgba(6, 45, 38, 0.08), 0 4px 10px -2px rgba(6, 45, 38, 0.04)',
        'elevated': '0 20px 40px -8px rgba(6, 45, 38, 0.12), 0 8px 16px -4px rgba(6, 45, 38, 0.06)',
      }
    },
  },
  plugins: [],
}
