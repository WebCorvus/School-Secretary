import { faker } from '@faker-js/faker'

export interface DocumentRequest {
    id: number | string
    title: string
    type:
        | 'BULLETIN'
        | 'PRESENCE'
        | 'DECLARATION'
        | 'HISTORY'
        | 'GRADE_INPUT'
        | 'ATTENDANCE_MARK'
        | 'CLASS_REPORT'
        | 'LESSON_PLAN'
        | 'MONITOR_BULLETIN'
        | 'CHECK_ATTENDANCE'
        | 'SCHOOL_COMMUNICATIONS'
        | 'STUDENT_REPORT'
        | 'MANAGE_USERS'
        | 'SYSTEM_SETTINGS'
        | 'GENERAL_REPORTS'
        | 'ACCESS_CONTROL'
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
