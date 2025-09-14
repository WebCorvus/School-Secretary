import { useEffect, useState } from "react";
import { AgendaItemProps } from "@/types/agenda";
import { EventProps } from "@/types/event";
import {
	INTERNAL_API_HOST,
	AGENDA_PENDENTS_ROUTE,
	EVENT_PENDENTS_ROUTE,
} from "@/config";
import api from "@/services/api";

export default function Dashboard() {
	const userLevel = "Admin";
	return (
		<div>
			<div className="header-container">
				<h1>Bem-vindo(a) {userLevel}</h1>
			</div>
		</div>
	);
}
