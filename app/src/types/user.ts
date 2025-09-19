import { StudentProps, FakeStudent } from "./student";
import { ProfessorProps, FakeProfessor } from "./professor";
import { GuardianProps, FakeGuardian } from "./guardian";

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
	id: 1,
	email: "teste@email.com",
	name: "João Teste",
	role: UserRole.STUDENT,
	profile: FakeStudent,
};

export const FakeGuardianUser: GuardianUser = {
	id: 1,
	email: "guardian@test.com",
	name: "Responsável Teste",
	role: UserRole.GUARDIAN,
	profile: FakeGuardian,
};

export const FakeProfessorUser: ProfessorUser = {
	id: 1,
	email: "professor@test.com",
	name: "Professor Teste",
	role: UserRole.PROFESSOR,
	profile: FakeProfessor,
};

export const FakeStaffUser: StaffUser = {
	id: 1,
	email: "staff@test.com",
	name: "Staff Teste",
	role: UserRole.STAFF,
};

export const FakeSuperuserUser: SuperuserUser = {
	id: 1,
	email: "admin@test.com",
	name: "Admin Teste",
	role: UserRole.SUPERUSER,
};
