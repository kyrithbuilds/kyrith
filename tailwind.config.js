/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#021D41',
        primaryLight: '#0B2A5A',
        secondary: '#4172F4',
        secondaryLight: '#6A92FF',
        background: '#FFFFFF',
        section: '#F5F8FF',
        textPrimary: '#021D41',
        textSecondary: '#64748B',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(2, 29, 65, 0.06), 0 1px 2px rgba(2, 29, 65, 0.04)',
        'card-hover':
          '0 12px 40px -12px rgba(2, 29, 65, 0.12), 0 4px 16px -4px rgba(65, 114, 244, 0.1)',
        soft: '0 1px 3px rgba(2, 29, 65, 0.05), 0 1px 2px rgba(2, 29, 65, 0.04)',
        // Sticky navbar on scroll (premium, not heavy)
        nav: '0 4px 24px -6px rgba(2, 29, 65, 0.07), 0 2px 8px -2px rgba(2, 29, 65, 0.05)',
      },
      spacing: {
        14: '3.5rem',
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
}
