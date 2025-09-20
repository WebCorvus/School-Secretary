// types/guardian.ts
import { FakeStudent, StudentProps } from "./student";
import { faker } from "@faker-js/faker";

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
	id: faker.number.int(),
	full_name: faker.person.fullName(),
	student: faker.number.int(),
	student_details: FakeStudent,
	phone_number: faker.phone.number(),
	email: faker.internet.email(),
	cpf: faker.string.numeric(11),
	birthday: faker.date.past().toISOString().split("T")[0],
	address: faker.location.zipCode(),
	photoUrl: faker.image.avatar(),
	created_at: faker.date.past().toISOString().split("T")[0],
};
