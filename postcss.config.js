export default {
  plugins: {
    '@tailwindcss/postcss': {
      config: './tailwind.config.js',
      // Exclude backup folders from scanning
      content: [
        "./index.html",
        "./App.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
      ],
    },
    autoprefixer: {},
  },
} 