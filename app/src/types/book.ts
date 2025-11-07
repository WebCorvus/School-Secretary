import { faker } from '@faker-js/faker'
import { createFakeStudentCompact, type StudentCompactProps } from './student'

export interface BookProps {
    id: number
    name: string
    tenant: number
    tenant_details?: StudentCompactProps
    author: string
    summary: string
    created_at: string
}

export type BookPostProps = Omit<
    BookProps,
    'id' | 'created_at' | 'tenant_details'
>

export function createFakeBook(): BookProps {
    return {
        id: faker.number.int(),
        name: faker.lorem.words(3),
        tenant: faker.number.int(),
        tenant_details: createFakeStudentCompact(),
        author: faker.person.fullName(),
        summary: faker.lorem.paragraph(),
        created_at: faker.date.past().toISOString(),
    }
}

export const FakeBook: BookProps = createFakeBook()
