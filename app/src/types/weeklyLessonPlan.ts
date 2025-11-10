import { faker } from '@faker-js/faker'
import { createFakeLesson, type LessonProps } from './lesson'
import {
    createFakeProfessorCompact,
    type ProfessorCompactProps,
} from './professor'

export interface WeeklyLessonPlanProps {
    id: number
    professor: number
    professor_details?: ProfessorCompactProps
    lesson: number
    lesson_details?: LessonProps
    week_start_date: string
    planning_content: string
    objectives: string
    resources_needed: string
    notes: string
    created_at: string
    updated_at: string
}

export type WeeklyLessonPlanPostProps = Omit<
    WeeklyLessonPlanProps,
    'id' | 'created_at' | 'updated_at' | 'professor_details' | 'lesson_details'
>

export function createFakeWeeklyLessonPlan(): WeeklyLessonPlanProps {
    return {
        id: faker.number.int(),
        professor: faker.number.int(),
        professor_details: createFakeProfessorCompact(),
        lesson: faker.number.int(),
        lesson_details: createFakeLesson(),
        week_start_date: faker.date.future().toISOString().split('T')[0],
        planning_content: faker.lorem.paragraphs(2),
        objectives: faker.lorem.sentence(),
        resources_needed: faker.lorem.words(5),
        notes: faker.lorem.sentence(),
        created_at: faker.date.past().toISOString(),
        updated_at: faker.date.recent().toISOString(),
    }
}

export const FakeWeeklyLessonPlan: WeeklyLessonPlanProps =
    createFakeWeeklyLessonPlan()
