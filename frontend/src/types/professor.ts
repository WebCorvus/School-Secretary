import { SubjectProps } from "./subject";

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
	created_at: string;
}

export type ProfessorPostProps = Omit<
	ProfessorProps,
	"id" | "subject_details" | "created_at"
>;
