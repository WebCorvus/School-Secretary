import { faker } from '@faker-js/faker'

export interface DocumentRequest {
    id: number | string
    title: string
    type: 'BULLETIN' | 'PRESENCE' | 'DECLARATION' | 'HISTORY'
}

export function createFakeDocumentRequest(): DocumentRequest {
    return {
        id: faker.number.int(),
        title: faker.lorem.words(2),
        type: faker.helpers.arrayElement([
            'BULLETIN',
            'PRESENCE',
            'DECLARATION',
            'HISTORY',
        ]),
    }
}

export const FakeDocumentRequest: DocumentRequest = createFakeDocumentRequest()
