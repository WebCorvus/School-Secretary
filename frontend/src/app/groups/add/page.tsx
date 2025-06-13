"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { GROUP_BASE_URL } from "@/config";

export default function AddGroup() {
	const router = useRouter();
	const [year, setYear] = useState("");
	const [level, setLevel] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!year || !level) {
			alert("Selecione o ano e o nível.");
			return;
		}
		setLoading(true);
		const short_name = `${year}${level}`;
		const full_name = `${year}º Ano do Ensino ${
			level === "M" ? "Médio" : "Fundamental"
		}`;
		try {
			await axios.post(GROUP_BASE_URL, { short_name, full_name });
			alert("Turma cadastrada com sucesso!");
			router.push("/groups");
		} catch (error) {
			alert(`Erro ao cadastrar turma: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Turma</h1>
			<div className="form-container ">
				<form
					onSubmit={handleSubmit}
					className="form p-6 border border-[var(--divide)] rounded  w-full max-w-sm"
				>
					<div className="mb-4">
						<label htmlFor="year" className="block mb-2 font-bold">
							Ano
						</label>
						<select
							id="year"
							name="year"
							value={year}
							onChange={(e) => setYear(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione o ano</option>
							<option value="1">1º</option>
							<option value="2">2º</option>
							<option value="3">3º</option>
							<option value="4">4º</option>
							<option value="5">5º</option>
							<option value="6">6º</option>
							<option value="7">7º</option>
							<option value="8">8º</option>
							<option value="9">9º</option>
						</select>
					</div>
					<div className="mb-4">
						<label htmlFor="level" className="block mb-2 font-bold">
							Nível
						</label>
						<select
							id="level"
							name="level"
							value={level}
							onChange={(e) => setLevel(e.target.value)}
							className="form select"
							required
						>
							<option value="">Selecione o nível</option>
							<option value="F">Fundamental</option>
							<option value="M">Médio</option>
						</select>
					</div>
					<button
						type="submit"
						className="btn btn-common w-full"
						disabled={loading}
					>
						{loading ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
