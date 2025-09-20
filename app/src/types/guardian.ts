import { faker } from "@faker-js/faker";
import { StudentCompactProps, createFakeStudentCompact } from "./student";

export interface GuardianProps {
  id: number;
  user: number;
  full_name: string;
  student: number;
  student_details?: StudentCompactProps;
  phone_number: string;
  email: string;
  cpf: string;
  birthday: string;
  address: string;
  created_at: string;
}

export type GuardianPostProps = Omit<GuardianProps, "id" | "created_at" | "user" | "student_details">;

export function createFakeGuardian(): GuardianProps {
  return {
    id: faker.number.int(),
    user: faker.number.int(),
    full_name: faker.person.fullName(),
    student: faker.number.int(),
    student_details: createFakeStudentCompact(),
    phone_number: faker.phone.number(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11),
    birthday: faker.date.past({ years: 30 }).toISOString().split("T")[0],
    address: faker.location.zipCode(),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeGuardian: GuardianProps = createFakeGuardian();

export interface GuardianCompactProps {
  id: number;
  full_name: string;
  phone_number: string;
}

export function createFakeGuardianCompact(): GuardianCompactProps {
  return {
    id: faker.number.int(),
    full_name: faker.person.fullName(),
    phone_number: faker.phone.number(),
  };
}

export const FakeGuardianCompact: GuardianCompactProps = createFakeGuardianCompact();