"use client";

import axios from "axios";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/searchField";

import { ItineraryProps } from "@/types/itinerary";
import { ITINERARY_BASE_URL } from "@/config";

export default function ItinerariesPage() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState<ItineraryProps[]>([]);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		axios
			.get<ItineraryProps[]>(`${ITINERARY_BASE_URL}?search=${search}`)
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
					href="/itineraries/add"
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
							{data.map((itinerary) => (
								<tr key={itinerary.id}>
									<td>{itinerary.short_name}</td>
									<td>{itinerary.full_name}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
