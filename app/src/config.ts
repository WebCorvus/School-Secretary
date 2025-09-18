export const EXTERNAL_API_HOST = "/api/";
export const INTERNAL_API_HOST = "http://api:8080/";

export const ADMIN_ROUTE = "admin/";

export const USERS_ROUTE = "users/";
export const USERS_INFO_ROUTE = USERS_ROUTE + "/info";
export const LOGIN_ROUTE = USERS_ROUTE + "token/";
export const REFRESH_ROUTE = USERS_ROUTE + "token/refresh/";

export const STUDENT_ROUTE = "students/";

export const SCHOOL_ROUTE = "school/";
export const GROUP_ROUTE = SCHOOL_ROUTE + "groups/";
export const ITINERARY_ROUTE = SCHOOL_ROUTE + "itineraries/";
export const LESSON_ROUTE = SCHOOL_ROUTE + "lessons/";
export const PROFESSOR_ROUTE = SCHOOL_ROUTE + "professors/";
export const SUBJECT_ROUTE = SCHOOL_ROUTE + "subjects/";

export const AGENDA_ROUTE = SCHOOL_ROUTE + "agenda/";
export const AGENDA_PENDENTS_ROUTE = AGENDA_ROUTE + "pendents/";

export const EVENT_ROUTE = SCHOOL_ROUTE + "events/";
export const EVENT_PENDENTS_ROUTE = EVENT_ROUTE + "pendents/";
