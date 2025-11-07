import { faker } from '@faker-js/faker'
import { createFakeGroupCompact, type GroupCompactProps } from './group'
import {
    createFakeGuardianCompact,
    type GuardianCompactProps,
} from './guardian'
import {
    createFakePresenceCompact,
    type PresenceCompactProps,
} from './presence'

export interface StudentSubjectGradesProps {
    subject: string
    grades: number[]
}

export function createFakeStudentSubjectGrades(): StudentSubjectGradesProps {
    return {
        subject: faker.lorem.word(),
        grades: Array.from({ length: 4 }, () =>
            faker.number.int({ min: 0, max: 10 }),
        ),
    }
}

export interface StudentCompactProps {
    id: number
    full_name: string
    registration_number: string
}

export function createFakeStudentCompact(): StudentCompactProps {
    return {
        id: faker.number.int(),
        full_name: faker.person.fullName(),
        registration_number: faker.string.numeric(6),
    }
}

export const FakeStudentCompact: StudentCompactProps =
    createFakeStudentCompact()

export interface StudentProps {
    id: number
    user: number
    full_name: string
    registration_number: string
    phone_number: string
    email: string
    cpf: string
    birthday: string
    address: string
    group: number
    group_details?: GroupCompactProps
    grades_details?: StudentSubjectGradesProps[]
    presence_details?: PresenceCompactProps[]
    guardians_details?: GuardianCompactProps[]
    photoUrl?: string
    created_at: string
}

export type StudentPostProps = Omit<
    StudentProps,
    | 'id'
    | 'created_at'
    | 'user'
    | 'group_details'
    | 'grades_details'
    | 'presence_details'
    | 'guardians_details'
>

export function createFakeStudent(): StudentProps {
    const baseYear = faker.date.past({ years: 5 }).getFullYear()
    const yearsCount = faker.number.int({ min: 2, max: 5 })
    const years = Array.from({ length: yearsCount }, (_, i) => baseYear + i)

    return {
        id: faker.number.int(),
        user: faker.number.int(),
        full_name: faker.person.fullName(),
        registration_number: faker.string.numeric(6),
        phone_number: faker.phone.number(),
        email: faker.internet.email(),
        cpf: faker.string.numeric(11),
        birthday: faker.date.past({ years: 15 }).toISOString().split('T')[0],
        address: faker.location.zipCode(),
        group: faker.number.int(),
        group_details: createFakeGroupCompact(),
        grades_details: Array.from(
            { length: 5 },
            createFakeStudentSubjectGrades,
        ),
        presence_details: Array.from(
            { length: faker.number.int({ min: 1, max: 5 }) },
            () => createFakePresenceCompact(),
        ),
        guardians_details: Array.from(
            { length: faker.number.int({ min: 1, max: 2 }) },
            () => createFakeGuardianCompact(),
        ),
        photoUrl: faker.image.avatar(),
        created_at: faker.date.past().toISOString(),
    }
}

export const FakeStudent: StudentProps = createFakeStudent()
