import { faker } from '@faker-js/faker'
import { createFakeSubjectCompact, type SubjectCompactProps } from './subject'

export interface ProfessorProps {
    id: number
    user: number
    full_name: string
    phone_number: string
    email: string
    cpf: string
    birthday: string
    address: string
    subject: number
    subject_details?: SubjectCompactProps
    photoUrl?: string
    created_at: string
}

export type ProfessorPostProps = Omit<
    ProfessorProps,
    'id' | 'created_at' | 'subject_details' | 'user'
>

export function createFakeProfessor(): ProfessorProps {
    return {
        id: faker.number.int(),
        user: faker.number.int(),
        full_name: faker.person.fullName(),
        phone_number: faker.phone.number(),
        email: faker.internet.email(),
        cpf: faker.string.numeric(11),
        birthday: faker.date.past({ years: 30 }).toISOString().split('T')[0],
        address: faker.location.zipCode(),
        subject: faker.number.int(),
        subject_details: createFakeSubjectCompact(),
        photoUrl: faker.image.avatar(),
        created_at: faker.date.past().toISOString(),
    }
}

export const FakeProfessor: ProfessorProps = createFakeProfessor()

export interface ProfessorCompactProps {
    id: number
    full_name: string
    email: string
}

export function createFakeProfessorCompact(): ProfessorCompactProps {
    return {
        id: faker.number.int(),
        full_name: faker.person.fullName(),
        email: faker.internet.email(),
    }
}

export const FakeProfessorCompact: ProfessorCompactProps =
    createFakeProfessorCompact()
