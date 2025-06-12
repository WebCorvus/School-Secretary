"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchField from "@/components/searchField";
import { STUDENT_BASE_URL } from "@/config";

interface StudentProps {
	id: number;
	full_name: string;
	registration_number: string;
	phone_number: string;
	email: string;
	cpf: string;
	birthday: string;
	address: string;
	group: string;
	itinerary: string;
	created_at: string;
}

export default function Home() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<StudentProps[]>([]);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		axios
			.get<StudentProps[]>(`${STUDENT_BASE_URL}?search=${search}`)
			.then((response) => setData(response.data))
			.finally(() => setSearching(false));
	}, [searching]);

	const handleSearch = (value: string) => {
		setSearching(true);
		setSearch(value);
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
			<div className="flex justify-center">
				{searching ? (
					<p>Carregando...</p>
				) : (
					<table className="m-5 table table-border">
						<thead>
							<tr>
								<th>Nome</th>
								<th>Matrícula</th>
								<th>Telefone</th>
								<th>Email</th>
								<th>CPF</th>
								<th>Nascimento</th>
								<th>Presença</th>
								<th>Boletim</th>
							</tr>
						</thead>
						<tbody>
							{data.map((register) => (
								<tr key={register.id}>
									<td>{register.full_name}</td>
									<td>{register.registration_number}</td>
									<td>{register.phone_number}</td>
									<td>{register.email}</td>
									<td>{register.cpf}</td>
									<td>{register.birthday}</td>
									<td>
										<Link
											className="link link-blue"
											href={`${STUDENT_BASE_URL}${register.id}/download-presence/`}
										>
											Presença
										</Link>
									</td>
									<td>
										<Link
											className="link link-blue"
											href={`${STUDENT_BASE_URL}${register.id}/download-grades/`}
										>
											Boletim
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
