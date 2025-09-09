import { defineConfig } from "cypress";

export default defineConfig({
	env: {
		API_URL: "http://proxy:80/api/",
	},
	e2e: {
		baseUrl: "http://proxy:80",
		supportFile: "cypress/support/e2e.ts",
		setupNodeEvents(on, config) {},
	},
	component: {
		devServer: {
			framework: "next",
			bundler: "webpack",
		},
	},
});
