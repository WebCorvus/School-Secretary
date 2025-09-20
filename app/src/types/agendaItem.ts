import { faker } from "@faker-js/faker";
import { SubjectCompactProps, createFakeSubjectCompact } from "./subject";

export interface AgendaItemProps {
	id: number;
	title: string;
	subject: number;
	subject_details?: SubjectCompactProps;
	description: string;
	date: string;
	time: string;
	created_at: string;
	updated_at: string;
}

export type AgendaItemPostProps = Omit<
	AgendaItemProps,
	"id" | "created_at" | "updated_at" | "subject_details"
>;

export function createFakeAgendaItem(): AgendaItemProps {
	return {
		id: faker.number.int(),
		title: faker.lorem.sentence(),
		subject: faker.number.int(),
		subject_details: createFakeSubjectCompact(),
		description: faker.lorem.text(),
		date: faker.date.future().toISOString().split("T")[0],
		time: faker.date.future().toTimeString().split(" ")[0].substring(0, 5),
		created_at: faker.date.past().toISOString(),
		updated_at: faker.date.recent().toISOString(),
	};
}

export const FakeAgendaItem: AgendaItemProps = createFakeAgendaItem();
