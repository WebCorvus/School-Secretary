import { faker } from "@faker-js/faker";
import { StudentCompactProps, createFakeStudentCompact } from "./student";
import { SubjectCompactProps, createFakeSubjectCompact } from "./subject";

export interface GradeProps {
  id: number;
  student: number;
  student_details?: StudentCompactProps;
  subject: number;
  subject_details?: SubjectCompactProps;
  year: number;
  bimester: string;
  value: number;
  created_at: string;
}

export type GradePostProps = Omit<GradeProps, "id" | "created_at" | "student_details" | "subject_details">;

export function createFakeGrade(year?: number): GradeProps {
  return {
    id: faker.number.int(),
    student: faker.number.int(),
    student_details: createFakeStudentCompact(),
    subject: faker.number.int(),
    subject_details: createFakeSubjectCompact(),
    year: year || faker.number.int({ min: 2020, max: 2025 }),
    bimester: faker.helpers.arrayElement(["1B", "2B", "3B", "4B"]),
    value: faker.number.float({ min: 0, max: 10, precision: 0.1 }),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeGrade: GradeProps = createFakeGrade();