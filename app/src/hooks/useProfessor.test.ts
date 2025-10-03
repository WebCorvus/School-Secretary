import { renderHook, waitFor } from "@testing-library/react";
import { useProfessor } from "./useProfessor";
import api from "@/services/api";
import { FakeProfessor, createFakeProfessor } from "@/types/professor";
import { ROUTES } from "@/config";

// Mock the API service
vi.mock("@/services/api");

describe("useProfessor", () => {
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
		const { result } = renderHook(() => useProfessor());

		expect(result.current.loading).toBe(true);
		expect(result.current.data).toBeNull();
		expect(result.current.error).toBeNull();
	});

	it("should fetch professor data successfully", async () => {
		const mockProfessor = createFakeProfessor();
		(api.get as vi.Mock).mockResolvedValueOnce({ data: mockProfessor });

		const { result } = renderHook(() => useProfessor());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toEqual(mockProfessor);
		expect(result.current.error).toBeNull();
		expect(api.get).toHaveBeenCalledWith(ROUTES.PROFESSORS);
	});

	it("should handle API error in development by returning FakeProfessor", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useProfessor());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toEqual(FakeProfessor);
		expect(result.current.error).toBeNull();
	});

	it("should handle API error in production by returning error message", async () => {
		process.env.NODE_ENV = "production";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

		const { result } = renderHook(() => useProfessor());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toBeNull();
		expect(result.current.error).toBe(
			"Não foi possível carregar as informações do professor."
		);
	});

	it("should handle empty data in development by returning FakeProfessor", async () => {
		process.env.NODE_ENV = "development";
		(api.get as vi.Mock).mockResolvedValueOnce({ data: null });

		const { result } = renderHook(() => useProfessor());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toEqual(FakeProfessor);
		expect(result.current.error).toBeNull();
	});

	it("should refetch professor data when refetch is called", async () => {
		const mockProfessor1 = createFakeProfessor();
		const mockProfessor2 = createFakeProfessor();

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockProfessor1 })
			.mockResolvedValueOnce({ data: mockProfessor2 });

		const { result } = renderHook(() => useProfessor());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data).toEqual(mockProfessor1);

		result.current.refetch();

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data).toEqual(mockProfessor2);
	});
});