import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import {
	UserProps,
	FakeStudentUser,
	FakeGuardianUser,
	FakeProfessorUser,
	FakeStaffUser,
	FakeSuperuserUser,
} from "@/types/user";
import { EXTERNAL_API_HOST, USERS_INFO_ROUTE } from "@/config";

export function useUser() {
	const [data, setData] = useState<UserProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const generateMockUser = useCallback((): UserProps => {
		const mocks = [
			FakeStudentUser,
			FakeGuardianUser,
			FakeProfessorUser,
			FakeStaffUser,
			FakeSuperuserUser,
		];
		const randomIndex = Math.floor(Math.random() * mocks.length);
		return mocks[randomIndex];
	}, []);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get<UserProps>(
				`${EXTERNAL_API_HOST}${USERS_INFO_ROUTE}`
			);
			const payload = response.data || null;

			if (process.env.NODE_ENV === "development" && !payload) {
				setData(generateMockUser());
			} else {
				setData(payload);
			}
		} catch {
			if (process.env.NODE_ENV === "development") {
				setData(generateMockUser());
				setError(null);
			} else {
				setData(null);
				setError(
					"Não foi possível carregar as informações do usuário."
				);
			}
		} finally {
			setLoading(false);
		}
	}, [generateMockUser]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
