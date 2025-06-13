"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { GroupProps } from "@/types/group";
import { GROUP_BASE_URL } from "@/config";
import SearchField from "@/components/searchField";

export default function GroupsPage() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<GroupProps[]>([]);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		axios
			.get<GroupProps[]>(`${GROUP_BASE_URL}?search=${search}`)
			.then((response) => setData(response.data))
			.finally(() => setSearching(false));
	}, [searching]);

	const handleSearch = (value: string) => {
		setSearch(value);
		setSearching(true);
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
			<div className="flex justify-center">
				{searching ? (
					<p>Carregando...</p>
				) : (
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Abreviação</th>
								<th>Nome completo</th>
							</tr>
						</thead>
						<tbody>
							{data.map((group) => (
								<tr key={group.id}>
									<td>{group.short_name}</td>
									<td>{group.full_name}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
