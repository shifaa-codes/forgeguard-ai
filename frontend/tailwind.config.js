/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base:       '#0B1114',
        elevated:   '#101A1F',
        surface1:   '#16323A',
        surface2:   '#3D4D55',
        surface3:   '#A79E9C',
        ink:        '#F5F1ED',
        'ink-soft': '#D3C3B9',
        muted:      '#8A8580',
        warm:       '#B58863',
        electric:   '#4A9EFF',
        violet2:    '#8B5CF6',
        success:    '#22C55E',
        warning:    '#F59E0B',
        danger:     '#EF4444',
        critical:   '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-warm':    '0 0 24px rgba(181, 136, 99, 0.35)',
        'glow-electric':'0 0 24px rgba(74, 158, 255, 0.35)',
        'glow-danger':  '0 0 24px rgba(239, 68, 68, 0.45)',
        'glow-success': '0 0 24px rgba(34, 197, 94, 0.35)',
      },
      backdropBlur: { xs: '2px' },
      animation: {
        'pulse-live': 'pulseLive 1.6s ease-in-out infinite',
        'scan':       'scan 3s linear infinite',
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'bbox-in':    'bboxIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        pulseLive: {
          '0%,100%': { opacity: 1, transform: 'scale(1)' },
          '50%':     { opacity: 0.4, transform: 'scale(0.85)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        bboxIn: {
          '0%':   { opacity: 0, transform: 'scale(0.85)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}