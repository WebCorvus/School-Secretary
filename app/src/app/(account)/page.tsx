"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
	const router = useRouter();
	const [error, setError] = useState<string>("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		const form = event.currentTarget;
		const formData = new FormData(form);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			await login(email, password);
			router.push("/dashboard");
		} catch (err: any) {
			setError(err.message || "Erro ao realizar login");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
			<LoginForm
				className="w-full max-w-md"
				onSubmit={handleSubmit}
				error={error}
			/>
		</div>
	);
}
