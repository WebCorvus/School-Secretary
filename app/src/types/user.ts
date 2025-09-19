import { StudentProps } from "./student";
import { ProfessorProps } from "./professor";
import { GuardianProps } from "./guardian";

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

export type UserType =
	| StudentUser
	| GuardianUser
	| ProfessorUser
	| StaffUser
	| SuperuserUser;
