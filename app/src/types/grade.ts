import { faker } from "@faker-js/faker";
import { SubjectProps, createFakeSubject } from "./subject";

export interface GradeProps {
	id: number;
	subject: SubjectProps;
	year: number;
	bimester: string;
	value: number;
	created_at: string;
}

export function createFakeGrade(year?: number): GradeProps {
	return {
		id: faker.number.int(),
		subject: createFakeSubject(),
		year: year ?? faker.date.past({ years: 5 }).getFullYear(),
		bimester: faker.helpers.arrayElement([
			"1º Bimestre",
			"2º Bimestre",
			"3º Bimestre",
			"4º Bimestre",
		]),
		value: parseFloat((Math.random() * 6 + 4).toFixed(1)),
		created_at: faker.date.past().toISOString().split("T")[0],
	};
}

export const FakeGrade = createFakeGrade();
