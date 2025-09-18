import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { EventProps, FakeEvent } from "@/types/event";
import { EXTERNAL_API_HOST, EVENTS_ROUTE } from "@/config";

export function useEvent() {
	const [data, setData] = useState<EventProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const generateMockData = useCallback((): EventProps[] => {
		return Array.from({ length: 10 }, (_, i) => ({
			...FakeEvent,
			id: i + 1,
			title: `Evento mock #${i + 1}`,
			description: `Descrição do evento mock #${i + 1}`,
		}));
	}, []);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get<EventProps[]>(
				`${EXTERNAL_API_HOST}${EVENTS_ROUTE}`
			);
			let payload = Array.isArray(response.data) ? response.data : [];

			if (
				process.env.NODE_ENV === "development" &&
				payload.length === 0
			) {
				payload = generateMockData();
			}

			setData(payload);
		} catch {
			if (process.env.NODE_ENV === "development") {
				setData(generateMockData());
				setError(null);
			} else {
				setData([]);
				setError("Não foi possível carregar os eventos.");
			}
		} finally {
			setLoading(false);
		}
	}, [generateMockData]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
