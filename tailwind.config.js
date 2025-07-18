/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF2E74',
        'primary-hover': '#B06B94',
        secondary: '#2C2C2C',
        accent: '#867B9F',
        background: '#F5F5F5',
        'card-bg': '#F5EAE3',
        fertile: '#E2F0CB',
      },
      fontFamily: {
        sans: [
          'SF Pro Rounded',
          'Nunito',
          'ui-rounded',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      borderRadius: {
        'container': '16px',
      },
      spacing: {
        'section': '2rem',
        'safe-area-pb': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
