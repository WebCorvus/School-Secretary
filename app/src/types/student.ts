import { FakeGroup, GroupProps } from "./group";
import { GradeProps } from "./grade";
import { faker } from "@faker-js/faker";
import { FakeSubject, SubjectProps } from "./subject";

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

const SUBJECTS: SubjectProps[] = [
	{ ...FakeSubject, id: 1, full_name: "Matemática", short_name: "MT" },
	{ ...FakeSubject, id: 2, full_name: "Português", short_name: "PT" },
	{ ...FakeSubject, id: 3, full_name: "História", short_name: "HS" },
	{ ...FakeSubject, id: 4, full_name: "Geografia", short_name: "GG" },
	{ ...FakeSubject, id: 5, full_name: "Ciências", short_name: "GG" },
];

function generateGradesSequence(yearsCount: number): GradesByYear[] {
	const baseYear = faker.date.past({ years: 5 }).getFullYear();
	const years = Array.from({ length: yearsCount }, (_, i) => baseYear + i);

	const firstYearGrades: GradeProps[] = SUBJECTS.map((subject) => ({
		id: faker.number.int(),
		subject,
		year: years[0],
		bimester: "1º Bimestre",
		value: parseFloat(faker.number.float({ min: 4, max: 10 }).toFixed(1)),
		created_at: faker.date.past().toISOString(),
	}));

	const gradesDetails: GradesByYear[] = [
		{ year: years[0], grades: firstYearGrades },
	];

	for (let i = 1; i < years.length; i++) {
		const prevGrades = gradesDetails[i - 1].grades;
		const newGrades: GradeProps[] = prevGrades.map((prev) => {
			const variation = parseFloat(
				faker.number.float({ min: -1, max: 1 }).toFixed(1)
			);
			let newValue = prev.value + variation;
			if (newValue > 10) newValue = 10;
			if (newValue < 0) newValue = 0;
			return {
				...prev,
				id: faker.number.int(),
				year: years[i],
				value: parseFloat(newValue.toFixed(1)),
				created_at: faker.date.past().toISOString(),
			};
		});
		gradesDetails.push({ year: years[i], grades: newGrades });
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
	grades_details: generateGradesSequence(
		faker.number.int({ min: 3, max: 5 })
	),
};
