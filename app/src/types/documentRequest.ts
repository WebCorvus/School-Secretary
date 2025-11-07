import { faker } from '@faker-js/faker'

export interface DocumentRequest {
    title: string
    type: 'BULLETIN' | 'PRESENCE' | 'DECLARATION' | 'HISTORY'
}

export function createFakeDocumentRequest(): DocumentRequest {
    return {
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
