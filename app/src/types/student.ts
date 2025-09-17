import { FakeGroup, GroupProps } from "./group";

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
	created_at: string;
}

export type StudentPostProps = Omit<
	StudentProps,
	"id" | "created_at" | "group_details"
>;

export const FakeStudent = {
	id: 1,
	full_name: "Nome do Estudante",
	registration_number: "773984",
	phone_number: "(62) 99972-1283",
	email: "test@email.com",
	cpf: "30210244089",
	birthday: "2000-06-04",
	address: "74371420",
	group: 1,
	group_details: FakeGroup,
	created_at: "2000-06-04",
};
