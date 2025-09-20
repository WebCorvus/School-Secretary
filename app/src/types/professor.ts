import { FakeSubject, SubjectProps } from "./subject";
import { faker } from '@faker-js/faker';

export interface ProfessorProps {
	id: number;
	full_name: string;
	phone_number: string;
	email: string;
	cpf: string;
	birthday: string;
	address: string;
	subject: number;
	subject_details: SubjectProps | undefined;
	// TODO add this field to the db
	photoUrl: string;
	created_at: string;
}

export type ProfessorPostProps = Omit<
	ProfessorProps,
	"id" | "subject_details" | "created_at"
>;

export const FakeProfessor: ProfessorProps = {
	id: faker.number.int(),
	full_name: faker.person.fullName(),
	phone_number: faker.phone.number(),
	email: faker.internet.email(),
	cpf: faker.string.numeric(11),
	birthday: faker.date.past().toISOString().split('T')[0],
	address: faker.location.zipCode(),
	subject: faker.number.int(),
	subject_details: FakeSubject,
	// TODO put a real (my personal) test url
	photoUrl: faker.image.avatar(),
	created_at: faker.date.past().toISOString().split('T')[0],
};
