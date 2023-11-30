import { relative } from "path";
import { ESLint } from "eslint";

const buildEslintCommand = (filenames) =>
	`next lint --fix --file ${filenames
		.map((f) => relative(process.cwd(), f))
		.join(" --file ")}`;

const removeIgnoredFiles = async (files) => {
	const eslint = new ESLint();
	const isIgnored = await Promise.all(
		files.map((file) => {
			return eslint.isPathIgnored(file);
		}),
	);
	const filteredFiles = files.filter((_, i) => !isIgnored[i]);
	return filteredFiles.join(" ");
};

const buildCommand = (command) => async (filenames) => {
	const filteredFiles = await removeIgnoredFiles(filenames);
	return `${command} ${filteredFiles}`;
};

export default {
	"*.{js,jsx,ts,tsx}": buildEslintCommand,
	"*.{js,jsx,ts,tsx,css,scss}": buildCommand("pnpm stylelint"),
	"*.{css,scss,js,jsx,ts,tsx,json,md}": buildCommand("biome format --write"),
};
