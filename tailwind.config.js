/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Provenance palette — the only place these hues are named.
        registry: '#0d9488', // teal-600  · verifiable public record
        estimate: '#d97706', // amber-600 · our modelled figure
        claim: '#e11d48', // rose-600  · seller-supplied, unverified
        pass: '#0d9488',
        fail: '#e11d48',
      },
    },
  },
  plugins: [],
}
