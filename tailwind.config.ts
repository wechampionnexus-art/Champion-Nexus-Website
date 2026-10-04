import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F56624',
          'orange-hover': '#E95516',
          'orange-light': '#FDEEE6',
        },
        surface: {
          white: '#FFFFFF',
          cream: '#FAF9F6',
          gray: '#F3F4F6',
        },
        ink: {
          DEFAULT: '#242424',
          muted: '#666666',
          soft: '#8A8A8A',
        },
        line: '#E5E7EB',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        cardHover: '0 8px 24px -8px rgba(245,102,36,0.18)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 36s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
