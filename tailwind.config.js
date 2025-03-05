/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(160, 25%, 80%)",
        input: "hsl(160, 20%, 90%)",
        ring: "hsl(160, 50%, 60%)",
        background: "hsl(160, 40%, 96%)",
        primary: {
          DEFAULT: "hsl(160, 60%, 45%)", // Verde menta fuerte
          foreground: "hsl(160, 100%, 95%)",
        },
        foreground: "hsl(160, 80%, 20%)", // Verde oscuro para buen contraste
        muted: {
          DEFAULT: "hsl(160, 30%, 85%)",
          foreground: "hsl(160, 40%, 30%)",
        },
        secondary: {
          DEFAULT: "hsl(160, 50%, 40%)",
          foreground: "hsl(160, 100%, 90%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 85%, 50%)",
          foreground: "hsl(0, 100%, 90%)",
        },
        muted: {
          DEFAULT: "hsl(160, 30%, 80%)",
          foreground: "hsl(160, 40%, 30%)",
        },
        accent: {
          DEFAULT: "hsl(160, 70%, 45%)",
          foreground: "hsl(160, 100%, 95%)",
        },
        popover: {
          DEFAULT: "hsl(160, 30%, 90%)",
          foreground: "hsl(160, 50%, 30%)",
        },
        card: {
          DEFAULT: "white",
          foreground: "hsl(160, 50%, 25%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

