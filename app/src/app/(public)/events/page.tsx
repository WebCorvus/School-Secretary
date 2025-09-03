"use client";

import api from "@/services/api";

import Link from "next/link";
import React, { useState, useEffect } from "react";

import SearchField from "@/components/SearchField";

import { EventProps } from "@/types/event";
import { EVENT_ROUTE, EXTERNAL_API_HOST } from "@/config";

export default function EventsPage() {
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState<EventProps[]>([]);

	useEffect(() => {
		api
			.get<EventProps[]>(`${EXTERNAL_API_HOST}${EVENT_ROUTE}`)
			.then((response) => setData(response.data))
			.catch((error) => {
				alert(`Erro ao carregar eventos: ${error}`);
			});

		setUpdate(false);
	}, [update]);

	const handleDelete = (value: number) => {
		api.delete(`${EXTERNAL_API_HOST}${EVENT_ROUTE}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Eventos</h1>
				</div>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/events/add">
					Adicionar
				</Link>
			</div>
			<div className="flex justify-center items-center">
				<div className="table-container">
					<table className="m-3 table table-border">
						<thead>
							<tr>
								<th>Título</th>
								<th>Descrição</th>
								<th>Data de Início</th>
								<th>Data de Fim</th>
								<th>Local</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((event) => (
								<tr key={event.id}>
									<td>{event.title}</td>
									<td>{event.description}</td>
									<td>{event.start_date}</td>
									<td>{event.end_date}</td>
									<td>{event.location}</td>
									<td>
										<button
											className="link-blue"
											onClick={() =>
												handleDelete(event.id)
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
