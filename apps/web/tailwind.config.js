/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-bg': '#0B3D2E',
        'forest-surface': '#114A39',
        'forest-deep': '#072A20',
        'forest-border': '#1F5A46',
        'forest-gold': '#C9A24B',
        'forest-ivory': '#F6F1E4',
        forest: {
          bg: '#0B3D2E', // Primary background (deep emerald)
          surface: '#114A39', // Elevated surface
          deep: '#072A20', // Deepest surface (footer, inset panels)
          border: '#1F5A46', // Borders
          'border-strong': '#2B6D56', // Stronger borders
          ivory: '#F6F1E4', // Ivory (light cards, light sections)
          'ivory-card': '#FAF7F0',
          'ivory-border': '#E5DFD0',
          gold: '#C9A24B', // Gold (primary accent)
          'gold-light': '#E5CB86', // Light gold (headline highlights, numbers)
          'gold-dark': '#A37F33',
          'text-dark': '#F6F1E4', // Text on dark
          'muted-dark': '#BFD0C6', // Muted text on dark
          'muted-dark-subtle': '#9DB5A8',
          'text-ivory': '#0B3D2E', // Text on ivory
          'muted-ivory': '#4F6B5E', // Muted text on ivory
          success: '#7BC49A',
          warning: '#E5CB86',
          error: '#E27C6B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      borderRadius: {
        'btn': '6px',
        'card': '12px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      },
    },
  },
  plugins: [],
};
