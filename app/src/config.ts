const API_BASE = process.env.NEXT_PUBLIC_API_HOST || "/api/";
const API_INTERNAL_BASE =
	process.env.NEXT_PUBLIC_INTERNAL_API_HOST || "http://api:8000/api/";

const paths = {
	ADMIN: "admin/",
	USERS: "users/",
	STUDENTS: "students/",
	SCHOOL: "school/",
};

const subPaths = {
	// USERS
	USER_INFO: "me/",
	LOGIN: "token/",
	REFRESH: "token/refresh/",

	// SCHOOL
	GROUPS: "groups/",
	ITINERARIES: "itineraries/",
	LESSONS: "lessons/",
	PROFESSORS: "professors/",
	SUBJECTS: "subjects/",
	AGENDA: "agenda/",
	AGENDA_PENDENTS: "agenda/pendents/",
	EVENTS: "events/",
	EVENTS_PENDENTS: "events/pendents/",
};

function makeRoutes(base: string) {
	const routes: Record<string, string> = {};

	(Object.keys(paths) as Array<keyof typeof paths>).forEach((key) => {
		routes[key] = `${base}${paths[key]}`;
	});

	// USERS
	routes.USER_INFO = `${routes.USERS}${subPaths.USER_INFO}`;
	routes.LOGIN = `${routes.USERS}${subPaths.LOGIN}`;
	routes.REFRESH = `${routes.USERS}${subPaths.REFRESH}`;

	// SCHOOL
	routes.GROUPS = `${routes.SCHOOL}${subPaths.GROUPS}`;
	routes.ITINERARIES = `${routes.SCHOOL}${subPaths.ITINERARIES}`;
	routes.LESSONS = `${routes.SCHOOL}${subPaths.LESSONS}`;
	routes.PROFESSORS = `${routes.SCHOOL}${subPaths.PROFESSORS}`;
	routes.SUBJECTS = `${routes.SCHOOL}${subPaths.SUBJECTS}`;
	routes.AGENDA = `${routes.SCHOOL}${subPaths.AGENDA}`;
	routes.AGENDA_PENDENTS = `${routes.SCHOOL}${subPaths.AGENDA_PENDENTS}`;
	routes.EVENTS = `${routes.SCHOOL}${subPaths.EVENTS}`;
	routes.EVENTS_PENDENTS = `${routes.SCHOOL}${subPaths.EVENTS_PENDENTS}`;

	return routes;
}

export const ROUTES = makeRoutes(API_BASE);
export const ROUTES_INTERNAL = makeRoutes(API_INTERNAL_BASE);
