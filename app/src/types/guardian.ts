// types/guardian.ts
import { FakeStudent, StudentProps } from "./student";

export interface GuardianProps {
	id: number;
	full_name: string;
	student: number;
	student_details?: StudentProps;
	phone_number: string;
	email: string;
	cpf: string;
	birthday: string;
	address: string;
	photoUrl?: string; // TODO add a real url
	created_at: string;
}

export type GuardianPostProps = Omit<
	GuardianProps,
	"id" | "created_at" | "student_details"
>;

export const FakeGuardian: GuardianProps = {
	id: 1,
	full_name: "Nome de Teste do Responsável",
	student: 1,
	student_details: FakeStudent,
	phone_number: "(62) 91111-1111",
	email: "guardian@test.com",
	cpf: "12345678901",
	birthday: "1980-01-01",
	address: "74371420",
	photoUrl: "https://picsum.photos/200/300", // TODO add a real url
	created_at: "2025-09-19T09:12:53.081919-03:00",
};
