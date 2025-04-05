// module.exports = {
//     content: [
//       "./src/**/*.{html,js,jsx,ts,tsx}",
//     ],
//     theme: {
//       extend: {},
//     },
//     plugins: [],
//   }
  
// tailwind.config.js

// Helper function to generate shades (Optional but useful if you need more standard shades)
// function generateColorShades(hexColor) { ... } // You'd need a library or logic for this

// tailwind.config.js

// Helper function to generate shades (Optional but useful if you need more standard shades)
// function generateColorShades(hexColor) { ... } // You'd need a library or logic for this

module.exports = {
  // Ensure content path covers all files using Tailwind classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html" // Include index.html if classes are used there
  ],
  // --- ADD THE CUSTOM THEME DEFINITION HERE ---
  theme: {
    // Define base font family
    fontFamily: {
      // Sets 'font-sans' utility class
      sans: ["Open Sans", "ui-sans-serif", "system-ui", "sans-serif", "\"Apple Color Emoji\"", "\"Segoe UI Emoji\"", "\"Segoe UI Symbol\"", "\"Noto Color Emoji\""]
    },
    extend: {
      // Extend fonts if needed (e.g., for a specific title font class)
      fontFamily: {
         // Creates 'font-title' utility class
        'title': ["Lato", "ui-sans-serif", "system-ui", "sans-serif", "\"Apple Color Emoji\"", "\"Segoe UI Emoji\"", "\"Segoe UI Symbol\"", "\"Noto Color Emoji\""]
        // 'body' is redundant if 'sans' is already Open Sans
        // 'body': ["Open Sans", "ui-sans-serif", ... ]
      },
      // Define custom colors under extend
      colors: {
        // Neutral palette from your example
        neutral: {
          "50": "#f7f7f7",
          "100": "#eeeeee",
          "200": "#e0e0e0",
          "300": "#cacaca",
          "400": "#b1b1b1",
          "500": "#999999",
          "600": "#7f7f7f",
          "700": "#676767",
          "800": "#545454",
          "900": "#464646",
          "950": "#282828"
        },
        // Primary (reddish) palette from your example
        // Allows using classes like bg-primary-600, text-primary-100 etc.
        primary: {
          "50": "#fdf3f3",
          "100": "#fde3e4",
          "200": "#fcccce",
          "300": "#f8a9ad",
          "400": "#f2777d",
          "500": "#e74c53",
          "600": "#d32f37",
          "700": "#be262d", // Used as default in example theme object
          "800": "#932126",
          "900": "#7a2226",
          "950": "#420d0f",
          "DEFAULT": "#be262d" // Sets what 'bg-primary', 'text-primary' means
        }
        // You can add 'secondary' accent colors here too if needed
        // secondary: { ... }
      },



      "overrides": [
    {
      // Target config files in the project root
      "files": ["*.js", "*.cjs"], // Adjust glob pattern if needed e.g., ["tailwind.config.js", "postcss.config.js"]
      "excludedFiles": ["src/**/*.*"], // Don't apply this override to your src code
      "env": {
        "node": true,     // Enable Node.js global variables and Node.js scoping.
        "commonjs": true  // Explicitly allow CommonJS syntax like module.exports
      },
      "parserOptions": {
        // Tell parser this is not an ES module
        "sourceType": "script",
        "ecmaVersion": "latest" // Or your project's JS version
      }
    },
    {
      // Your configuration for source files (React components)
      "files": ["src/**/*.{js,jsx,ts,tsx}"],
      "parserOptions": {
        "sourceType": "module", // Assume src uses ES Modules
        "ecmaVersion": "latest",
        "ecmaFeatures": {
          "jsx": true
        }
      },
      "env": {
        "browser": true,  // Enable browser globals like 'window', 'document'
        "es2021": true,
        "node": false     // Node environment likely not needed for src files
      }
  


      // Define custom scales if needed (optional, Tailwind defaults often suffice)
      // Keep these ONLY if you specifically need these exact values and scales
      // Otherwise, remove them and use Tailwind's standard scales (e.g., text-sm, text-lg, rounded-md, rounded-full, p-2, p-4)
      // fontSize: {
      //   'xs': ["12px", { lineHeight: "19.2px" }],
      //   'sm': ["14px", { lineHeight: "21px" }],
      //    // ... include all sizes from your example config IF needed ...
      // },
      // borderRadius: {
      //   'none': '0px',
      //   'sm': '6px',
      //   'DEFAULT': '12px',
      //   'md': '18px',
      //   // ... include all radii from your example config IF needed ...
      //   'full': '9999px'
      // },
      // spacing: {
      //   '0': '0px',
      //   '1': '4px',
      //   // ... include all spacing units from your example config IF needed ...
      //   // Note: This overrides Tailwind's default spacing scale entirely if not under 'extend'
      // },
    }, // End extend
  }, // End theme
  // --- END CUSTOM THEME ---
  plugins: [],
  // --- IMPORTANT SELECTOR (Keep or Remove?) ---
  // If you keep this, wrap your app/layout in <div id="webcrumbs">
  // If you remove this, Tailwind styles will apply globally without the wrapper
  important: '#webcrumbs'
  // --- END ---
} 