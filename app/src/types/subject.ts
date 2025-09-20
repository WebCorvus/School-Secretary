import { faker } from "@faker-js/faker";

export interface SubjectProps {
	id: number;
	full_name: string;
	short_name: string;
	created_at: string;
}

export type SubjectPostProps = Omit<SubjectProps, "id" | "created_at">;

const VALID_SUBJECTS = [
	{ full_name: "Matemática", short_name: "MT" },
	{ full_name: "Português", short_name: "PT" },
	{ full_name: "História", short_name: "HS" },
	{ full_name: "Geografia", short_name: "GG" },
	{ full_name: "Ciências", short_name: "CN" },
];

export function createFakeSubject(): SubjectProps {
	const subject = faker.helpers.arrayElement(VALID_SUBJECTS);
	return {
		id: faker.number.int(),
		full_name: subject.full_name,
		short_name: subject.short_name,
		created_at: faker.date.past().toISOString().split("T")[0],
	};
}

export const FakeSubject = createFakeSubject();
