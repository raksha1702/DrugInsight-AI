/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          bg: '#FAFBF9',
          sage: '#A8CDB5',
          'sage-dark': '#2E5A44',
          'sage-hover': '#244836',
          'sage-light': '#EAF3ED',
          blue: '#BDD7EE',
          'blue-dark': '#2B5A82',
          'blue-light': '#EEF5FB',
          lavender: '#D9C9F0',
          'lavender-dark': '#5D4487',
          'lavender-light': '#F4EEFB',
          peach: '#F6D8C8',
          'peach-dark': '#8E4D2B',
          'peach-light': '#FDF3EE',
          mint: '#EAF5ED',
          card: '#FFFFFF',
          text: '#293B42',
          'text-muted': '#72818A',
          border: '#E5EBE8',
          warning: '#FFF1D9',
          'warning-border': '#FDE2B3',
          'warning-text': '#8F5C14',
          coral: '#F9D5D5',
          'coral-dark': '#9A3434'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 59, 66, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(41, 59, 66, 0.07)',
        'soft-xl': '0 20px 40px -8px rgba(41, 59, 66, 0.09)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
