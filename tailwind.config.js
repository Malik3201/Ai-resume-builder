/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: 'hsl(var(--brand))',
        accent: 'hsl(var(--accent))',
        muted: 'hsl(var(--muted))',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['EB Garamond', 'ui-serif', 'Georgia', 'serif'],
      },
      spacing: {
        'section-y': '5rem', // 80px / 20 * 0.25rem
        'item-y': '2rem', // 32px / 8 * 0.25rem
        'gutter': '6rem', // 96px / 24 * 0.25rem
      },
      width: {
        'a4': '210mm',
        'sidebar': '340px',
      },
      minHeight: {
        'a4': '297mm',
      },
      screens: {
        'print': {'raw': 'print'},
      },
    },
  },
  plugins: [],
}

