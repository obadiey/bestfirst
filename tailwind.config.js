/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf5f7',
          100: '#f5eaef',
          200: '#edd6e0',
          300: '#dfb5c6',
          400: '#cc89a5',
          500: '#b86688',
          600: '#a04d6d',
          700: '#863d57',
          800: '#703549',
          900: '#5f303f',
        },
        inviter: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b8fc',
          400: '#7f93f8',
          500: '#5b6cf1',
          600: '#4550e5',
          700: '#3840ca',
          800: '#3038a3',
          900: '#2d3481',
        },
        invitee: {
          50: '#fef2f3',
          100: '#fde6e8',
          200: '#fbd0d6',
          300: '#f7aab5',
          400: '#f17a8e',
          500: '#e54d6a',
          600: '#d12d54',
          700: '#b02046',
          800: '#931e40',
          900: '#7e1d3c',
        },
        neutral: {
          25: '#fcfcfd',
          50: '#f9fafb',
          75: '#f5f6f7',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'modal': '0 20px 60px -12px rgb(0 0 0 / 0.15)',
      },
    },
  },
  plugins: [],
};
