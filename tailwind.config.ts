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
		"./components2/**/*.{js,ts,jsx,tsx,mdx}",
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
				// Hindu mythology inspired colors
				saffron: {
					100: "hsl(var(--saffron-100))",
					200: "hsl(var(--saffron-200))",
					300: "hsl(var(--saffron-300))",
					400: "hsl(var(--saffron-400))",
					500: "hsl(var(--saffron-500))", // Sacred Saffron
					600: "hsl(var(--saffron-600))",
					700: "hsl(var(--saffron-700))",
					800: "hsl(var(--saffron-800))",
					900: "hsl(var(--saffron-900))"
				},
				kumkum: {
					50: "hsl(var(--kumkum-50))",
					100: "hsl(var(--kumkum-100))",
					200: "hsl(var(--kumkum-200))",
					300: "hsl(var(--kumkum-300))",
					400: "hsl(var(--kumkum-400))",
					500: "hsl(var(--kumkum-500))",
					600: "hsl(var(--kumkum-600))",
					700: "hsl(var(--kumkum-700))",
					800: "hsl(var(--kumkum-800))",
					900: "hsl(var(--kumkum-900))"
				},
				sacred: {
					gold: "hsl(var(--sacred-gold))",
					copper: "hsl(var(--sacred-copper))",
					saffron: "hsl(var(--sacred-saffron))",
					sandal: "hsl(var(--sacred-sandal))",
					vermilion: "hsl(var(--sacred-vermilion))"
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
				shimmer: {
					from: { backgroundPosition: "0 0" },
					to: { backgroundPosition: "-200% 0" },
				},
				meteor: {
					"0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
					"70%": { opacity: "1" },
					"100%": {
						transform: "rotate(215deg) translateX(-500px)",
						opacity: "0",
					},
				},
				float: {
					"0%, 100%": { transform: 'translateY(0)' },
					"50%": { transform: 'translateY(-20px)' },
				},
				glow: {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.6" },
				},
				'divine-spin': {
					"0%": { transform: 'rotate(0deg)' },
					"100%": { transform: 'rotate(360deg)' },
				},
				scroll: {
					"0%": { transform: 'translateX(100%)' },
					"100%": { transform: 'translateX(-100%)' },
				},
				shine: {
					"0%": { left: '-100%' },
					"50%, 100%": { left: '100%' }
				},
				'sacred-shimmer': {
					"0%": { backgroundPosition: '200% 50%' },
					"100%": { backgroundPosition: '-200% 50%' },
				},
				twinkle: {
					"0%, 100%": { opacity: "1", transform: "scale(1)" },
					"50%": { opacity: "0.5", transform: "scale(0.9)" }
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
			animation: {
				overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
				shimmer: "shimmer 2s linear infinite",
				"meteor-effect": "meteor 5s linear infinite",
				'spin-slow': 'spin 20s linear infinite',
				'twinkle': 'twinkle 3s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'divine-spin': 'divine-spin 20s linear infinite',
				'scroll': 'scroll 20s linear infinite',
				'shine': 'shine 8s linear infinite',
				'sacred-shimmer': 'sacred-shimmer 2s linear infinite',
				aurora: "aurora 60s linear infinite",
			},
		}
	},
	plugins: [require("tailwindcss-animate"), require("daisyui"), addVariablesForColors],
	daisyui: {
		themes: false, // Remove themes to use custom CSS
		base: true,
		styled: true,
		utils: true,
	}
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