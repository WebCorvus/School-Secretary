"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { AgendaItem } from "@/types/agenda";
import { Event } from "@/types/event";
import { AGENDA_BASE_URL, EVENT_BASE_URL } from "@/config";

export default function Home() {
	const [agenda, setAgenda] = useState<AgendaItem[]>([]);
	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		async function getAgenda() {
			try {
				const agendaResponse = await axios.get(AGENDA_BASE_URL);
				if (!agendaResponse) {
					throw new Error("Agenda unavaible.");
				}
				setAgenda(agendaResponse.data);
			} catch (error) {
				console.error("Error fetching agenda items on client:", error);
			}
		}

		async function getEvents() {
			try {
				const eventResponse = await axios.get(EVENT_BASE_URL);
				if (!eventResponse) {
					throw new Error("Events unavaible.");
				}
				setEvents(eventResponse.data);
			} catch (error) {
				console.error("Error fetching events on client:", error);
			}
		}

		getAgenda();
		getEvents();
	}, []);

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
					{agenda.length > 0 ? (
						<ul className="list-disc pl-5">
							{agenda.map((item) => (
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
