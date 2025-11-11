// API URL configuration
const API_BASE = process.env.NEXT_PUBLIC_PUBLIC_API_HOST || `/api/`
const API_INTERNAL_BASE =
    process.env.NEXT_PUBLIC_PRIVATE_API_HOST || `http://api:8000/api/`

// Factory function to create routes based on a base URL
function createRoutes(base: string) {
    // Django apps base URLs as variables
    const usersUrl = `${base}users/`
    const studentsUrl = `${base}students/`
    const schoolUrl = `${base}school/`
    const resourcesUrl = `${base}resources/`

    return {
        // Main paths
        ADMIN: `${base}admin/`,
        USERS: usersUrl,
        STUDENTS: studentsUrl,
        SCHOOL: schoolUrl,
        RESOURCES: resourcesUrl,

        // USERS app subpaths
        USER_INFO: `${usersUrl}me/`,
        LOGIN: `${usersUrl}token/`,
        REFRESH: `${usersUrl}token/refresh/`,
        LOGOUT: `${usersUrl}token/logout/`,

        // SCHOOL app subpaths
        GROUPS: `${schoolUrl}groups/`,
        ITINERARIES: `${schoolUrl}itineraries/`,
        LESSONS: `${schoolUrl}lessons/`,
        PROFESSORS: `${schoolUrl}professors/`,
        SUBJECTS: `${schoolUrl}subjects/`,
        AGENDA: `${schoolUrl}agenda/`,
        AGENDA_PENDENTS: `${schoolUrl}agenda/pendents/`,
        EVENTS: `${schoolUrl}events/`,
        EVENTS_PENDENTS: `${schoolUrl}events/pendents/`,
        WEEKLY_PLANS: `${schoolUrl}weekly-plans/`,
        NOTIFICATIONS: `${schoolUrl}notifications/`,
        NOTIFICATIONS_MARK_READ: `${schoolUrl}notifications/{id}/mark-read/`,
        NOTIFICATIONS_MARK_ALL_READ: `${schoolUrl}notifications/mark-all-read/`,

        // RESOURCES app subpaths
        RESOURCE_LOANS: `${resourcesUrl}loans/`,

        // STUDENTS app subpaths
        GRADES: `${studentsUrl}grades/`,
        GUARDIANS: `${studentsUrl}guardians/`,
        CONTRACTS: `${studentsUrl}contracts/`,
        PRESENCES: `${studentsUrl}presences/`,
        WARNINGS: `${studentsUrl}warnings/`,
        SUSPENSIONS: `${studentsUrl}suspensions/`,
        TUITIONS: `${studentsUrl}tuitions/`,
        ENROLLMENTS: `${studentsUrl}enrollments/`,

        // Student-specific PDF download routes
        MY_GRADES: `${studentsUrl}{id}/download-grades/`,
        MY_PRESENCE: `${studentsUrl}{id}/download-presence/`,

        // Additional SCHOOL app subpaths (avoiding duplication)
        SCHOOL_RECORDS: `${schoolUrl}schoolrecords/`,
        BOOKS: `${schoolUrl}books/`,
        EVENT_REGISTRATIONS: `${schoolUrl}event-registrations/`,
        ROOMS: `${schoolUrl}rooms/`,
        ROOM_RESERVATIONS: `${schoolUrl}room-reservations/`,
    }
}

// Frontend navigation routes
const createNavigation = () => {
    const apiPrefix = `/api/`
    const adminPrefix = `${apiPrefix}admin/`

    return {
        // Main pages
        DASHBOARD: `/dashboard`,
        LOGIN: `/`,
        AUTH_LOGIN: `/auth/login`,
        AUTH_REFRESH: `/auth/refresh`,
        AUTH_LOGOUT: `/auth/logout`,
        PROFILE: `/profile`,
        WEEK_PLANNING: `/week-planning`,
        RESOURCES: `/resources`,
        AGENDA: `/agenda`,
        EVENTS: `/events`,
        INBOX: `/inbox`,
        LESSONS: `/lessons`,
        ABOUT: `/about`,

        // Admin pages (Django admin)
        ADMIN: `${adminPrefix}`,
        ADMIN_USERS: `${adminPrefix}users/user/`,
        ADMIN_STUDENTS_GRADE: `${adminPrefix}students/grade/`,
        ADMIN_STUDENTS_PRESENCE: `${adminPrefix}students/presence/`,
        ADMIN_STUDENTS_STUDENT: `${adminPrefix}students/student/`,
        ADMIN_STUDENTS: `${adminPrefix}students/student/`,
        ADMIN_SCHOOL_EVENT: `${adminPrefix}school/event/`,
        ADMIN_SCHOOL_GROUP: `${adminPrefix}school/group/`,
        ADMIN_SCHOOL_LESSON: `${adminPrefix}school/lesson/`,
        ADMIN_SCHOOL_WEEKLY_LESSON_PLAN: `${adminPrefix}school/weeklylessonplan/`,
        ADMIN_SCHOOL_PROFESSOR: `${adminPrefix}school/professor/`,
        ADMIN_AUTH_GROUP: `${adminPrefix}auth/group/`,
    }
}

// Export routes for application use
const ROUTES = createRoutes(API_BASE)
const ROUTES_INTERNAL = createRoutes(API_INTERNAL_BASE)
const NAVIGATION = createNavigation()

export { ROUTES, ROUTES_INTERNAL, NAVIGATION }
