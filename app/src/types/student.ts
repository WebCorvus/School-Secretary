import { GradeProps, createFakeGrade } from "./grade";
import { faker } from "@faker-js/faker";
import { GroupProps, createFakeGroup } from "./group";

export interface GradesByYear {
	year: number;
	grades: GradeProps[];
}

// TODO handle bimesters
export function createFakeGradesByYear(year: number): GradesByYear {
	const subjectsCount = faker.number.int({ min: 3, max: 6 });
	const grades: GradeProps[] = Array.from({ length: subjectsCount }, () =>
		createFakeGrade(year)
	);
	return { year, grades };
}

export const FakeGradesByYear = createFakeGradesByYear(
	faker.date.past({ years: 5 }).getFullYear()
);

export interface StudentProps {
	id: number;
	full_name: string;
	registration_number: string;
	phone_number: string;
	email: string;
	cpf: string;
	birthday: string;
	address: string;
	group: number;
	group_details?: GroupProps;
	photoUrl?: string;
	created_at: string;
	grades_details: GradesByYear[];
}

export type StudentPostProps = Omit<
	StudentProps,
	"id" | "created_at" | "group_details" | "grades_details"
>;

export function createFakeStudent(): StudentProps {
	const baseYear = faker.date.past({ years: 5 }).getFullYear();
	const yearsCount = faker.number.int({ min: 2, max: 5 });
	const years = Array.from({ length: yearsCount }, (_, i) => baseYear + i);

	return {
		id: faker.number.int(),
		full_name: faker.person.fullName(),
		registration_number: faker.string.numeric(6),
		phone_number: faker.phone.number(),
		email: faker.internet.email(),
		cpf: faker.string.numeric(11),
		birthday: faker.date.past({ years: 20 }).toISOString().split("T")[0],
		address: faker.location.zipCode(),
		group: faker.number.int(),
		group_details: createFakeGroup(),
		photoUrl: faker.image.avatar(),
		created_at: faker.date.past({ years: 20 }).toISOString().split("T")[0],
		grades_details: years.map((y) => createFakeGradesByYear(y)),
	};
}

export const FakeStudent = createFakeStudent();
