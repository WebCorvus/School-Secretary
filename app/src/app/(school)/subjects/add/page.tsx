"use client";

import api from "@/services/api";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { SubjectPostProps } from "@/types/subject";
import { SUBJECT_ROUTE, EXTERNAL_API_HOST } from "@/config";

export default function AddSubject() {
	const router = useRouter();
	const [subject, setSubject] = useState<SubjectPostProps>({
		short_name: "",
		full_name: "",
	});
	const [posting, setPosting] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setSubject((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPosting(true);
		try {
			await api.post(EXTERNAL_API_HOST + SUBJECT_ROUTE, subject);
			router.push("/subjects");
		} catch (error: any) {
			alert(`Erro ao cadastrar matéria: ${error.message}`);
		} finally {
			setPosting(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center m-20">
			<h1 className="title">Adicionar Matérias</h1>
			<div className="form-container ">
				<form
					onSubmit={handleSubmit}
					className="form flex-col p-6 border border-[var(--divide)] rounded-md w-full max-w-md"
				>
					<input
						type=""
						name="short_name"
						placeholder="Abreviação..."
						value={subject.short_name}
						onChange={handleChange}
						className="w-10"
					/>
					<input
						type="text"
						name="full_name"
						placeholder="Nome completo..."
						value={subject.full_name}
						onChange={handleChange}
					/>
					<button
						type="submit"
						className="btn w-full"
						disabled={posting}
					>
						{posting ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
