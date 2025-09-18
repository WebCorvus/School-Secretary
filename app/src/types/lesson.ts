import { FakeGroup, GroupProps } from "./group";
import { FakeProfessor, ProfessorProps } from "./professor";
import { FakeSubject, SubjectProps } from "./subject";

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

export const FakeLesson: LessonProps = {
	id: 1,
	group: 1,
	group_details: FakeGroup,
	professor: 1,
	professor_details: FakeProfessor,
	subject: 1,
	subject_details: FakeSubject,
	time: 1,
	day: 1,
	created_at: "2000-01-01",
};
