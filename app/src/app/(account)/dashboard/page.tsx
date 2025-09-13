"use client";

import { useEffect, useState } from "react";
import { AgendaItemProps } from "@/types/agenda";
import { EventProps } from "@/types/event";
import {
	EXTERNAL_API_HOST,
	AGENDA_PENDENTS_ROUTE,
	EVENT_PENDENTS_ROUTE,
} from "@/config";
import api from "@/services/api";

export default function Dashboard() {
	const [agenda, setAgenda] = useState<AgendaItemProps[]>([]);
	const [events, setEvents] = useState<EventProps[]>([]);

	useEffect(() => {
		api.get<AgendaItemProps[]>(
			`${EXTERNAL_API_HOST}${AGENDA_PENDENTS_ROUTE}`
		)
			.then((response) => setAgenda(response.data))
			.catch((error) =>
				console.error("Error fetching agenda items on client:", error)
			);

		api.get<EventProps[]>(`${EXTERNAL_API_HOST}${EVENT_PENDENTS_ROUTE}`)
			.then((response) => setEvents(response.data))
			.catch((error) =>
				console.error("Error fetching events on client:", error)
			);
	}, []);

	return (
		<div className="flex flex-col flex-grow p-8" data-test="home-container">
			<div className="mb-8" data-test="home-welcome">
				<h1 className="text-3xl font-bold">
					Bem-vindo ao School Secretary
				</h1>
				<p className="text-[var(--smooth)]">
					Sua plataforma completa para gestão escolar.
				</p>
			</div>

			<div className="mb-8" data-test="home-agenda">
				<h2 className="text-2xl font-semibold">
					Últimas Atualizações da Agenda
				</h2>
				<div className="p-6 rounded-lg shadow-lg">
					{agenda.length > 0 ? (
						<ul className="list-none pl-5" data-test="agenda-items">
							{agenda.map((item) => (
								<li
									key={item.id}
									className="flex flex-col mb-8"
									data-test={`agenda-item-${item.id}`}
								>
									<span className="font-semibold">
										{item.subject_details && (
											<span>
												{
													item.subject_details
														.short_name
												}
												:
											</span>
										)}{" "}
										{item.title}
									</span>
									<span className="text-[var(--smooth)]">
										{item.date}
										{item.time && (
											<span> ás {item.time}</span>
										)}
									</span>
									{item.description && (
										<p className="text-sm m-2">
											{item.description}
										</p>
									)}
								</li>
							))}
						</ul>
					) : (
						<p
							className="text-[var(--smooth)]"
							data-test="empty-agenda"
						>
							Nenhuma atualização recente na agenda.
						</p>
					)}
				</div>
			</div>

			<div className="mb-8" data-test="home-events">
				<h2 className="text-2xl font-semibold">Últimos Eventos</h2>
				<div className="p-6 rounded-lg shadow-lg">
					{events.length > 0 ? (
						<ul className="list-none pl-5" data-test="event-items">
							{events.map((event) => (
								<li
									key={event.id}
									className="flex flex-col mb-8"
									data-test={`event-item-${event.id}`}
								>
									<span className="font-semibold">
										{event.title}
									</span>
									<span className="text-[var(--smooth)]">
										{event.start_date}
										{event.end_date && (
											<span> até {event.end_date}</span>
										)}
									</span>
									<span className="text-[var(--smooth)]">
										{event.start_time}
										{event.end_time && (
											<span> até {event.end_time}</span>
										)}
									</span>
									{event.location && (
										<p className="text-sm m-2">
											Localização: {event.location}
										</p>
									)}
									{event.description && (
										<p className="text-sm m-2">
											{event.description}
										</p>
									)}
								</li>
							))}
						</ul>
					) : (
						<p
							className="text-[var(--smooth)]"
							data-test="empty-events"
						>
							Nenhum evento recente.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
