import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'draix-bg-light': 'var(--draix-bg-light)',
        'draix-bg-dark': 'var(--draix-bg-dark)',
        'draix-surface-light': 'var(--draix-surface-light)',
        'draix-surface-dark': 'var(--draix-surface-dark)',
        'draix-border-light': 'var(--draix-border-light)',
        'draix-border-dark': 'var(--draix-border-dark)',
        'draix-text-light': 'var(--draix-text-light)',
        'draix-text-dark': 'var(--draix-text-dark)',
        'draix-muted': 'var(--draix-muted-light)',
        'draix-hover-light': 'var(--draix-hover-light)',
        'draix-hover-dark': 'var(--draix-hover-dark)',
        'draix-gold': 'var(--draix-gold)',
        'draix-gold-hover': 'var(--draix-gold-hover)',
        'draix-gold-light': 'var(--draix-gold-light)',
        'draix-gold-dark': 'var(--draix-gold-dark)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
