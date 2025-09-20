import { createFakeSubject } from "./subject";
import { SubjectProps } from "./subject";
import { faker } from "@faker-js/faker";

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

export function createFakeAgendaItem(): AgendaItemProps {
	return {
		id: faker.number.int(),
		title: faker.lorem.sentence(),
		subject: faker.number.int(),
		subject_details: createFakeSubject(),
		description: faker.lorem.paragraph(),
		date: faker.date.past().toISOString().split("T")[0],
		time: faker.helpers.arrayElement([
			"10:00:00",
			"11:00:00",
			"14:00:00",
			"15:00:00",
		]),
		created_at: faker.date.past().toISOString().split("T")[0],
		updated_at: faker.date.recent().toISOString().split("T")[0],
	};
}

export const FakeAgendaItem = createFakeAgendaItem();
