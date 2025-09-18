"use client";

import Link from "next/link";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { FullScreenError } from "@/components/FullScreenError";
import { useAgenda } from "@/hooks/useAgenda";

export default function AgendaPage() {
	const { data, loading, error, refetch } = useAgenda();

	if (loading) return <FullScreenLoading />;
	if (error) return <FullScreenError error={error} />;
	if (data.length === 0)
		return <FullScreenError error="Nenhuma informação encontrada." />;

	return (
		<div>
			<div className="flex justify-center">
				<h1 className="title">Agenda</h1>
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
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
