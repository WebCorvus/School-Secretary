import { ProfessorProps } from "./professor";
import { SubjectProps } from "./subject";

export interface Lesson {
	id: number;
	professor: number;
	professor_details: ProfessorProps;
	subject: number;
	subject_details: SubjectProps;
	time: number;
	day: number;
	created_at: string;
}
