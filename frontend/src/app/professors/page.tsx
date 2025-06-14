"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

import SearchField from "@/components/searchField";

import { ProfessorProps } from "@/types/professor";
import { SubjectProps } from "@/types/subject";
import { PROFESSOR_BASE_URL, SUBJECT_BASE_URL } from "@/config";

export default function ProfessorsPage() {
	const [data, setData] = useState<ProfessorProps[]>([]);
	const [subjects, setSubjects] = useState<SubjectProps[]>([]);
	const [search, setSearch] = useState("");
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		axios.get(SUBJECT_BASE_URL).then((response) => {
			setSubjects(response.data);
		});
	}, []);

	useEffect(() => {
		axios
			.get(`${PROFESSOR_BASE_URL}?search=${search}`)
			.then((response) => setData(response.data))
			.finally(() => setUpdating(false));
	}, [updating]);

	const handleSearch = (value: string) => {
		setUpdating(true);
		setSearch(value);
	};

	const handleDelete = (value: number) => {
		axios.delete(`${PROFESSOR_BASE_URL}${value}/`);
		setUpdating(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Dados dos Professores Cadastrados</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar professor..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link
					className="link link-common w-50 text-center"
					href="/professors/add"
				>
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center">
				<table className="m-3 table table-border">
					<thead>
						<tr>
							<th>Nome</th>
							<th>Telefone</th>
							<th>Email</th>
							<th>CPF</th>
							<th>Nascimento</th>
							<th>Endereço</th>
							<th>Matéria</th>
							<th>Remover</th>
						</tr>
					</thead>
					<tbody>
						{data.map((professor) => (
							<tr key={professor.id}>
								<td>{professor.full_name}</td>
								<td>{professor.phone_number}</td>
								<td>{professor.email}</td>
								<td>{professor.cpf}</td>
								<td>{professor.birthday}</td>
								<td>{professor.address}</td>
								<td>
									{subjects.find(
										(subject) =>
											subject.id === professor.subject
									)?.full_name || "Não encontrado"}
								</td>
								<td>
									<button
										className="link link-blue"
										onClick={() =>
											handleDelete(professor.id)
										}
									>
										Remover
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
