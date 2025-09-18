export interface SubjectProps {
	id: number;
	full_name: string;
	short_name: string;
	created_at: string;
}

export type SubjectPostProps = Omit<SubjectProps, "id" | "created_at">;

export const FakeSubject = {
	id: 1,
	full_name: "Matéria de Test",
	short_name: "MT",
	created_at: "2000-01-01",
};
