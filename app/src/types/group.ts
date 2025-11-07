import { faker } from '@faker-js/faker'
import {
    createFakeItineraryCompact,
    type ItineraryCompactProps,
} from './itinerary'

export interface GroupProps {
    id: number
    full_name: string
    short_name: string
    itinerary: number
    itinerary_details?: ItineraryCompactProps
    created_at: string
}

export type GroupPostProps = Omit<
    GroupProps,
    'id' | 'created_at' | 'itinerary_details'
>

export function createFakeGroup(): GroupProps {
    return {
        id: faker.number.int(),
        full_name: faker.lorem.words(3),
        short_name: faker.lorem.words(2),
        itinerary: faker.number.int(),
        itinerary_details: createFakeItineraryCompact(),
        created_at: faker.date.past().toISOString(),
    }
}

export const FakeGroup: GroupProps = createFakeGroup()

export interface GroupCompactProps {
    id: number
    short_name: string
    full_name: string
}

export function createFakeGroupCompact(): GroupCompactProps {
    return {
        id: faker.number.int(),
        short_name: faker.lorem.words(2),
        full_name: faker.lorem.words(3),
    }
}

export const FakeGroupCompact: GroupCompactProps = createFakeGroupCompact()

import type { LessonProps } from './lesson'

export interface DailyLessonsViewProps {
    day: number
    lessons: (LessonProps | null)[]
}
