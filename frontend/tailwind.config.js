/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff00ff',
          cyan: '#00ffff',
          yellow: '#ffff00',
          purple: '#9900ff',
          blue: '#0066ff',
        },
        cyberpunk: {
          dark: '#0f0f1a',
          darker: '#070714',
          light: '#2a2a40',
          accent: '#ff00ff',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.5s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: 1,
            filter: 'brightness(1) blur(0px)'
          },
          '50%': { 
            opacity: 0.8,
            filter: 'brightness(1.2) blur(1px)'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(to right, #1a1a2e 1px, transparent 1px), linear-gradient(to bottom, #1a1a2e 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};