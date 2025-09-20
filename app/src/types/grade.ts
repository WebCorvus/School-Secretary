import { faker } from "@faker-js/faker";
import { SubjectProps, createFakeSubject } from "./subject";
import { StudentProps, createFakeStudent } from "./student";

export interface GradeProps {
	id: number;
	student: number;
	student_details: StudentProps;
	subject: number;
	subject_details: SubjectProps;
	year: number;
	bimester: string;
	value: number;
	created_at: string;
}

export function createFakeGrade(year?: number): GradeProps {
	return {
		id: faker.number.int(),
		student: faker.number.int(),
		student_details: createFakeStudent(),
		subject: faker.number.int(),
		subject_details: createFakeSubject(),
		year: year ?? faker.date.past({ years: 5 }).getFullYear(),
		bimester: faker.helpers.arrayElement([
			"1B",
			"2B",
			"3B",
			"4B",
		]),
		value: parseFloat((Math.random() * 6 + 4).toFixed(1)),
		created_at: faker.date.past().toISOString().split("T")[0],
	};
}

export const FakeGrade = createFakeGrade();
