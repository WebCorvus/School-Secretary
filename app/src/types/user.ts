import { faker } from "@faker-js/faker";
import { StudentProps, createFakeStudent } from "./student";
import { GuardianProps } from "./guardian";
import { ProfessorProps } from "./professor";

export const UserRole = {
	STUDENT: "STUDENT",
	GUARDIAN: "GUARDIAN",
	PROFESSOR: "PROFESSOR",
	STAFF: "STAFF",
	SUPERUSER: "SUPERUSER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface UserProps {
	id: number;
	email: string;
	name: string;
	role: UserRole;
	is_staff: boolean;
	is_active: boolean;
	profile_details?: StudentProps | GuardianProps | ProfessorProps;
}

export type UserPostProps = Omit<
	UserProps,
	"id" | "is_staff" | "is_active" | "profile_details"
> & {
	password?: string;
	profile?: any;
};

export function createFakeUser(): UserProps {
	const userRole = faker.helpers.arrayElement([
		"STUDENT",
		"GUARDIAN",
		"PROFESSOR",
		"STAFF",
		"SUPERUSER",
	]);

	// let profile_details:
	// 	| StudentProps
	// 	| GuardianProps
	// 	| ProfessorProps
	// 	| undefined;

	// switch (userRole) {
	// 	case "STUDENT":
	// 		profile_details = createFakeStudent();
	// 		break;
	// 	case "GUARDIAN":
	// 		profile_details = createFakeGuardian();
	// 		break;
	// 	case "PROFESSOR":
	// 		profile_details = createFakeProfessor();
	// 		break;
	// 	default:
	// 		profile_details = undefined;
	// }

	const profile_details = createFakeStudent();

	return {
		id: faker.number.int(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: userRole,
		is_staff: faker.datatype.boolean(),
		is_active: faker.datatype.boolean(),
		profile_details,
	};
}

export const FakeUser: UserProps = createFakeUser();
