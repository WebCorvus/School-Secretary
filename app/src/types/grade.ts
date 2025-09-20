import type { SubjectProps } from "./subject";
import { faker } from "@faker-js/faker";
import { FakeSubject } from "./subject";

export interface GradeProps {
	id: number;
	subject: SubjectProps;
	year: number;
	bimester: string;
	value: number;
	created_at: string;
}

export const FakeGrade: GradeProps = {
	id: faker.number.int(),
	subject: FakeSubject,
	year: faker.date.past().getFullYear(),
	bimester: faker.helpers.arrayElement([
		"1º Bimestre",
		"2º Bimestre",
		"3º Bimestre",
		"4º Bimestre",
	]),
	value: faker.number.float({ min: 0, max: 10 }),
	created_at: faker.date.past().toISOString().split("T")[0],
};
