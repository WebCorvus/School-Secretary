import { renderHook, waitFor } from "@testing-library/react";
import { useGroupLessons } from "./useGroupLesson";
import api from "@/services/api";
import { createFakeGroup, DailyLessonsViewProps } from "@/types/group";
import { createFakeLesson } from "@/types/lesson";
import { GROUP_ROUTE } from "@/config";

// Mock the API service
vi.mock("@/services/api");

describe("useGroupLessons", () => {
	const originalNodeEnv = process.env.NODE_ENV;

	const generateMockGroupLessons = (): DailyLessonsViewProps[] => {
		return Array.from({ length: 5 }, (_, dayIndex) => ({
			day: dayIndex + 1,
			lessons: Array.from({ length: 6 }, (_, hourIndex) => ({
				...createFakeLesson(),
				time: hourIndex + 1,
			})),
		}));
	};

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();
		process.env.NODE_ENV = originalNodeEnv; // Reset NODE_ENV
	});

	afterAll(() => {
		process.env.NODE_ENV = originalNodeEnv;
	});

	it("should return initial loading state and empty data/groups", async () => {
		(api.get as vi.Mock).mockResolvedValueOnce({ data: [] }); // For fetchGroups

		const { result } = renderHook(() => useGroupLessons());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.loading).toBe(false);
		expect(result.current.data).toEqual([]);
		expect(result.current.groups).toEqual([]);
		expect(result.current.error).toBeNull();
		expect(api.get).toHaveBeenCalledWith("/api/school/groups/");
		expect(api.get).toHaveBeenCalledTimes(1); // Only fetchGroups should be called
	});

	it("should fetch groups successfully", async () => {
		const mockGroups = Array.from({ length: 3 }, () => createFakeGroup());
		(api.get as vi.Mock).mockResolvedValueOnce({ data: mockGroups });

		const { result } = renderHook(() => useGroupLessons());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.groups).toEqual(mockGroups);
		expect(result.current.error).toBeNull();
		expect(api.get).toHaveBeenCalledWith("/api/school/groups/");
	});

	it("should fetch lessons for a selected group successfully", async () => {
		const selectedGroupId = 1;
		const mockGroups = Array.from({ length: 3 }, () => createFakeGroup());
		const mockLessons = generateMockGroupLessons();

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockGroups }) // For fetchGroups
			.mockResolvedValueOnce({ data: mockLessons }); // For fetchLessons

		const { result } = renderHook(() => useGroupLessons(selectedGroupId));

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.groups).toEqual(mockGroups);
		expect(result.current.data).toEqual(mockLessons);
		expect(result.current.error).toBeNull();
		expect(api.get).toHaveBeenCalledWith("/api/school/groups/");
		expect(api.get).toHaveBeenCalledWith(
			`/api/school/groups/${selectedGroupId}/get-lessons/`
		);
		expect(api.get).toHaveBeenCalledTimes(2);
	});

	it("should handle group fetch error in production", async () => {
		process.env.NODE_ENV = "production";
		(api.get as vi.Mock).mockRejectedValueOnce(new Error("Group API Error"));

		const { result } = renderHook(() => useGroupLessons());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.groups).toEqual([]);
		expect(result.current.error).toBe("Não foi possível carregar as turmas.");
	});

	it("should handle lesson fetch error in production", async () => {
		process.env.NODE_ENV = "production";
		const selectedGroupId = 1;
		const mockGroups = Array.from({ length: 3 }, () => createFakeGroup());

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockGroups }) // For fetchGroups
			.mockRejectedValueOnce(new Error("Lesson API Error")); // For fetchLessons

		const { result } = renderHook(() => useGroupLessons(selectedGroupId));

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toEqual([]);
		expect(result.current.error).toBe("Não foi possível carregar as aulas.");
	});

	it("should refetch lessons when refetchLessons is called", async () => {
		const selectedGroupId = 1;
		const mockGroups = Array.from({ length: 3 }, () => createFakeGroup());
		const mockLessons1 = generateMockGroupLessons();
		const mockLessons2 = generateMockGroupLessons();

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockGroups }) // Initial fetchGroups
			.mockResolvedValueOnce({ data: mockLessons1 }) // Initial fetchLessons
			.mockResolvedValueOnce({ data: mockLessons2 }); // Refetch lessons

		const { result } = renderHook(() => useGroupLessons(selectedGroupId));

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data).toEqual(mockLessons1);

		result.current.refetchLessons();

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data).toEqual(mockLessons2);
	});

	it("should refetch groups when refetchGroups is called", async () => {
		const selectedGroupId = 1;
		const mockGroups1 = Array.from({ length: 3 }, () => createFakeGroup());
		const mockGroups2 = Array.from({ length: 2 }, () => createFakeGroup());
		const mockLessons = generateMockGroupLessons();

		(api.get as vi.Mock)
			.mockResolvedValueOnce({ data: mockGroups1 }) // Initial fetchGroups
			.mockResolvedValueOnce({ data: mockLessons }) // Initial fetchLessons
			.mockResolvedValueOnce({ data: mockGroups2 }); // Refetch groups

		const { result } = renderHook(() => useGroupLessons(selectedGroupId));

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.groups).toEqual(mockGroups1);

		result.current.refetchGroups();

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.groups).toEqual(mockGroups2);
	});
});