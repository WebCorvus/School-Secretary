import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
}));

vi.mock("axios", () => ({
	default: {
		create: vi.fn(() => ({
			get: vi.fn(() => Promise.resolve({ data: [] })),
			post: vi.fn(() => Promise.resolve({ data: {} })),
			delete: vi.fn(() => Promise.resolve({ data: {} })),
			interceptors: {
				request: { use: vi.fn() },
				response: { use: vi.fn() },
			},
		})),
	},
}));

window.alert = vi.fn();
