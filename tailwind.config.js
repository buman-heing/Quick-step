/** Same theme the Stitch export configured inline for the Tailwind CDN. */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        brandDark: '#111827',
        brandSlate: '#1f2937',
        brandGrey: '#374151',
        brandMuted: '#4b5563',
        brandGold: '#f59e0b',
        brandYellow: '#eab308',
        brandLightYellow: '#fef3c7',
        creamBg: '#f9fafb',
        cardBg: '#ffffff',
        borderGrey: '#e5e7eb'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
};
