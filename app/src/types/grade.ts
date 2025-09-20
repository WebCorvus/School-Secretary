import type { SubjectProps } from "./subject";

export interface GradeProps {
	id: number;
	subject: SubjectProps;
	year: number;
	bimester: string;
	value: number;
	created_at: string;
}
