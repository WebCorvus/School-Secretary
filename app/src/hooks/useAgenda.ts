import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { AgendaItemProps, FakeAgendaItem } from "@/types/agendaItem";
import { EXTERNAL_API_HOST, AGENDA_ROUTE } from "@/config";

export function useAgenda() {
	const [data, setData] = useState<AgendaItemProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const generateMockAgenda = useCallback((): AgendaItemProps[] => {
		return Array.from({ length: 10 }, (_, i) => ({
			...FakeAgendaItem,
			id: i + 1,
			title: `Evento mock #${i + 1}`,
			description: `Descrição do evento mock #${i + 1}`,
		}));
	}, []);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get(
				`${EXTERNAL_API_HOST}${AGENDA_ROUTE}`
			);
			let payload = Array.isArray(response.data) ? response.data : [];

			if (
				process.env.NODE_ENV === "development" &&
				payload.length === 0
			) {
				payload = generateMockAgenda();
			}

			setData(payload);
		} catch {
			if (process.env.NODE_ENV === "development") {
				setData(generateMockAgenda());
				setError(null);
			} else {
				setData([]);
				setError("Não foi possível carregar a agenda.");
			}
		} finally {
			setLoading(false);
		}
	}, [generateMockAgenda]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
