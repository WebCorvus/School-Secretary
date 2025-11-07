import { faker } from '@faker-js/faker'

export interface LinkObjectProps {
    title: string
    url: string
}

export function createFakeLinkObject(): LinkObjectProps {
    return {
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
    }
}

export const FakeLinkObject = createFakeLinkObject()

export interface SelectOptionProps {
    id: number
    short_name?: string
    full_name?: string
}

export function createFakeSelectOption(): SelectOptionProps {
    return {
        id: faker.number.int(),
        short_name: faker.lorem.words(2),
        full_name: faker.lorem.words(4),
    }
}
