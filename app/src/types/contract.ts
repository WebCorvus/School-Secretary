import { faker } from "@faker-js/faker";
import { GuardianCompactProps, createFakeGuardianCompact } from "./guardian";
import { StudentCompactProps, createFakeStudentCompact } from "./student";

export interface ContractProps {
  id: number;
  guardian: number;
  guardian_details?: GuardianCompactProps;
  student: number;
  student_details?: StudentCompactProps;
  created_at: string;
}

export type ContractPostProps = Omit<ContractProps, "id" | "created_at" | "guardian_details" | "student_details">;

export function createFakeContract(): ContractProps {
  return {
    id: faker.number.int(),
    guardian: faker.number.int(),
    guardian_details: createFakeGuardianCompact(),
    student: faker.number.int(),
    student_details: createFakeStudentCompact(),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeContract: ContractProps = createFakeContract();
