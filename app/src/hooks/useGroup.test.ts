import { renderHook, waitFor } from "@testing-library/react";
import { useGroups } from "./useGroup";
import api from "@/services/api";
import { createFakeGroup } from "@/types/group";
import { GROUP_ROUTE } from "@/config";

// Mock the API service
vi.mock("@/services/api");

describe("useGroups", () => {
	const originalNodeEnv = process.env.NODE_ENV;

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();
		process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV
	});

	afterAll(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should return initial loading state and empty groups", () => {
		const { result } = renderHook(() => useGroups());

		expect(result.current.loading).toBe(true);
		expect(result.current.groups).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	it("should fetch group data successfully", async () => {
		const mockGroups = Array.from({ length: 3 }, () => createFakeGroup());
		(api.get as vi.Mock).mockResolvedValueOnce({ data: mockGroups });

		const { result } = renderHook(() => useGroups());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.groups).toEqual(mockGroups);
		expect(result.current.error).toBeNull();
		expect(api.get).toHaveBeenCalledWith("/api/school/groups/");
	});

	it("should handle API error in development by returning mock groups", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useGroups());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.groups.length).toBe(5);
		expect(result.current.error).toBeNull();
	});

	it("should handle API error in production by returning error message", async () => {
		process.env.NODE_ENV = "production";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useGroups());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.groups).toEqual([]);
		expect(result.current.error).toBe("Não foi possível carregar as turmas.");
	});

	it("should handle empty data in development by returning mock groups", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockResolvedValueOnce({ data: [] });

		const { result } = renderHook(() => useGroups());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.groups.length).toBe(5);
		expect(result.current.error).toBeNull();
	});

	it("should refetch group data when refetchGroups is called", async () => {
		const mockGroups1 = Array.from({ length: 2 }, () => createFakeGroup());
		const mockGroups2 = Array.from({ length: 5 }, () => createFakeGroup());

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockGroups1 })
			.mockResolvedValueOnce({ data: mockGroups2 });

		const { result } = renderHook(() => useGroups());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.groups).toEqual(mockGroups1);

		result.current.refetchGroups();

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.groups).toEqual(mockGroups2);
	});
});