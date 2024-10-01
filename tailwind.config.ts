import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      defaultTheme: 'dark',
      layout: {
        radius: {
          small: '4px', // rounded-small
          medium: '6px', // rounded-medium
          large: '8px', // rounded-large
        },
      },
    }),
  ],
} satisfies Config;
