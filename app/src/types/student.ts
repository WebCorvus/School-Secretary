import { faker } from "@faker-js/faker";
import { GroupCompactProps, createFakeGroupCompact } from "./group";
import { GradeProps, createFakeGrade } from "./grade"; // Assuming grade.ts will be created next
import { PresenceProps, createFakePresence } from "./presence"; // Assuming presence.ts will be created next
import { GuardianProps, createFakeGuardian } from "./guardian"; // Assuming guardian.ts will be created next

export interface StudentCompactProps {
  id: number;
  full_name: string;
  registration_number: string;
}

export function createFakeStudentCompact(): StudentCompactProps {
  return {
    id: faker.number.int(),
    full_name: faker.person.fullName(),
    registration_number: faker.string.numeric(6),
  };
}

export const FakeStudentCompact: StudentCompactProps = createFakeStudentCompact();

export interface StudentProps {
  id: number;
  user: number;
  full_name: string;
  registration_number: string;
  phone_number: string;
  email: string;
  cpf: string;
  birthday: string;
  address: string;
  group: number;
  group_details?: GroupCompactProps;
  grades_details?: GradeProps[];
  presence_details?: PresenceProps[];
  guardians_details?: GuardianProps[];
  created_at: string;
}

export type StudentPostProps = Omit<StudentProps, "id" | "created_at" | "user" | "group_details" | "grades_details" | "presence_details" | "guardians_details">;

export function createFakeStudent(): StudentProps {
  return {
    id: faker.number.int(),
    user: faker.number.int(),
    full_name: faker.person.fullName(),
    registration_number: faker.string.numeric(6),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11),
    birthday: faker.date.past({ years: 15 }).toISOString().split("T")[0],
    address: faker.location.zipCode(),
    group: faker.number.int(),
    group_details: createFakeGroupCompact(),
    grades_details: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => createFakeGrade()),
    presence_details: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => createFakePresence()),
    guardians_details: Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => createFakeGuardian()),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeStudent: StudentProps = createFakeStudent();