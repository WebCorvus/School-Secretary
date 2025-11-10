// API URL configuration
const API_BASE = process.env.NEXT_PUBLIC_PUBLIC_API_HOST || `/api/`;
const API_INTERNAL_BASE =
    process.env.NEXT_PUBLIC_PRIVATE_API_HOST || `http://api:8000/api/`;

// Factory function to create routes based on a base URL
function createRoutes(base: string) {
    // Django apps base URLs as variables
    const usersUrl = `${base}users/`;
    const studentsUrl = `${base}students/`;
    const schoolUrl = `${base}school/`;
    const resourcesUrl = `${base}resources/`;

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
    };
}

// Frontend navigation routes
const createNavigation = () => {
    const apiPrefix = `/api/`;
    const adminPrefix = `${apiPrefix}admin/`;

    return {
        // Main pages
        DASHBOARD: `/dashboard`,
        LOGIN: `/`,
        PROFILE: `/profile`,
        WEEK_PLANNING: `/week-planning`,
        RESOURCES: `/resources`,
        AGENDA: `/agenda`,
        EVENTS: `/events`,
        INBOX: `/inbox`,
        LESSONS: `/lessons`,
        ABOUT: `/about`,
        STUDENTS: `/students`,
        PROFESSORS: `/professors`,
        GROUPS: `/groups`,
        SUBJECTS: `/subjects`,
        ITINERARIES: `/itineraries`,

        // Admin pages (Django admin)
        ADMIN: `${adminPrefix}`,
        ADMIN_USERS: `${adminPrefix}users/user/`,
        ADMIN_STUDENTS_GRADE: `${adminPrefix}students/grade/`,
        ADMIN_STUDENTS_ATTENDANCE: `${adminPrefix}students/attendance/`,
        ADMIN_STUDENTS_STUDENT: `${adminPrefix}students/student/`,
        ADMIN_SCHOOL_ANNOUNCEMENT: `${adminPrefix}school/announcement/`,
        ADMIN_SCHOOL_CLASS: `${adminPrefix}school/class/`,
        ADMIN_SCHOOL_LESSON_PLAN: `${adminPrefix}school/lessonplan/`,
        ADMIN_REPORTS: `${adminPrefix}reports/`,
        ADMIN_AUTH_GROUP: `${adminPrefix}auth/group/`,
    };
};

// Export routes for application use
const ROUTES = createRoutes(API_BASE);
const ROUTES_INTERNAL = createRoutes(API_INTERNAL_BASE);
const NAVIGATION = createNavigation();

export { ROUTES, ROUTES_INTERNAL, NAVIGATION };
