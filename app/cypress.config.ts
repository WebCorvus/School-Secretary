import { defineConfig } from "cypress";

export default defineConfig({
	env: {
		API_URL: "http://localhost:8080/api/",
		LOGIN_URL: "http://localhost:8080/api/users/token/",
	},
	e2e: {
		baseUrl: "http://localhost:8080",
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
