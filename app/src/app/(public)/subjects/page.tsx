"use client";

import axios from "axios";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/SearchField";

import { SubjectProps } from "@/types/subject";
import { SUBJECT_ROUTE, EXTERNAL_API_HOST } from "@/config";

export default function SubjectsPage() {
	const [data, setData] = useState<SubjectProps[]>([]);
	const [update, setUpdate] = useState(false);
	const [search, setSearch] = useState("");

	useEffect(() => {
		axios
			.get<SubjectProps[]>(`${EXTERNAL_API_HOST}${SUBJECT_ROUTE}?search=${search}`)
			.then((response) => setData(response.data))
			.catch((error) => {
				alert(`Erro ao carregar matérias: ${error}`);
			});

		setUpdate(false);
	}, [update]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setUpdate(true);
	};

	const handleDelete = (value: number) => {
		axios.delete(`${EXTERNAL_API_HOST}${SUBJECT_ROUTE}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Matérias</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar matéria..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/subjects/add">
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center">
				<div className="table-container">
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Abreviação</th>
								<th>Nome completo</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((subject) => (
								<tr key={subject.id}>
									<td>{subject.short_name}</td>
									<td>{subject.full_name}</td>
									<td>
										<button
											className="link-blue"
											onClick={() =>
												handleDelete(subject.id)
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
