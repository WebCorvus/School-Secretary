"use client";

import axios from "axios";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/searchField";

import { SubjectProps } from "@/types/subject";
import { SUBJECT_BASE_URL } from "@/config";

export default function SubjectsPage() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<SubjectProps[]>([]);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		axios
			.get<SubjectProps[]>(`${SUBJECT_BASE_URL}?search=${search}`)
			.then((response) => setData(response.data))
			.finally(() => setUpdating(false));
	}, [updating]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setUpdating(true);
	};

	const handleDelete = (value: number) => {
		axios.delete(`${SUBJECT_BASE_URL}${value}/`);
		setUpdating(true);
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
				<Link
					className="link link-common w-50 text-center"
					href="/subjects/add"
				>
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
											className="link link-blue"
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
