import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { StudentProps, FakeStudent } from "@/types/student";
import { EXTERNAL_API_HOST, USERS_INFO_ROUTE } from "@/config";

export function useStudent() {
	const [data, setData] = useState<StudentProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const generateMockData = useCallback((): StudentProps => {
		return { ...FakeStudent };
	}, []);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get<StudentProps>(
				`${EXTERNAL_API_HOST}${USERS_INFO_ROUTE}`
			);
			const payload = response.data || null;

			if (process.env.NODE_ENV === "development" && !payload) {
				setData(generateMockData());
			} else {
				setData(payload);
			}
		} catch {
			if (process.env.NODE_ENV === "development") {
				setData(generateMockData());
				setError(null);
			} else {
				setData(null);
				setError(
					"Não foi possível carregar as informações do estudante."
				);
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
