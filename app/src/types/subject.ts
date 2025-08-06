export interface SubjectProps {
	id: number;
	full_name: string;
	short_name: string;
	created_at: string;
}

export type SubjectPostProps = Omit<SubjectProps, "id" | "created_at">;
