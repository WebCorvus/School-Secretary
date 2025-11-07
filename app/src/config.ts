// API URL configuration
const API_BASE = process.env.NEXT_PUBLIC_PUBLIC_API_HOST || '/api/'
const API_INTERNAL_BASE =
    process.env.NEXT_PUBLIC_PRIVATE_API_HOST || 'http://api:8000/api/'

// Factory function to create routes based on a base URL
function createRoutes(base: string) {
<<<<<<< HEAD
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
        NOTIFICATIONS: `${schoolUrl}notifications/`,
        NOTIFICATIONS_MARK_READ: `${schoolUrl}notifications/{id}/mark-read/`,
        NOTIFICATIONS_MARK_ALL_READ: `${schoolUrl}notifications/mark-all-read/`,

        // RESOURCES app subpaths
        RESOURCE_LOANS: `${resourcesUrl}loans/`,
    }
=======
	// Django apps base URLs as variables
	const adminUrl = `${base}admin/`;
	const usersUrl = `${base}users/`;
	const studentsUrl = `${base}students/`;
	const schoolUrl = `${base}school/`;
	const resourcesUrl = `${base}resources/`;
	const accountsUrl = `${base}accounts/`;
	const academicsUrl = `${base}academics/`;

	return {
		// Main paths
		ADMIN: adminUrl,
		USERS: usersUrl,
		STUDENTS: studentsUrl,
		SCHOOL: schoolUrl,
		RESOURCES: resourcesUrl,
		ACCOUNTS: accountsUrl,
		ACADEMICS: academicsUrl,

		// USERS app subpaths
		USER_INFO: `${usersUrl}me/`,
		LOGIN: `${accountsUrl}token/`,
		REFRESH: `${accountsUrl}token/refresh/`,

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
		NOTIFICATIONS: `${schoolUrl}notifications/`,
		NOTIFICATIONS_MARK_READ: `${schoolUrl}notifications/{id}/mark-read/`,
		NOTIFICATIONS_MARK_ALL_READ: `${schoolUrl}notifications/mark-all-read/`,

		// RESOURCES app subpaths
		RESOURCE_LOANS: `${resourcesUrl}loans/`,
	};
>>>>>>> e12843a (feat: Add PDF download buttons to student detail page)
}

// Export routes for application use
const ROUTES = createRoutes(API_BASE)
const ROUTES_INTERNAL = createRoutes(API_INTERNAL_BASE)

export { ROUTES, ROUTES_INTERNAL }
