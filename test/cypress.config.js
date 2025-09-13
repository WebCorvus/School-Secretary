import { defineConfig } from "cypress";

export default defineConfig({
	env: {
		API_URL: "http://proxy:80/api/",
		LOGIN_URL: "http://proxy:80/api/users/token/",
		TEST_USER_EMAIL: "test@email.com",
		TEST_USER_PASSWORD: "testpassword",
	},
	e2e: {
		baseUrl: "http://proxy:80",
		supportFile: "cypress/support/e2e.js",
		setupNodeEvents(on, config) {},
	},
	component: {
		devServer: {
			framework: "next",
			bundler: "webpack",
		},
	},
});
