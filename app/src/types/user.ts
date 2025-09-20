import { StudentProps, createFakeStudent } from "./student";
import { ProfessorProps, createFakeProfessor } from "./professor";
import { GuardianProps, createFakeGuardian } from "./guardian";
import { faker } from '@faker-js/faker';

export enum UserRole {
	STUDENT = "STUDENT",
	GUARDIAN = "GUARDIAN",
	PROFESSOR = "PROFESSOR",
	STAFF = "STAFF",
	SUPERUSER = "SUPERUSER",
}

export interface BaseUser {
	id: number;
	email: string;
	name: string;
	role: UserRole;
}

export interface StudentUser extends BaseUser {
	role: UserRole.STUDENT;
	profile_details: StudentProps;
}

export interface GuardianUser extends BaseUser {
	role: UserRole.GUARDIAN;
	profile_details: GuardianProps;
}

export interface ProfessorUser extends BaseUser {
	role: UserRole.PROFESSOR;
	profile_details: ProfessorProps;
}

export interface StaffUser extends BaseUser {
	role: UserRole.STAFF;
	profile_details?: null;
}

export interface SuperuserUser extends BaseUser {
	role: UserRole.SUPERUSER;
	profile_details?: null;
}

export type UserProps =
	| StudentUser
	| GuardianUser
	| ProfessorUser
	| StaffUser
	| SuperuserUser;

export function createFakeStudentUser(): StudentUser {
	return {
		id: faker.number.int(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: UserRole.STUDENT,
		profile_details: createFakeStudent(),
	};
}

export const FakeStudentUser = createFakeStudentUser();

export function createFakeGuardianUser(): GuardianUser {
	return {
		id: faker.number.int(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: UserRole.GUARDIAN,
		profile_details: createFakeGuardian(),
	};
}

export const FakeGuardianUser = createFakeGuardianUser();

export function createFakeProfessorUser(): ProfessorUser {
	return {
		id: faker.number.int(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: UserRole.PROFESSOR,
		profile_details: createFakeProfessor(),
	};
}

export const FakeProfessorUser = createFakeProfessorUser();

export function createFakeStaffUser(): StaffUser {
	return {
		id: faker.number.int(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: UserRole.STAFF,
	};
}

export const FakeStaffUser = createFakeStaffUser();

export function createFakeSuperuserUser(): SuperuserUser {
	return {
		id: faker.number.int(),
		email: faker.internet.email(),
		name: faker.person.fullName(),
		role: UserRole.SUPERUSER,
	};
}

export const FakeSuperuserUser = createFakeSuperuserUser();
