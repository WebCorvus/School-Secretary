# API Documentation

## Base URL

When running locally with Docker: `http://localhost:8080/api/`

## Authentication

Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

### Authentication Endpoints

-   `POST /api/users/token/` - Login and obtain access/refresh tokens
-   `POST /api/users/token/refresh/` - Refresh access token

## Endpoints by Category

### Users

-   `POST /api/users/token/` - Login (obtain JWT tokens)
-   `POST /api/users/token/refresh/` - Refresh JWT token
-   `GET /api/users/me/` - Get current user information

### School Management

#### Subjects (Matérias)

-   `GET /api/school/subjects/` - List all subjects
-   `POST /api/school/subjects/` - Create new subject (staff only)
-   `GET /api/school/subjects/{id}/` - Get subject details
-   `PUT /api/school/subjects/{id}/` - Update subject (staff only)
-   `DELETE /api/school/subjects/{id}/` - Delete subject (staff only)

#### Itineraries (Itinerários)

-   `GET /api/school/itineraries/` - List all itineraries
-   `POST /api/school/itineraries/` - Create new itinerary (staff only)
-   `GET /api/school/itineraries/{id}/` - Get itinerary details
-   `PUT /api/school/itineraries/{id}/` - Update itinerary (staff only)
-   `DELETE /api/school/itineraries/{id}/` - Delete itinerary (staff only)

#### Groups/Classes (Turmas)

-   `GET /api/school/groups/` - List all groups
-   `POST /api/school/groups/` - Create new group (staff only)
-   `GET /api/school/groups/{id}/` - Get group details
-   `PUT /api/school/groups/{id}/` - Update group (staff only)
-   `DELETE /api/school/groups/{id}/` - Delete group (staff only)
-   `GET /api/school/groups/{id}/get-lessons/` - Get weekly lessons schedule for group
-   `GET /api/school/groups/{id}/performance-report/` - Get group performance report
-   `GET /api/school/groups/{id}/efficiency-analysis/?year=2025` - Get efficiency analysis (approval & dropout rates) for group

#### Professors

-   `GET /api/school/professors/` - List all professors (staff only)
-   `POST /api/school/professors/` - Create new professor (staff only)
-   `GET /api/school/professors/{id}/` - Get professor details (staff only)
-   `PUT /api/school/professors/{id}/` - Update professor (staff only)
-   `DELETE /api/school/professors/{id}/` - Delete professor (staff only)

#### Lessons (Aulas)

-   `GET /api/school/lessons/` - List all lessons
-   `POST /api/school/lessons/` - Create new lesson (staff only)
-   `GET /api/school/lessons/{id}/` - Get lesson details
-   `PUT /api/school/lessons/{id}/` - Update lesson (staff only)
-   `DELETE /api/school/lessons/{id}/` - Delete lesson (staff only)

#### Weekly Lesson Plans (Planejamento Semanal)

-   `GET /api/school/weekly-plans/` - List weekly lesson plans (filtered by professor for non-staff)
-   `POST /api/school/weekly-plans/` - Create weekly lesson plan (professors only)
-   `GET /api/school/weekly-plans/{id}/` - Get lesson plan details
-   `PUT /api/school/weekly-plans/{id}/` - Update lesson plan (professor owner only)
-   `DELETE /api/school/weekly-plans/{id}/` - Delete lesson plan (professor owner only)

#### Agenda Items

-   `GET /api/school/agenda/` - List all agenda items
-   `POST /api/school/agenda/` - Create new agenda item (professors only)
-   `GET /api/school/agenda/{id}/` - Get agenda item details
-   `PUT /api/school/agenda/{id}/` - Update agenda item (professors only)
-   `DELETE /api/school/agenda/{id}/` - Delete agenda item (professors only)
-   `GET /api/school/agenda/pendents/` - Get upcoming agenda items

#### Events (Eventos)

-   `GET /api/school/events/` - List all events
-   `POST /api/school/events/` - Create new event (staff only)
-   `GET /api/school/events/{id}/` - Get event details
-   `PUT /api/school/events/{id}/` - Update event (staff only)
-   `DELETE /api/school/events/{id}/` - Delete event (staff only)
-   `GET /api/school/events/pendents/` - Get upcoming events
-   `POST /api/school/events/{id}/register/` - Register student for event

#### Event Registrations

-   `GET /api/school/event-registrations/` - List event registrations
-   `GET /api/school/event-registrations/{id}/` - Get registration details

#### Rooms (Salas)

