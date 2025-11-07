import { faker } from '@faker-js/faker'

export interface ButtonGridItemProps {
    id: number
    title: string
}

export function createFakeButtonGridItem(): ButtonGridItemProps {
    return {
        id: faker.number.int(),
        title: faker.lorem.words(2),
    }
}
