import { renderHook, waitFor } from "@testing-library/react";
import { useResources, useResourceLoans } from "./useResource";
import api from "@/services/api";
import { createFakeResource, createFakeResourceLoan } from "@/types/resources";
import { ROUTES } from "@/config";

// Mock the API service
vi.mock("@/services/api");

describe("useResources", () => {
	const originalNodeEnv = process.env.NODE_ENV;

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();
		process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV
	});

	afterAll(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should return initial loading state", () => {
		const { result } = renderHook(() => useResources());

		expect(result.current.loading).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it("should fetch resources data successfully", async () => {
		const mockResources = [createFakeResource()];
		(api.get as vi.Mock).mockResolvedValueOnce({ data: mockResources });

		const { result } = renderHook(() => useResources());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resources).toEqual(mockResources);
		expect(result.current.error).toBeNull();
		expect(api.get).toHaveBeenCalledWith(ROUTES.RESOURCES);
	});

	it("should handle API error in development by returning mock data", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useResources());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resources).toBeDefined();
		expect(Array.isArray(result.current.resources)).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it("should handle API error in production by returning error message", async () => {
		process.env.NODE_ENV = "production";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useResources());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resources).toEqual([]);
		expect(result.current.error).toBe(
			"Não foi possível carregar os recursos."
		);
	});

	it("should handle empty data in development by returning mock data", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockResolvedValueOnce({ data: [] });

		const { result } = renderHook(() => useResources());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resources).toBeDefined();
		expect(Array.isArray(result.current.resources)).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it("should refetch resources data when refetch is called", async () => {
		const mockResources1 = [createFakeResource()];
		const mockResources2 = [createFakeResource()];

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockResources1 })
			.mockResolvedValueOnce({ data: mockResources2 });

		const { result } = renderHook(() => useResources());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.resources).toEqual(mockResources1);

		result.current.refetchResources();

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.resources).toEqual(mockResources2);
	});
});

describe("useResourceLoans", () => {
	const originalNodeEnv = process.env.NODE_ENV;

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();
		process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV
	});

	afterAll(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should return initial loading state", () => {
		const { result } = renderHook(() => useResourceLoans());

		expect(result.current.loading).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it("should fetch resource loans data successfully", async () => {
		const mockLoans = [createFakeResourceLoan()];
		(api.get as vi.Mock).mockResolvedValueOnce({ data: mockLoans });

		const { result } = renderHook(() => useResourceLoans());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resourceLoans).toEqual(mockLoans);
		expect(result.current.error).toBeNull();
		expect(api.get).toHaveBeenCalledWith(ROUTES.RESOURCE_LOANS);
	});

	it("should handle API error in development by returning mock data", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useResourceLoans());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resourceLoans).toBeDefined();
		expect(Array.isArray(result.current.resourceLoans)).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it("should handle API error in production by returning error message", async () => {
		process.env.NODE_ENV = "production";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useResourceLoans());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resourceLoans).toEqual([]);
		expect(result.current.error).toBe(
			"Não foi possível carregar os empréstimos de recursos."
		);
	});

	it("should handle empty data in development by returning mock data", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockResolvedValueOnce({ data: [] });

		const { result } = renderHook(() => useResourceLoans());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.resourceLoans).toBeDefined();
		expect(Array.isArray(result.current.resourceLoans)).toBe(true);
		expect(result.current.error).toBeNull();
	});

	it("should refetch resource loans data when refetch is called", async () => {
		const mockLoans1 = [createFakeResourceLoan()];
		const mockLoans2 = [createFakeResourceLoan()];

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockLoans1 })
			.mockResolvedValueOnce({ data: mockLoans2 });

		const { result } = renderHook(() => useResourceLoans());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.resourceLoans).toEqual(mockLoans1);

		result.current.refetchResourceLoans();

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.resourceLoans).toEqual(mockLoans2);
	});
});