-   `GET /api/school/rooms/` - List all rooms
-   `POST /api/school/rooms/` - Create new room (staff only)
-   `GET /api/school/rooms/{id}/` - Get room details
-   `PUT /api/school/rooms/{id}/` - Update room (staff only)
-   `DELETE /api/school/rooms/{id}/` - Delete room (staff only)

#### Room Reservations (Reservas de Sala)

-   `GET /api/school/room-reservations/` - List room reservations
-   `POST /api/school/room-reservations/` - Create reservation (professors only)
-   `GET /api/school/room-reservations/{id}/` - Get reservation details
-   `PUT /api/school/room-reservations/{id}/` - Update reservation (professors only)
-   `DELETE /api/school/room-reservations/{id}/` - Delete reservation (professors only)

#### Notifications (Notificações)

-   `GET /api/school/notifications/` - List user's notifications (filtered by user)
-   `POST /api/school/notifications/` - Create notification (staff only)
-   `GET /api/school/notifications/{id}/` - Get notification details
-   `PUT /api/school/notifications/{id}/` - Update notification (staff only)
-   `DELETE /api/school/notifications/{id}/` - Delete notification (staff only)
-   `POST /api/school/notifications/{id}/mark-read/` - Mark notification as read
-   `POST /api/school/notifications/mark-all-read/` - Mark all user notifications as read

#### Books (Livros)

-   `GET /api/school/books/` - List all books
-   `POST /api/school/books/` - Create new book (staff only)
-   `GET /api/school/books/{id}/` - Get book details
-   `PUT /api/school/books/{id}/` - Update book (staff only)
-   `DELETE /api/school/books/{id}/` - Delete book (staff only)

#### School Records (Registros Escolares)

-   `GET /api/school/schoolrecords/` - List school records (staff only)
-   `POST /api/school/schoolrecords/` - Create school record (staff only)
-   `GET /api/school/schoolrecords/{id}/` - Get record details (staff only)
-   `PUT /api/school/schoolrecords/{id}/` - Update record (staff only)
-   `DELETE /api/school/schoolrecords/{id}/` - Delete record (staff only)

### Students

#### Students (Alunos)

-   `GET /api/students/` - List all students
-   `POST /api/students/` - Create new student (staff only)
-   `GET /api/students/{id}/` - Get student details
-   `PUT /api/students/{id}/` - Update student (staff only)
-   `DELETE /api/students/{id}/` - Delete student (staff only)
-   `GET /api/students/{id}/download-grades/` - Download student grades PDF
-   `GET /api/students/{id}/download-presence/` - Download student presence PDF
-   `GET /api/students/{id}/academic-report/` - Get comprehensive academic report (JSON)
-   `GET /api/students/{id}/download-academic-report/` - Download academic report PDF
-   `GET /api/students/students-needing-attention/` - List students needing notifications
-   `GET /api/students/efficiency-analysis/?year=2025` - Get global efficiency analysis (approval & dropout rates)

#### Grades (Notas)

-   `GET /api/students/grades/` - List all grades
-   `POST /api/students/grades/` - Create grade (professors only)
-   `GET /api/students/grades/{id}/` - Get grade details
-   `PUT /api/students/grades/{id}/` - Update grade (professors only)
-   `DELETE /api/students/grades/{id}/` - Delete grade (professors only)

#### Presence (Presença)

-   `GET /api/students/presences/` - List presence records
-   `POST /api/students/presences/` - Create presence record (professors only)
-   `GET /api/students/presences/{id}/` - Get presence record
-   `PUT /api/students/presences/{id}/` - Update presence record (professors only)
-   `DELETE /api/students/presences/{id}/` - Delete presence record (professors only)
-   `GET /api/students/presences/absence-report/` - Get absence report (students with >25% absences)

#### Warnings (Advertências)

-   `GET /api/students/warnings/` - List warnings
-   `POST /api/students/warnings/` - Create warning (staff only)
-   `GET /api/students/warnings/{id}/` - Get warning details
-   `PUT /api/students/warnings/{id}/` - Update warning (staff only)
-   `DELETE /api/students/warnings/{id}/` - Delete warning (staff only)

#### Suspensions (Suspensões)

-   `GET /api/students/suspensions/` - List suspensions
-   `POST /api/students/suspensions/` - Create suspension (staff only)
-   `GET /api/students/suspensions/{id}/` - Get suspension details
-   `PUT /api/students/suspensions/{id}/` - Update suspension (staff only)
-   `DELETE /api/students/suspensions/{id}/` - Delete suspension (staff only)

#### Guardians (Responsáveis)

