import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import { ResourceProps, ResourceLoanProps, createFakeResource, createFakeResourceLoan } from "@/types/resources";
import { ROUTES } from "@/config";

export function useResources() {
	const [resources, setResources] = useState<ResourceProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateMockResources = useCallback((): ResourceProps[] => {
		return Array.from({ length: 5 }, (_, i) => ({
			...createFakeResource(),
			id: i + 1,
			name: `Recurso mock #${i + 1}`,
		}));
	}, []);

	const fetchResources = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get<ResourceProps[]>(`${ROUTES.RESOURCES}`);
			let payload = response.data;

			if (
				process.env.NODE_ENV === "development" &&
				(!payload || payload.length === 0)
			) {
				payload = generateMockResources();
			}

			setResources(payload);
		} catch {
			if (process.env.NODE_ENV === "development") {
				setResources(generateMockResources());
			} else {
				setError("Não foi possível carregar os recursos.");
				setResources([]);
			}
		} finally {
			setLoading(false);
		}
	}, [generateMockResources]);

	useEffect(() => {
		fetchResources();
	}, [fetchResources]);

	return { resources, loading, error, refetchResources: fetchResources };
}

export function useResourceLoans() {
	const [resourceLoans, setResourceLoans] = useState<ResourceLoanProps[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateMockResourceLoans = useCallback((): ResourceLoanProps[] => {
		return Array.from({ length: 5 }, (_, i) => ({
			...createFakeResourceLoan(),
			id: i + 1,
		}));
	}, []);

	const fetchResourceLoans = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await api.get<ResourceLoanProps[]>(`${ROUTES.RESOURCE_LOANS}`);
			let payload = response.data;

			if (
				process.env.NODE_ENV === "development" &&
				(!payload || payload.length === 0)
			) {
				payload = generateMockResourceLoans();
			}

			setResourceLoans(payload);
		} catch {
			if (process.env.NODE_ENV === "development") {
				setResourceLoans(generateMockResourceLoans());
			} else {
				setError("Não foi possível carregar os empréstimos de recursos.");
				setResourceLoans([]);
			}
		} finally {
			setLoading(false);
		}
	}, [generateMockResourceLoans]);

	useEffect(() => {
		fetchResourceLoans();
	}, [fetchResourceLoans]);

	return { resourceLoans, loading, error, refetchResourceLoans: fetchResourceLoans };
}