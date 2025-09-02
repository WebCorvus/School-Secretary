export const API_BASE_URL = "/api/";
export const USERS_BASE_URL = `${API_BASE_URL}users/`;
export const LOGIN_BASE_URL = `${USERS_BASE_URL}token/`;
export const REFRESH_BASE_URL = `${USERS_BASE_URL}token/refresh/`;

export const STUDENT_BASE_URL = `${API_BASE_URL}students/`;

export const SCHOOL_BASE_URL = `${API_BASE_URL}school/`;
export const GROUP_BASE_URL = `${SCHOOL_BASE_URL}groups/`;
export const ITINERARY_BASE_URL = `${SCHOOL_BASE_URL}itineraries/`;
export const LESSON_BASE_URL = `${SCHOOL_BASE_URL}lessons/`;
export const PROFESSOR_BASE_URL = `${SCHOOL_BASE_URL}professors/`;
export const SUBJECT_BASE_URL = `${SCHOOL_BASE_URL}subjects/`;

export const AGENDA_BASE_URL = `${SCHOOL_BASE_URL}agenda/`;
export const AGENDA_PENDENTS_URL = `${AGENDA_BASE_URL}pendents/`;

export const EVENT_BASE_URL = `${SCHOOL_BASE_URL}events/`;
export const EVENT_PENDENTS_URL = `${EVENT_BASE_URL}pendents/`;