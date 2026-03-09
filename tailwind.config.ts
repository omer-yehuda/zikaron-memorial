import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0a0a0f', card: '#0f1117' },
        gold: { DEFAULT: '#f4a261', fade: '#e8874a' },
        electric: '#00b4d8',
        danger: '#e63946',
        muted: '#a8b2c1',
        hebrew: '#ffd700',
        text: '#f0f0f0',
        glass: 'rgba(15,25,50,0.6)',
      },
      fontFamily: {
        he: ['"Frank Ruhl Libre"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        candleFlicker: {
          '0%,100%': { transform: 'scaleX(1) scaleY(1)', opacity: '0.9' },
          '25%': { transform: 'scaleX(0.9) scaleY(1.1) translateX(-1px)', opacity: '1' },
          '50%': { transform: 'scaleX(1.1) scaleY(0.9) translateX(1px)', opacity: '0.85' },
          '75%': { transform: 'scaleX(0.95) scaleY(1.05) translateX(-0.5px)', opacity: '0.95' },
        },
        glow: {
          '0%,100%': { filter: 'drop-shadow(0 0 4px rgba(244,162,97,0.6))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(244,162,97,1))' },
        },
        pinDrop: {
          '0%': { transform: 'translateY(-20px) scale(0.8)', opacity: '0' },
          '60%': { transform: 'translateY(4px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'fade-in-fast': 'fadeIn 0.2s ease',
        'candle-flicker': 'candleFlicker 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pin-drop': 'pinDrop 0.4s ease',
      },
    },
  },
  plugins: [],
};

export default config;
