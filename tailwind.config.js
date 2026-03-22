/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        cream: '#FAF7F2',
        'warm-white': '#FFFDF9',
        ink: '#1C1917',
        'soft-brown': '#78716C',
        gold: '#C9A84C',
        'gold-light': '#F5E6B8',
        sage: '#7C9A7E',
        rose: '#C47B73',
        border: '#E8E0D5',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
