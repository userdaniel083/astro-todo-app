// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				// Kleuren gebaseerd op het plaatje
				'vr-accent': '#2af6c5', // De felle Mintgroen
				'vr-dark': '#071022',   // De donkere kleur van de footer/card header
				'vr-pink': '#Fd3e81',   // De roze bel-knop
				'vr-bg': '#18141e',     // De lichte grijs/blauwe pagina achtergrond
			},
			fontFamily: {
				'vr-sans': ['Poppins', ...defaultTheme.fontFamily.sans],
			},
			borderRadius: {
				'2xl': '1rem',
			},
		},
	},
	plugins: [],
};