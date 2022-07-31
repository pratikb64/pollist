/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/pages/**/**/*.{ts,tsx}',
    './src/pages/**/**/**/*.{ts,tsx}',
    './src/pages/**/**/**/**/*.{ts,tsx}',
    './src/components/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/components/**/**/*.{ts,tsx}',
    './src/components/**/**/**/*.{ts,tsx}',
    './src/components/**/**/**/**/*.{ts,tsx}',
    './src/components/**/**/**/**/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        depth: `
                0px 0px 2.2px rgba(0, 0, 0, 0.02),
                0px 0px 5.3px rgba(0, 0, 0, 0.028),
                0px 0px 10px rgba(0, 0, 0, 0.035),
                0px 0px 17.9px rgba(0, 0, 0, 0.042),
                0px 0px 33.4px rgba(0, 0, 0, 0.05),
                0px 0px 80px rgba(0, 0, 0, 0.07)
              ;`,
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
