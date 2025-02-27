
import type { Config } from "tailwindcss";
const { mauve, violet, red, blackA, gray } = require("@radix-ui/colors");
const {
	default: flattenColorPalette,
  } = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			boxShadow: {
				input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				...mauve,
				...violet,
				...red,
				...blackA,
				...gray,

			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				overlayShow: {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				contentShow: {
					from: {
						opacity: "0",
						transform: "translate(-50%, -48%) scale(0.96)",
					},
					to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
				},
			},
			animation: {
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				aurora: "aurora 60s linear infinite",
			},
		}
	},
	"animation": {
		shimmer: "shimmer 2s linear infinite",
		aurora: "aurora 60s linear infinite",
	},
	"keyframes": {
		shimmer: {
			from: {
				"backgroundPosition": "0 0"
			},
			to: {
				"backgroundPosition": "-200% 0"
			}
		},
		aurora: {
			from: {
				backgroundPosition: "50% 50%, 50% 50%",
			},
			to: {
				backgroundPosition: "350% 50%, 350% 50%",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), addVariablesForColors]
};

function addVariablesForColors({ addBase, theme }: any) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
	  Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);
   
	addBase({
	  ":root": newVars,
	});
  }

export default config;