module.exports = {
	env: {
		es2021: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json",
		ecmaFeatures: {
			jsx: true,
		},
		sourceType: "module",
	},
	extends: [
		"@vercel/style-guide/eslint/node",
		"@vercel/style-guide/eslint/typescript",
	]
		.map(require.resolve)
		.concat([
			"eslint:recommended",
			"plugin:@typescript-eslint/recommended",
			"google",
			"prettier",
			"plugin:drizzle/recommended",
		]),
	plugins: ["@typescript-eslint", "drizzle"],
	rules: {
		"@typescript-eslint/no-unsafe-assignment": ["off"],
		"@typescript-eslint/no-unsafe-argument": ["off"],
		"@typescript-eslint/no-unsafe-call": ["off"],
		"@typescript-eslint/no-unsafe-member-access": ["off"],
		"@typescript-eslint/no-unsafe-return": ["off"],
		"no-await-in-loop": ["off"],
		"require-jsdoc": ["off"],
		"valid-jsdoc": ["off"],
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				varsIgnorePattern: "^_",
				argsIgnorePattern: "^_",
			},
		],
		"no-unused-vars": ["off"],
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{
				prefer: "type-imports",
			},
		],
		"no-console": ["error", { allow: ["warn", "error"] }],
		"import/order": [
			"error",
			{
				groups: [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
				],
				"newlines-between": "always",
			},
		],
		"@typescript-eslint/explicit-function-return-type": "off",
		"unicorn/filename-case": [
			"error",
			{
				cases: {
					camelCase: true,
					pascalCase: true,
				},
			},
		],
	},
	overrides: [
		{
			files: ["**/*.d.ts"],
			rules: {
				"@typescript-eslint/consistent-type-imports": "off",
			},
		},
	],
};
