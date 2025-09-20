import { faker } from "@faker-js/faker";
import { StudentProps, createFakeStudent } from "./student";
import { GuardianProps, createFakeGuardian } from "./guardian";
import { ProfessorProps, createFakeProfessor } from "./professor";

export type UserRole = "STUDENT" | "GUARDIAN" | "PROFESSOR" | "STAFF" | "SUPERUSER";

export interface UserProps {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  is_staff: boolean;
  is_active: boolean;
}

export interface UserProfileProps extends UserProps {
  profile_details?: StudentProps | GuardianProps | ProfessorProps;
}

export type UserPostProps = Omit<UserProps, "id" | "is_staff" | "is_active"> & {
  password?: string;
  profile?: any; // This will be a JSON object for the related profile
};

export function createFakeUser(): UserProps {
  return {
    id: faker.number.int(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: faker.helpers.arrayElement(["STUDENT", "GUARDIAN", "PROFESSOR", "STAFF", "SUPERUSER"]),
    is_staff: faker.datatype.boolean(),
    is_active: faker.datatype.boolean(),
  };
}

export const FakeUser: UserProps = createFakeUser();

export function createFakeUserProfile(): UserProfileProps {
  const user = createFakeUser();
  let profile_details: StudentProps | GuardianProps | ProfessorProps | undefined;

  switch (user.role) {
    case "STUDENT":
      profile_details = createFakeStudent();
      break;
    case "GUARDIAN":
      profile_details = createFakeGuardian();
      break;
    case "PROFESSOR":
      profile_details = createFakeProfessor();
      break;
    default:
      profile_details = undefined;
  }

  return {
    ...user,
    profile_details,
  };
}

export const FakeUserProfile: UserProfileProps = createFakeUserProfile();