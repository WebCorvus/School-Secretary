"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			await login(email, password);
			router.push("/");
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<div className="flex items-center justify-center">
			<div className="form-container min-h-screen">
				<form className="form flex-col" onSubmit={handleSubmit}>
					<h1 className="title">Login</h1>
					{error ? (
						<div className="text-[var(--danger)] text-md text-center mb-2">
							{error}
						</div>
					) : (
						<div className="text-md text-center mb-2">
							<p>Insira o email e a senha cadastrados</p>
						</div>
					)}
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Senha"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button type="submit" className="btn mt-2 w-full">
						Entrar
					</button>
				</form>
			</div>
		</div>
	);
}
