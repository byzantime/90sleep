/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Dark Braun-inspired palette
        'braun-black': '#0f0f0f',
        'braun-dark': '#1a1a1a',
        'braun-gray': '#2a2a2a',
        'braun-light-gray': '#3a3a3a',
        'braun-amber': '#d4af37',
        'braun-gold': '#fbbf24',
        'braun-warm': '#f59e0b',
        'braun-text': '#e5e5e5',
        'braun-text-dim': '#a0a0a0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
        'display': ['4rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'xl-time': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'braun': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'braun-lg': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'braun-glow': '0 0 20px rgba(212, 175, 55, 0.15)',
      },
      borderRadius: {
        'braun': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
