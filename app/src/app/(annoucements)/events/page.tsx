"use client";

import Link from "next/link";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";
import { useEvent } from "@/hooks/useEvent";
// import SearchField from "@/components/SearchField"; // TODO implement search field

export default function EventsPage() {
	const { data, loading, error, refetch } = useEvent();

	if (loading) return <FullScreenLoading />;
	if (error) return <FullScreenError error={error} />;
	if (!data || data.length === 0)
		return <FullScreenError error="Nenhum evento encontrado." />;

	return (
		<div>
			<div className="flex justify-center">
				<div className="title-container">
					<h1 className="title">Eventos</h1>
				</div>
			</div>
			<div className="flex justify-center m-3">
				<Link
					className="btn w-50 text-center"
					href="/events/add"
					data-test="add-button"
				>
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
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
