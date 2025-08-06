"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { SubjectPostProps } from "@/types/subject";
import { SUBJECT_BASE_URL } from "@/config";

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
			await axios.post(SUBJECT_BASE_URL, subject);
			alert("Matéria cadastrada com sucesso!");
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
						className="btn btn-common w-full"
						disabled={posting}
					>
						{posting ? "Salvando..." : "Salvar"}
					</button>
				</form>
			</div>
		</div>
	);
}
