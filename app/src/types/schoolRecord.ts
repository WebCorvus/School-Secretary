import { faker } from "@faker-js/faker";
import { StudentCompactProps, createFakeStudentCompact } from "./student";

export interface SchoolRecordProps {
  id: number;
  student: number;
  student_details?: StudentCompactProps;
  description: string;
  created_at: string;
}

export type SchoolRecordPostProps = Omit<SchoolRecordProps, "id" | "created_at" | "student_details">;

export function createFakeSchoolRecord(): SchoolRecordProps {
  return {
    id: faker.number.int(),
    student: faker.number.int(),
    student_details: createFakeStudentCompact(),
    description: faker.lorem.paragraph(),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeSchoolRecord: SchoolRecordProps = createFakeSchoolRecord();
