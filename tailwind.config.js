/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,jsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#1a73e8',
					soft: '#e8f0fe',
				}
			}
		}
	},
	plugins: [],
}