-   `GET /api/students/guardians/` - List guardians
-   `POST /api/students/guardians/` - Create guardian (staff only)
-   `GET /api/students/guardians/{id}/` - Get guardian details
-   `PUT /api/students/guardians/{id}/` - Update guardian (staff only)
-   `DELETE /api/students/guardians/{id}/` - Delete guardian (staff only)

#### Contracts (Contratos)

-   `GET /api/students/contracts/` - List contracts
-   `POST /api/students/contracts/` - Create contract (staff only)
-   `GET /api/students/contracts/{id}/` - Get contract details
-   `PUT /api/students/contracts/{id}/` - Update contract (staff only)
-   `DELETE /api/students/contracts/{id}/` - Delete contract (staff only)
-   `GET /api/students/contracts/{id}/download-contract/` - Download contract PDF

#### Tuitions (Mensalidades)

-   `GET /api/students/tuitions/` - List tuitions
-   `POST /api/students/tuitions/` - Create tuition (staff only)
-   `GET /api/students/tuitions/{id}/` - Get tuition details
-   `PUT /api/students/tuitions/{id}/` - Update tuition (staff only)
-   `DELETE /api/students/tuitions/{id}/` - Delete tuition (staff only)
-   `GET /api/students/tuitions/payment-history/?student_id={id}` - Get payment history
-   `GET /api/students/tuitions/financial-report/?student_id={id}` - Get financial report
-   `GET /api/students/tuitions/download-financial-report/?student_id={id}` - Download financial report PDF

#### Enrollments (Matrículas)

-   `GET /api/students/enrollments/` - List enrollments
-   `POST /api/students/enrollments/` - Create enrollment (staff only)
-   `GET /api/students/enrollments/{id}/` - Get enrollment details
-   `PUT /api/students/enrollments/{id}/` - Update enrollment (staff only)
-   `DELETE /api/students/enrollments/{id}/` - Delete enrollment (staff only)

### Resources & Loans (Recursos e Empréstimos)

#### Resources (Recursos)

-   `GET /api/resources/` - List all resources (books, computers, equipment)
-   `POST /api/resources/` - Create new resource (staff only)
-   `GET /api/resources/{id}/` - Get resource details
-   `PUT /api/resources/{id}/` - Update resource (staff only)
-   `DELETE /api/resources/{id}/` - Delete resource (staff only)

#### Resource Loans (Empréstimos)

-   `GET /api/resources/loans/` - List all loans
-   `POST /api/resources/loans/` - Create new loan (staff only)
-   `GET /api/resources/loans/{id}/` - Get loan details
-   `PUT /api/resources/loans/{id}/` - Update loan (staff only)
-   `DELETE /api/resources/loans/{id}/` - Delete loan (staff only)

## Permissions

-   **Public**: No authentication required
-   **Authenticated**: Any logged-in user
-   **Student**: Student role required
-   **Professor**: Professor role required
-   **Staff**: Staff or superuser role required
-   **Superuser**: Superuser role required

## Common Query Parameters

-   `search` - Search in specified fields (varies by endpoint)
-   `page` - Page number for pagination
-   `page_size` - Number of results per page

## Response Codes

-   `200 OK` - Request successful
-   `201 Created` - Resource created successfully
-   `204 No Content` - Resource deleted successfully
-   `400 Bad Request` - Invalid request data
-   `401 Unauthorized` - Authentication required
-   `403 Forbidden` - Permission denied
-   `404 Not Found` - Resource not found
-   `500 Internal Server Error` - Server error

## Example Usage

### Login

```bash
curl -X POST http://localhost:8080/api/users/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"student@school.com","password":"student123"}'
```

### Get Student Academic Report

```bash
curl http://localhost:8080/api/students/1/academic-report/ \
  -H "Authorization: Bearer <your_token>"
```

### Get Efficiency Analysis

```bash
curl http://localhost:8080/api/students/efficiency-analysis/?year=2025 \
  -H "Authorization: Bearer <your_token>"
```

### Create Weekly Lesson Plan (Professor)

```bash
curl -X POST http://localhost:8080/api/school/weekly-plans/ \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "professor": 1,
    "lesson": 1,
    "week_start_date": "2025-11-08",
    "planning_content": "Content for this week",
    "objectives": "Learning objectives",
    "resources_needed": "Materials needed"
  }'
```

### List Resources

```bash
curl http://localhost:8080/api/resources/ \
  -H "Authorization: Bearer <your_token>"
```

### Create Resource Loan

```bash
curl -X POST http://localhost:8080/api/resources/loans/ \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resource": 1,
    "student": 1,
    "loan_date": "2025-11-01",
    "return_date": "2025-11-15"
  }'
```
