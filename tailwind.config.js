/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1CA5F6',
          light: '#6DCBFB',
          dark: '#0D8FD9',
        },
        secondary: {
          DEFAULT: '#1B2540',
          variant: '#2D3D63',
        },
        brand: {
          bg: '#F4F7FF',
          border: '#DDE3F0',
          'border-light': '#EEF2FA',
          muted: '#5E6A8A',
          light: '#9AA3BB',
        },
        success: '#2DC875',
        warning: '#FFA726',
        danger: '#E63946',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(27,37,64,0.08)',
        'card-hover': '0 4px 24px rgba(27,37,64,0.14)',
      },
    },
  },
  plugins: [],
}
