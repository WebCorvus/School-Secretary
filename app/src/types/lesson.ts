import { createFakeGroup, GroupProps } from "./group";
import { createFakeProfessor, ProfessorProps } from "./professor";
import { createFakeSubject, SubjectProps } from "./subject";
import { faker } from '@faker-js/faker';

export interface LessonProps {
	id: number;
	group: number;
	group_details: GroupProps;
	professor: number;
	professor_details: ProfessorProps;
	subject: number;
	subject_details: SubjectProps;
	time: number;
	day: number;
	created_at: string;
}

export type LessonPostProps = Omit<
	LessonProps,
	| "id"
	| "professor_details"
	| "subject_details"
	| "created_at"
	| "group_details"
>;

export function createFakeLesson(): LessonProps {
	return {
		id: faker.number.int(),
		group: faker.number.int(),
		group_details: createFakeGroup(),
		professor: faker.number.int(),
		professor_details: createFakeProfessor(),
		subject: faker.number.int(),
		subject_details: createFakeSubject(),
		time: faker.number.int({ min: 1, max: 5 }),
		day: faker.number.int({ min: 1, max: 5 }),
		created_at: faker.date.past().toISOString().split('T')[0],
	};
}

export const FakeLesson = createFakeLesson();
