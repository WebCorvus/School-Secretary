import { FakeGroup, GroupProps } from "./group";
import { GradeProps } from "./grade";

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

export const FakeStudent: StudentProps = {
	id: 1,
	full_name: "Nome de Teste do Estudante",
	registration_number: "773984",
	phone_number: "(62) 99972-1283",
	email: "teste@email.com",
	cpf: "30210244089",
	birthday: "2000-06-04",
	address: "74371420",
	group: 1,
	group_details: FakeGroup,
	photoUrl: "https://picsum.photos/200/300",
	created_at: "2000-06-04",
	grades_details: [
		{
			year: 2023,
			grades: [
				{
					id: 1,
					subject: "Matemática",
					year: 2023,
					bimester: "1º Bimestre",
					value: 9.5,
					created_at: "2025-09-19T09:12:53.081919-03:00",
				},
			],
		},
		{
			year: 2024,
			grades: [
				{
					id: 2,
					subject: "Matemática",
					year: 2024,
					bimester: "1º Bimestre",
					value: 7.5,
					created_at: "2025-09-19T09:12:53.081919-03:00",
				},
			],
		},
	],
};
