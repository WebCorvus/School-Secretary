import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

describe("useIsMobile", () => {
	const MOBILE_BREAKPOINT = 768;
	let originalMatchMedia: (query: string) => MediaQueryList;
	let mockMediaQueryList: MediaQueryList & { 
		dispatchEvent: vi.Mock;
		_listeners: ((event: { matches: boolean }) => void)[];
	};

	beforeEach(() => {
		originalMatchMedia = window.matchMedia;
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => {
				mockMediaQueryList = {
					matches: false,
					media: query,
					onchange: null,
					addEventListener: vi.fn((_, handler) => {
						mockMediaQueryList._listeners.push(handler);
					}),
					removeEventListener: vi.fn((_, handler) => {
						mockMediaQueryList._listeners = mockMediaQueryList._listeners.filter(
							(l) => l !== handler
						);
					}),
					dispatchEvent: vi.fn((event) => {
						mockMediaQueryList._listeners.forEach((listener) =>
							listener(event as unknown as MediaQueryListEvent)
						);
					}),
					_listeners: [],
				};
				return mockMediaQueryList;
			}),
		});
	});

	afterEach(() => {
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: originalMatchMedia,
		});
	});

	it("should return false for desktop width initially", () => {
		Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it("should return true for mobile width initially", () => {
		Object.defineProperty(window, "innerWidth", { writable: true, value: 320 });
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	it("should update to mobile when resized to mobile width", () => {
		Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);

		act(() => {
			Object.defineProperty(window, "innerWidth", { writable: true, value: 320 });
			mockMediaQueryList.matches = true;
			mockMediaQueryList.dispatchEvent({ matches: true });
		});

		expect(result.current).toBe(true);
	});

	it("should update to desktop when resized to desktop width", () => {
		Object.defineProperty(window, "innerWidth", { writable: true, value: 320 });
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);

		act(() => {
			Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
			mockMediaQueryList.matches = false;
			mockMediaQueryList.dispatchEvent({ matches: false });
		});

		expect(result.current).toBe(false);
	});
});