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

vi.mock("@/components/ui/dropdown-menu", () => {
	const React = require("react");
	return {
		DropdownMenu: ({ children }: { children: any }) =>
			React.createElement("div", null, children),
		DropdownMenuTrigger: ({ children }: { children: any }) =>
			React.createElement("div", null, children),
		DropdownMenuContent: ({ children }: { children: any }) =>
			React.createElement("div", null, children),
		DropdownMenuItem: ({ children, onClick }: { children: any; onClick: any }) =>
			React.createElement("div", { onClick }, children),
	};
});

window.alert = vi.fn();

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
