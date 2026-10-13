/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        areia: { 50: "#FBF8F2", 100: "#F4ECDD", 200: "#E8D9BC", 300: "#D6BE92" },
        mata: { 400: "#3E8E6A", 500: "#2A6F51", 600: "#1E5640", 700: "#163F2F", 900: "#0B1F17" },
        rio: { 400: "#3BA7B8", 500: "#1F8597" },
        coral: { 400: "#F08A5D", 500: "#E06A3A" },
        noite: { 800: "#121614", 900: "#0A0D0B" },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,.06), 0 20px 50px -20px rgba(0,0,0,.6)",
      },
      keyframes: {
        pulsering: { "0%": { boxShadow: "0 0 0 0 rgba(240,138,93,.6)" }, "100%": { boxShadow: "0 0 0 14px rgba(240,138,93,0)" } },
        rise: { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "none" } },
        "shimmer-slide": { to: { transform: "translate(calc(100cqw - 100%), 0)" } },
        "spin-around": {
          "0%": { transform: "translateZ(0) rotate(0)" },
          "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
          "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
          "100%": { transform: "translateZ(0) rotate(360deg)" }
        },
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(calc(-100% - var(--gap, 1rem)))" },
          to: { transform: "translateX(0)" },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
      },
      animation: { 
        pulsering: "pulsering 1.4s infinite", 
        rise: "rise .35s ease-out both",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        shimmer: "shimmer 2s linear infinite",
        marquee: "marquee var(--duration, 30s) linear infinite",
        "marquee-reverse": "marquee-reverse var(--duration, 30s) linear infinite",
        "border-beam": "border-beam calc(var(--duration, 15) * 1s) infinite linear",
      },
    },
  },
  plugins: [],
};
