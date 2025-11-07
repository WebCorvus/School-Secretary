import { faker } from '@faker-js/faker'
import { createFakeGroupCompact, type GroupCompactProps } from './group'
import {
    createFakeProfessorCompact,
    type ProfessorCompactProps,
} from './professor'
import { createFakeSubjectCompact, type SubjectCompactProps } from './subject'

export interface LessonProps {
    id: number
    group: number
    group_details?: GroupCompactProps
    professor: number
    professor_details?: ProfessorCompactProps
    subject: number
    subject_details?: SubjectCompactProps
    time: number
    day: number
    created_at: string
}

export type LessonPostProps = Omit<
    LessonProps,
    | 'id'
    | 'created_at'
    | 'group_details'
    | 'professor_details'
    | 'subject_details'
>

export function createFakeLesson(): LessonProps {
    return {
        id: faker.number.int(),
        group: faker.number.int(),
        group_details: createFakeGroupCompact(),
        professor: faker.number.int(),
        professor_details: createFakeProfessorCompact(),
        subject: faker.number.int(),
        subject_details: createFakeSubjectCompact(),
        time: faker.number.int({ min: 1, max: 6 }),
        day: faker.number.int({ min: 0, max: 6 }),
        created_at: faker.date.past().toISOString(),
    }
}

export const FakeLesson: LessonProps = createFakeLesson()
