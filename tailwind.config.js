/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bazaar: {
          bg: '#100f26',
          surface: '#161538',
          card: '#1e1d49',
          cardHover: '#26255d',
          gold: '#f0a83c',
          goldLight: '#fdbf5e',
          goldDark: '#c78426',
          teal: '#3ddad0',
          purple: '#9b8bff',
          pink: '#f0728a',
          green: '#5fe08a',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(240, 168, 60, 0.35)',
        },
        amazon: {
          header: '#131921',
          subnav: '#232f3e',
          orange: '#FF9900',
          yellow: '#FFD814',
          yellowHover: '#F7CA00',
          buy: '#FFA41C',
          buyHover: '#FA8900',
          price: '#B12704',
          link: '#007185',
          linkHover: '#C7511F',
          bg: '#EAEDED',
          footer: '#232F3E',
          footerBottom: '#131A22',
          search: '#febd69',
          searchHover: '#f3a847',
          text: '#0F1111',
          muted: '#565959',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(240, 168, 60, 0.3)',
        'glow-teal': '0 0 25px -5px rgba(61, 218, 208, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(155, 139, 255, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
