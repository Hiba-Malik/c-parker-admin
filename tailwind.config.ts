import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B158E',
        background: '#141429',
        'button-from': '#150F3E',
        'button-mid': '#200F46',
        'button-to': '#3A126F',
        'border-from': '#324AB9',
        'border-to': '#4B158E',
      },
    },
  },
  plugins: [],
}
export default config


