import { faker } from '@faker-js/faker';

export interface EventProps {
	id: number;
	title: string;
	description?: string;
	start_date: string;
	end_date?: string;
	start_time?: string;
	end_time?: string;
	location?: string;
	created_at: string;
	updated_at: string;
}

export type EventPostProps = Omit<
	EventProps,
	"id" | "created_at" | "updated_at"
>;

export const FakeEvent: EventProps = {
	id: faker.number.int(),
	title: faker.lorem.sentence(),
	description: faker.lorem.paragraph(),
	start_date: faker.date.past().toISOString().split('T')[0],
	end_date: faker.date.future().toISOString().split('T')[0],
	start_time: faker.helpers.arrayElement(['10:00:00', '11:00:00', '14:00:00', '15:00:00']),
	end_time: faker.helpers.arrayElement(['16:00:00', '17:00:00', '18:00:00', '19:00:00']),
	location: faker.location.streetAddress(),
	created_at: faker.date.past().toISOString().split('T')[0],
	updated_at: faker.date.recent().toISOString().split('T')[0],
};
