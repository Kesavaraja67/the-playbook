import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // These colors are backed by CSS variables defined in src/styles/design-system.css.
      colors: {
        "electric-cyan": "var(--electric-cyan)",
        "neon-magenta": "var(--neon-magenta)",
        "plasma-purple": "var(--plasma-purple)",
        "quantum-gold": "var(--quantum-gold)",

        "void-dark": "var(--void-dark)",
        "space-blue": "var(--space-blue)",
        "nebula-purple": "var(--nebula-purple)",

        "glow-white": "var(--glow-white)",
        "frost-blue": "var(--frost-blue)",
        "warning-amber": "var(--warning-amber)",
      },
    },
  },
} satisfies Config;
