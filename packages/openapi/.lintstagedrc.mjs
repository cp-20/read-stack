export default {
	"*.{js,jsx,ts,tsx,json}": "biome format --write",
	"*.{js,jsx,ts,tsx}": "pnpm lint",
};
