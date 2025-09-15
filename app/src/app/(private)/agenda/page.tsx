"use client";

import api from "@/services/api";

import Link from "next/link";
import React, { useState, useEffect } from "react";

// TODO implement search field
import SearchField from "@/components/SearchField";

import { AgendaItemProps } from "@/types/agenda";
import { AGENDA_ROUTE, EXTERNAL_API_HOST } from "@/config";

export default function AgendaPage() {
	const [update, setUpdate] = useState(false);
	const [data, setData] = useState<AgendaItemProps[]>([]);

	useEffect(() => {
		api.get<AgendaItemProps[]>(`${EXTERNAL_API_HOST}${AGENDA_ROUTE}`)
			.then((response) => setData(response.data))
			.catch((error) => {
				alert(`Erro ao carregar itens da agenda: ${error}`);
			});

		setUpdate(false);
	}, [update]);

	const handleDelete = (value: number) => {
		api.delete(`${EXTERNAL_API_HOST}${AGENDA_ROUTE}${value}/`);
		setUpdate(true);
	};

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Agenda</h1>
				</div>
			</div>
			<div className="flex justify-center m-3">
				<Link className="btn w-50 text-center" href="/agenda/add" data-test="add-button">
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
								<th>Data</th>
								<th>Hora</th>
								<th>Matéria</th>
								<th>Remover</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item) => (
								<tr key={item.id}>
									<td>{item.title}</td>
									<td>{item.description}</td>
									<td>{item.date}</td>
									<td>{item.time}</td>
									<td>{item.subject_details?.full_name}</td>
									<td>
										<button
											className="link-blue"
											onClick={() =>
												handleDelete(item.id)
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
