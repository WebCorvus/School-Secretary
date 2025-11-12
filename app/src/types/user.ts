import { faker } from '@faker-js/faker'
import type { GuardianProps } from './guardian'
import type { ProfessorProps } from './professor'
import { createFakeStudent, type StudentProps } from './student'

export const UserRole = {
    STUDENT: 'STUDENT',
    GUARDIAN: 'GUARDIAN',
    PROFESSOR: 'PROFESSOR',
    STAFF: 'STAFF',
    SUPERUSER: 'SUPERUSER',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface UserProps {
    id: number
    email: string
    name: string
    role: UserRole
    is_staff: boolean
    is_superuser: boolean
    is_active: boolean
    profile_details?: StudentProps | GuardianProps | ProfessorProps
}

export type UserPostProps = Omit<
    UserProps,
    'id' | 'is_staff' | 'is_active' | 'profile_details'
> & {
    password?: string
    profile?: StudentProps | GuardianProps | ProfessorProps
}

export function createFakeUser(): UserProps {
    const userRole = faker.helpers.arrayElement([
        'STUDENT',
        'GUARDIAN',
        'PROFESSOR',
        'STAFF',
        'SUPERUSER',
    ])

    // let profile_details:
    // 	| StudentProps
    // 	| GuardianProps
    // 	| ProfessorProps
    // 	| undefined;

    // switch (userRole) {
    // 	case "STUDENT":
    // 		profile_details = createFakeStudent();
    // 		break;
    // 	case "GUARDIAN":
    // 		profile_details = createFakeGuardian();
    // 		break;
    // 	case "PROFESSOR":
    // 		profile_details = createFakeProfessor();
    // 		break;
    // 	default:
    // 		profile_details = undefined;
    // }

    const profile_details = createFakeStudent()

    // Set is_staff and is_superuser based on role
    const isStaff = userRole === 'STAFF' || userRole === 'SUPERUSER'
    const isSuperuser = userRole === 'SUPERUSER'

    return {
        id: faker.number.int(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: userRole,
        is_staff: isStaff,
        is_superuser: isSuperuser,
        is_active: faker.datatype.boolean(),
        profile_details,
    }
}

export const FakeUser: UserProps = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.STUDENT,
    is_staff: false,
    is_superuser: false,
    is_active: true,
    profile_details: {
        id: 1,
        registration_number: '12345',
        cpf: '123.456.789-00',
        full_name: 'Test Student',
        phone_number: '11987654321',
        photoUrl: 'https://example.com/photo.jpg',
        birthday: '2000-01-01',
        group: 1,
        user: 1,
        created_at: '2023-01-01T00:00:00Z',
        grades_details: [],
        guardians_details: [],
        presence_details: [],
        group_details: {
            id: 1,
            full_name: 'Test Group',
            short_name: 'TG',
        },
        email: 'student@example.com',
        address: '123 Test Street',
    },
}
