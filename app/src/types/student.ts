import { faker } from "@faker-js/faker";
import { GroupCompactProps, createFakeGroupCompact } from "./group";
import { createFakeGrade, type GradeProps } from "./grade";
import { PresenceCompactProps, createFakePresenceCompact } from "./presence";
import { GuardianCompactProps, createFakeGuardianCompact } from "./guardian";
import { createFakeSubject, type SubjectProps } from "./subject";

export interface GradeBySubject {
	subject: SubjectProps;
	grades: GradeProps[];
}

export type GradesByYear = Record<number, GradeBySubject[]>;

export function createFakeGradesByYear(year: number): GradesByYear {
	const subjectsCount = faker.number.int({ min: 3, max: 4 });

	const subjects: GradeBySubject[] = Array.from(
		{ length: subjectsCount },
		() => {
			const subject: SubjectProps = createFakeSubject();

			const grades: GradeProps[] = Array.from({ length: 4 }, () =>
				createFakeGrade(year)
			).map((g) => ({
				...g,
				subject: subject.id,
				subject_details: subject,
			}));

			return { subject, grades };
		}
	);

	return { [year]: subjects };
}

export const FakeGradesByYear = createFakeGradesByYear(
	faker.date.past({ years: 5 }).getFullYear()
);

export interface StudentCompactProps {
	id: number;
	full_name: string;
	registration_number: string;
}

export function createFakeStudentCompact(): StudentCompactProps {
	return {
		id: faker.number.int(),
		full_name: faker.person.fullName(),
		registration_number: faker.string.numeric(6),
	};
}

export const FakeStudentCompact: StudentCompactProps =
	createFakeStudentCompact();

export interface StudentProps {
	id: number;
	user: number;
	full_name: string;
	registration_number: string;
	phone_number: string;
	email: string;
	cpf: string;
	birthday: string;
	address: string;
	group: number;
	group_details?: GroupCompactProps;
	grades_details?: GradesByYear[];
	presence_details?: PresenceCompactProps[];
	guardians_details?: GuardianCompactProps[];
	created_at: string;
}

export type StudentPostProps = Omit<
	StudentProps,
	| "id"
	| "created_at"
	| "user"
	| "group_details"
	| "grades_details"
	| "presence_details"
	| "guardians_details"
>;

export function createFakeStudent(): StudentProps {
	const baseYear = faker.date.past({ years: 5 }).getFullYear();
	const yearsCount = faker.number.int({ min: 2, max: 5 });
	const years = Array.from({ length: yearsCount }, (_, i) => baseYear + i);

	return {
		id: faker.number.int(),
		user: faker.number.int(),
		full_name: faker.person.fullName(),
		registration_number: faker.string.numeric(6),
		phone_number: faker.phone.number(),
		email: faker.internet.email(),
		cpf: faker.string.numeric(11),
		birthday: faker.date.past({ years: 15 }).toISOString().split("T")[0],
		address: faker.location.zipCode(),
		group: faker.number.int(),
		group_details: createFakeGroupCompact(),
		grades_details: years.map((y) => createFakeGradesByYear(y)),
		presence_details: Array.from(
			{ length: faker.number.int({ min: 1, max: 5 }) },
			() => createFakePresenceCompact()
		),
		guardians_details: Array.from(
			{ length: faker.number.int({ min: 1, max: 2 }) },
			() => createFakeGuardianCompact()
		),
		created_at: faker.date.past().toISOString(),
	};
}

export const FakeStudent: StudentProps = createFakeStudent();
