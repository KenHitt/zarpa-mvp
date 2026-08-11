import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { forest: '#1F4D3A', amber: '#E0A430', cream: '#FBF7ED' }, fontFamily: { display: ['Cambria', 'Georgia', 'serif'] } } }, plugins: [] };
export default config;
