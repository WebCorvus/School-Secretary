import { faker } from "@faker-js/faker";

export interface SubjectProps {
  id: number;
  short_name: string;
  full_name: string;
  created_at: string;
}

export type SubjectPostProps = Omit<SubjectProps, "id" | "created_at">;

export function createFakeSubject(): SubjectProps {
  return {
    id: faker.number.int(),
    short_name: faker.lorem.words(2),
    full_name: faker.lorem.words(3),
    created_at: faker.date.past().toISOString(),
  };
}

export const FakeSubject: SubjectProps = createFakeSubject();

export interface SubjectCompactProps {
  id: number;
  short_name: string;
  full_name: string;
}

export function createFakeSubjectCompact(): SubjectCompactProps {
  return {
    id: faker.number.int(),
    short_name: faker.lorem.words(2),
    full_name: faker.lorem.words(3),
  };
}

export const FakeSubjectCompact: SubjectCompactProps = createFakeSubjectCompact();