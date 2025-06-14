"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { StudentProps } from "@/types/student";
import { STUDENT_BASE_URL } from "@/config";
import SearchField from "@/components/searchField";

export default function StudentsPage() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<StudentProps[]>([]);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		axios
			.get<StudentProps[]>(`${STUDENT_BASE_URL}?search=${search}`)
			.then((response) => setData(response.data))
			.finally(() => setUpdating(false));
	}, [updating]);

	const handleSearch = (value: string) => {
		setUpdating(true);
		setSearch(value);
	};

	const handleDelete = (value: number) => {
		axios.delete(`${STUDENT_BASE_URL}${value}/`);
		setUpdating(true);
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
				<Link
					className="link link-common w-50 text-center"
					href="/students/add"
				>
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
										{student.group_details?.full_name ||
											"-"}
									</td>

									<td>
										<Link
											href={`${STUDENT_BASE_URL}${student.id}/download-grades`}
											className="link link-blue"
										>
											Notas
										</Link>
									</td>
									<td>
										<Link
											href={`${STUDENT_BASE_URL}${student.id}/download-presence`}
											className="link link-blue"
										>
											Presença
										</Link>
									</td>
									<td>
										<button
											className="link link-blue"
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
