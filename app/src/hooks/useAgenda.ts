import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { AgendaItemProps } from "@/types/agenda";
import { EXTERNAL_API_HOST, AGENDA_ROUTE } from "@/config";

export function useAgenda() {
	const [data, setData] = useState<AgendaItemProps[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get(
				`${EXTERNAL_API_HOST}${AGENDA_ROUTE}`
			);
			const payload = Array.isArray(response.data)
				? response.data
				: response.data?.results || [];
			setData(payload);
		} catch (err) {
			setError("Não foi possível carregar a agenda.");
			setData(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetch = () => fetchData();

	return { data, loading, error, refetch };
}
