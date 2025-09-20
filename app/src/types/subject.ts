import { faker } from '@faker-js/faker';

export interface SubjectProps {
	id: number;
	full_name: string;
	short_name: string;
	created_at: string;
}

export type SubjectPostProps = Omit<SubjectProps, "id" | "created_at">;

export const FakeSubject: SubjectProps = {
	id: faker.number.int(),
	full_name: faker.lorem.words(3),
	short_name: faker.lorem.word(2).toUpperCase(),
	created_at: faker.date.past().toISOString().split('T')[0],
};
