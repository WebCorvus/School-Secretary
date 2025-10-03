import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { GroupProps, DailyLessonsViewProps } from "@/types/group";
import { FakeLesson } from "@/types/lesson";
import { ROUTES } from "@/config";

const generateMockGroupLessons = (): DailyLessonsViewProps[] => {
	return Array.from({ length: 5 }, (_, dayIndex) => ({
		day: dayIndex + 1,
		lessons: Array.from({ length: 6 }, (_, hourIndex) => ({
			...FakeLesson,
			time: hourIndex + 1,
		})),
	}));
};

export function useGroupLessons(selectedGroup?: number) {
	const [data, setData] = useState<DailyLessonsViewProps[]>([]);
	const [groups, setGroups] = useState<GroupProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchGroups = useCallback(async () => {
		try {
			const response = await api.get<GroupProps[]>(`${ROUTES.GROUPS}`);
			setGroups(response.data);
		} catch {
			if (process.env.NODE_ENV === "development") {
				setGroups([]);
			} else {
				setError("Não foi possível carregar as turmas.");
			}
		}
	}, []);

	const fetchLessons = useCallback(async () => {
		if (!selectedGroup) return;

		setLoading(true);
		setError(null);

		try {
			const response = await api.get<DailyLessonsViewProps[]>(
				`${ROUTES.GROUPS}${selectedGroup}/get-lessons/`
			);
			let payload = response.data;

			if (
				process.env.NODE_ENV === "development" &&
				(!payload || payload.length === 0)
			) {
				payload = generateMockGroupLessons();
			}

			setData(payload);
		} catch {
			if (process.env.NODE_ENV === "development") {
				setData(generateMockGroupLessons());
				setError(null);
			} else {
				setData([]);
				setError("Não foi possível carregar as aulas.");
			}
		} finally {
			setLoading(false);
		}
	}, [selectedGroup]);

	useEffect(() => {
		fetchGroups();
	}, [fetchGroups]);

	useEffect(() => {
		if (!selectedGroup) return;
		fetchLessons();
	}, [selectedGroup, fetchLessons]);

	return {
		data,
		groups,
		loading,
		error,
		refetchLessons: fetchLessons,
		refetchGroups: fetchGroups,
	};
}
