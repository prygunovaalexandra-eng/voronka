/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['PPFraktion Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'mono': ['PPFraktion Mono', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
      },
      fontWeight: {
        'light': '300',
        'bold': '700',
      },
      colors: {
        // Custom design system colors
        'background-invert': 'var(--color-background-invert)',
        'text-invert': 'var(--color-text-invert)', 
        'text-invert-minor': 'var(--color-text-invert-minor)',
        'background': 'var(--color-background)',
        'text': 'var(--color-text)',
        'text-minor': 'var(--color-text-minor)',
        'surface': 'var(--color-surface)',
        'surface-secondary': 'var(--color-surface-secondary)',
        'hover': 'var(--color-hover)',
        'border': 'var(--color-border)',
        'border-focus': 'var(--color-border-focus)',
        'tag-bg': 'var(--color-tag-bg)',
        'tag-text': 'var(--color-tag-text)',
      }
    },
  },
  plugins: [],
} 