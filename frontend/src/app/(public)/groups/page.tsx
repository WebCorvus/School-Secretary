"use client";

import axios from "axios";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/searchField";

import { GroupProps } from "@/types/group";
import { GROUP_BASE_URL } from "@/config";

export default function GroupsPage() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<GroupProps[]>([]);
	const [updating, setUpdating] = useState(false);

	useEffect(() => {
		axios
			.get<GroupProps[]>(`${GROUP_BASE_URL}?search=${search}`)
			.then((response) => setData(response.data))
			.finally(() => setUpdating(false));
	}, [updating]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setUpdating(true);
	};

	const handleDelete = (value: number) => {
		axios.delete(`${GROUP_BASE_URL}${value}/`);
		setUpdating(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Turmas</h1>
				</div>
			</div>

			<div className="flex flex-row items-center justify-center">
				<SearchField
					placeholder="Buscar turma..."
					onSearch={handleSearch}
				/>
			</div>
			<div className="flex justify-center m-3">
				<Link
					className="link link-common w-50 text-center"
					href="/groups/add"
				>
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center items-center">
				<div className="table-container">
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Abreviação</th>
								<th>Nome completo</th>
								<th>Itinerário</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((group) => (
								<tr key={group.id}>
									<td>{group.short_name}</td>
									<td>{group.full_name}</td>
									<td>
										{group.itinerary_details?.full_name ||
											"-"}
									</td>
									<td>
										<button
											className="link link-blue"
											onClick={() =>
												handleDelete(group.id)
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
