import { FakeSubject, SubjectProps } from "./subject";

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

export const FakeProfessor = {
	id: 1,
	full_name: "Nome do Professor",
	phone_number: "(62) 99972-1283",
	email: "test@email.com",
	cpf: "30210244089",
	birthday: "2000-06-04",
	address: "74371420",
	subject: 1,
	subject_details: FakeSubject,
	// TODO put a real (my personal) test url
	photoUrl: "https://picsum.photos/200/300",
	created_at: "2000-06-04",
};
