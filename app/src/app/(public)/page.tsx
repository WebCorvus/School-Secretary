import Link from "next/link";
import axios from "axios";
import { AgendaItem } from "@/types/agenda";
import { Event } from "@/types/event";
import { AGENDA_BASE_URL, EVENT_BASE_URL } from "@/config";

export default async function Home() {
	let agendaItems: AgendaItem[] = [];
	let events: Event[] = [];

	try {
		const agendaResponse = await axios.get<AgendaItem[]>(AGENDA_BASE_URL);
		agendaItems = agendaResponse.data;
	} catch (error) {
		console.error("Error fetching agenda items on server:", error);
	}

	try {
		const eventResponse = await axios.get<Event[]>(EVENT_BASE_URL);
		events = eventResponse.data;
	} catch (error) {
		console.error("Error fetching events on server:", error);
	}

	return (
		<div className="flex flex-col flex-grow p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">
					Bem-vindo ao School Secretary
				</h1>
				<p className="text-[var(--smooth)]">
					Sua plataforma completa para gestão escolar.
				</p>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">
					Últimas Atualizações da Agenda
				</h2>
				<div className="p-6 rounded-lg shadow-lg">
					{agendaItems.length > 0 ? (
						<ul className="list-disc pl-5">
							{agendaItems.map((item) => (
								<li key={item.id} className="mb-2">
									<span className="font-semibold">
										{item.title}
									</span>{" "}
									- {item.date} {item.time}
									{item.description && (
										<p className="text-sm ml-4">
											{item.description}
										</p>
									)}
								</li>
							))}
						</ul>
					) : (
						<p className="text-[var(--smooth)]">
							Nenhuma atualização recente na agenda.
						</p>
					)}
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Últimos Eventos</h2>
				<div className="p-6 rounded-lg shadow-lg">
					{events.length > 0 ? (
						<ul className="list-disc pl-5">
							{events.map((event) => (
								<li key={event.id} className="mb-2">
									<span className="font-semibold">
										{event.title}
									</span>{" "}
									- {event.start_date} {event.start_time}
									{event.location && (
										<span className="ml-2 text-sm">
											({event.location})
										</span>
									)}
									{event.description && (
										<p className="text-sm ml-4">
											{event.description}
										</p>
									)}
								</li>
							))}
						</ul>
					) : (
						<p className="text-[var(--smooth)]">
							Nenhum evento recente.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
