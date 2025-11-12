import { faker } from '@faker-js/faker'

export interface DashboardLink {
    title: string
    url: string
}

export function createFakeDashboardLink(): DashboardLink {
    return {
        title: faker.lorem.words(2),
        url: faker.internet.url(),
    }
}

export const FakeDashboardLink: DashboardLink = createFakeDashboardLink()
