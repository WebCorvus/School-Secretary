import { FakeStudent } from "./student";
import { FakeSubject } from "./subject";
import { SubjectProps } from "./subject";

export interface AgendaItemProps {
	id: number;
	title: string;
	subject?: number;
	subject_details?: SubjectProps;
	description?: string;
	date: string;
	time?: string;
	created_at: string;
	updated_at: string;
}

export type AgendaItemPostProps = Omit<
	AgendaItemProps,
	"id" | "created_at" | "updated_at" | "subject_details"
>;

export const FakeAgendaItem = {
	id: 1,
	title: "Atividade de teste",
	subject: 1,
	subject_details: FakeSubject,
	description: "Descrição de test",
	date: "2000-01-01",
	time: "22:00:00",
	created_at: "2000-01-01",
	updated_at: "2000-01-01",
};
