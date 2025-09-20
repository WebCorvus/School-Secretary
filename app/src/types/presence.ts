import { faker } from "@faker-js/faker";
import { StudentCompactProps, createFakeStudentCompact } from "./student";

export interface PresenceProps {
  id: number;
  student: number;
  student_details?: StudentCompactProps;
  date: string;
  presence: boolean;
  created_at: string;
}

export type PresencePostProps = Omit<PresenceProps, "id" | "created_at" | "student_details">;

export function createFakePresence(): PresenceProps {
  return {
    id: faker.number.int(),
    student: faker.number.int(),
    student_details: createFakeStudentCompact(),
    date: faker.date.past().toISOString().split("T")[0],
    presence: faker.datatype.boolean(),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakePresence: PresenceProps = createFakePresence();
