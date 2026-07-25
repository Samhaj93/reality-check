/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Provenance palette — the only place these hues are named. Kept
        // separate from the brand accent on purpose: provenance is semantic,
        // and must never read as decoration.
        registry: '#0d9488', // teal-600  · verifiable public record
        estimate: '#d97706', // amber-600 · our modelled figure
        claim: '#e11d48', // rose-600  · seller-supplied, unverified
        pass: '#0d9488',
        fail: '#e11d48',

        // Xeleration house palette, taken from the exercise brief.
        brand: {
          ink: '#2B2456', // headings and body — the indigo the brief sets text in
          deep: '#1B1147', // the cover ground; used for the Decide sheet header
          violet: '#6E5FD0', // interactive accent
          'violet-deep': '#5748B8', // accent at text/border contrast on light
          mint: '#3FC8A9', // the swoosh; used sparingly as a highlight
          azure: '#3B8FC7',
          lavender: '#F0EFF7', // page ground and quiet panels
          line: '#DCD8EC', // hairlines on lavender
        },
      },
    },
  },
  plugins: [],
}
