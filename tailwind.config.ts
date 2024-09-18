import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      height: {
        '90p': '90%',
        '10p': '10%',
        '50p': '50%',
        '70v': '70vh',
      },
      colors: {
        primary: {
          admin: '#acc5db', // '#fce7f0',
          DEFAULT: '#acc5db',
          client: '#dcf2fd',
        },
        secondary: {
          admin: '#5997bc', //'#f179af',
          DEFAULT: '#5997bc',
          client: '#2e3192',
        },
        third: {
          admin: '#acc5db', //'#f8c1d9',
          DEFAULT: '#acc5db',
          client: '#e1f4fd',
        },
        main: {
          500: '#4d7394', //5997bc
          400: '#5997bc',
          300: '#acc5db',
          200: '#acc5db',
          150: '#e3f1fa',
          100: '#e1f4fd',
          50: '#f0f3f6',
          gray: '#4b4b4a',
          DEFAULT: '#acc5db',
        },
        status: {
          blue: '#27aae1',
          1: '#84c2df',
          2: '#8aceb5',
          3: '#005586',
          4: '#dc5557',
          5: '#d1d3d4',
        },
        other: {
          blue: '#27aae1',
          interview: '#f05672',
          schedule: '#e0f1ef',
          treatement: '#afc1d5',
        },
        background: {
          normal: '#f1f3f6',
          bold: '#578fb1',
          gray: '#bbbaba',
          white: '#fefeff',
        },
        setting: {
          table: '#eaecef',
          border: '#dfe2e6',
        },
        label: {
          1: '#ed1849',
          2: '#f7a7ab',
          3: '#f16b8f',
          4: '#f26a57',
          5: '#9d435d',
          6: '#bfae9b',
          7: '#fff5ac',
          8: '#00a9c6',
        },
      },
      screens: {
        sssm: '360px',
        ssm: '375px',
        sm: '414px',
        xsm: '540px',
        md: '640px',
        lg: '768px',
        xl: '1024px',
        '2xl': '1280px',
        '3xl': '1536px',
        '4xl': '1792px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    'text-label-1',
    'text-label-2',
    'text-label-3',
    'text-label-4',
    'text-label-5',
    'text-label-6',
    'text-label-7',
    'text-label-8',
  ],
}
export default config
