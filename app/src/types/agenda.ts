import { SubjectProps } from "./subject";

export interface AgendaItem {
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
