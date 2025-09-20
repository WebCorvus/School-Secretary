import { FakeGroup, GroupProps } from "./group";
import { GradeProps, FakeGrade } from "./grade";
import { faker } from "@faker-js/faker";

export interface GradesByYear {
	year: number;
	grades: GradeProps[];
}

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
	group_details: GroupProps | undefined;
	photoUrl?: string;
	created_at: string;
	grades_details: GradesByYear[];
}

export type StudentPostProps = Omit<
	StudentProps,
	"id" | "created_at" | "group_details" | "grades_details"
>;

function generateSubjects(count: number) {
	return Array.from({ length: count }, (_, i) => ({
		...FakeGrade.subject,
		id: i + 1,
		full_name: faker.word.noun() + ` ${i + 1}`,
		short_name: faker.word.adjective().slice(0, 2).toUpperCase(),
	}));
}

function generateGrades(yearsCount: number, subjectsCount = 5): GradesByYear[] {
	const baseYear = new Date().getFullYear() - yearsCount + 1;
	const gradesDetails: GradesByYear[] = [];
	const subjects = generateSubjects(subjectsCount);

	for (let i = 0; i < yearsCount; i++) {
		const year = baseYear + i;
		const grades: GradeProps[] = subjects.map((subject) => ({
			...FakeGrade,
			id: faker.number.int(),
			subject,
			year,
			bimester: "1º Bimestre",
			value: parseFloat((Math.random() * 6 + 4).toFixed(1)),
			created_at: faker.date.past().toISOString(),
		}));
		gradesDetails.push({ year, grades });
	}

	return gradesDetails;
}

export const FakeStudent: StudentProps = {
	id: faker.number.int(),
	full_name: faker.person.fullName(),
	registration_number: faker.string.numeric(6),
	phone_number: faker.phone.number(),
	email: faker.internet.email(),
	cpf: faker.string.numeric(11),
	birthday: faker.date.past({ years: 20 }).toISOString().split("T")[0],
	address: faker.location.zipCode(),
	group: faker.number.int(),
	group_details: FakeGroup,
	photoUrl: faker.image.avatar(),
	created_at: faker.date.past({ years: 20 }).toISOString().split("T")[0],
	grades_details: generateGrades(faker.number.int({ min: 3, max: 5 }), 4),
};
