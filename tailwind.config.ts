/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        secondary: '#38BDF8',
        cta: '#F97316',
        background: '#F0F9FF',
        text: '#0C4A6E',
        aurora: {
          cyan: '#00FFFF',
          magenta: '#FF00FF',
          yellow: '#FFFF00',
          blue: '#0066FF',
          green: '#00FF66',
        },
      },
      fontFamily: {
        baloo: ['var(--font-baloo)'],
        comic: ['var(--font-comic)'],
        puhui: ['var(--font-puhui)'],
      },
      animation: {
        'aurora-flow': 'auroraFlow 12s ease infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        auroraFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

