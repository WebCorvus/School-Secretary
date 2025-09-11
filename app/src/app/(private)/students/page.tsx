"use client";

import api from "@/services/api";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { StudentProps } from "@/types/student";
import { STUDENT_ROUTE, EXTERNAL_API_HOST } from "@/config";
import SearchField from "@/components/SearchField";

export default function StudentsPage() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<StudentProps[]>([]);
	const [update, setUpdate] = useState(false);

	useEffect(() => {
		api
			.get<StudentProps[]>(`${EXTERNAL_API_HOST}${STUDENT_ROUTE}?search=${search}`)
			.then((response) => setData(response.data))
			.finally(() => setUpdate(false));
	}, [update]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setUpdate(true);
	};

	const handleDelete = (value: number) => {
		api.delete(`${EXTERNAL_API_HOST}${STUDENT_ROUTE}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Dados dos Alunos Cadastrados</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar aluno..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/students/add" data-test="add-button">
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center items-center">
				<div className="table-container">
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Nome</th>
								<th>Matrícula</th>
								<th>Telefone</th>
								<th>Email</th>
								<th>CPF</th>
								<th>Data de Nascimento</th>
								<th>Endereço</th>
								<th>Turma</th>
								<th>Notas</th>
								<th>Presença</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((student) => (
								<tr key={student.id}>
									<td>{student.full_name}</td>
									<td>{student.registration_number}</td>
									<td>{student.phone_number}</td>
									<td>{student.email}</td>
									<td>{student.cpf}</td>
									<td>{student.birthday}</td>
									<td>{student.address}</td>
									<td>
										{student?.group_details?.short_name ||
											"-"}
									</td>

									<td>
										<Link
											href={`${EXTERNAL_API_HOST}${STUDENT_ROUTE}${student.id}/download-grades`}
											className="link-blue"
										>
											Notas
										</Link>
									</td>
									<td>
										<Link
											href={`${EXTERNAL_API_HOST}${STUDENT_ROUTE}${student.id}/download-presence`}
											className="link-blue"
										>
											Presença
										</Link>
									</td>
									<td>
										<button
											className="link-blue"
											onClick={() =>
												handleDelete(student.id)
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
		</div>
	);
}
