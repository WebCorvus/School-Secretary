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
        // Novos tipos para StudentPanelCard
        | 'MONITOR_CLASSES'
        | 'CHECK_ATTENDANCE_NEW'
        | 'VIEW_CALENDAR'
        | 'ACCESS_RESOURCES'
        | 'REQUEST_TRANSFER'
        | 'CHECK_FINANCIAL_STATUS'
        | 'REQUEST_RETAKE'
        | 'READ_ANNOUNCEMENTS'
        // Novos tipos para GuardianPanelCard
        | 'MONITOR_PERFORMANCE'
        | 'CHECK_CHILD_ATTENDANCE'
        | 'MANAGE_NOTIFICATIONS'
        | 'REQUEST_DOCUMENTS'
        | 'CONTACT_TEACHER'
        | 'MONITOR_HOMEWORK'
        | 'UPDATE_CONTACT'
        // Novos tipos para ProfessorPanelCard
        | 'RECORD_ATTENDANCE'
        | 'RECORD_GRADES'
        | 'CREATE_LESSON_PLAN'
        | 'MANAGE_CLASSES'
        | 'RECORD_INCIDENTS'
        | 'COMMUNICATE_GUARDIANS'
        | 'REQUEST_RESOURCES'
        | 'VIEW_ACADEMIC_SCHEDULE'
        // Novos tipos para StaffPanelCard
        | 'MANAGE_STUDENTS'
        | 'MANAGE_PROFESSORS'
        | 'MANAGE_LESSONS'
        | 'GENERATE_REPORTS'
        | 'FINANCIAL_CONTROL'
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
