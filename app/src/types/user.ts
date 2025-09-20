import { StudentProps, FakeStudent } from "./student";
import { ProfessorProps, FakeProfessor } from "./professor";
import { GuardianProps, FakeGuardian } from "./guardian";
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
	profile: StudentProps;
}

export interface GuardianUser extends BaseUser {
	role: UserRole.GUARDIAN;
	profile: GuardianProps;
}

export interface ProfessorUser extends BaseUser {
	role: UserRole.PROFESSOR;
	profile: ProfessorProps;
}

export interface StaffUser extends BaseUser {
	role: UserRole.STAFF;
	profile?: null;
}

export interface SuperuserUser extends BaseUser {
	role: UserRole.SUPERUSER;
	profile?: null;
}

export type UserProps =
	| StudentUser
	| GuardianUser
	| ProfessorUser
	| StaffUser
	| SuperuserUser;

export const FakeStudentUser: StudentUser = {
	id: faker.number.int(),
	email: faker.internet.email(),
	name: faker.person.fullName(),
	role: UserRole.STUDENT,
	profile: FakeStudent,
};

export const FakeGuardianUser: GuardianUser = {
	id: faker.number.int(),
	email: faker.internet.email(),
	name: faker.person.fullName(),
	role: UserRole.GUARDIAN,
	profile: FakeGuardian,
};

export const FakeProfessorUser: ProfessorUser = {
	id: faker.number.int(),
	email: faker.internet.email(),
	name: faker.person.fullName(),
	role: UserRole.PROFESSOR,
	profile: FakeProfessor,
};

export const FakeStaffUser: StaffUser = {
	id: faker.number.int(),
	email: faker.internet.email(),
	name: faker.person.fullName(),
	role: UserRole.STAFF,
};

export const FakeSuperuserUser: SuperuserUser = {
	id: faker.number.int(),
	email: faker.internet.email(),
	name: faker.person.fullName(),
	role: UserRole.SUPERUSER,
};
