# New Features Implementation Summary

This document describes the new features added to the School Secretary system to align with the final project scope.

## 1. Weekly Lesson Planning (Planejamento Semanal)

### Backend Implementation

**Model:** `WeeklyLessonPlan` in `api/school/models.py`

Allows professors to create weekly lesson plans with the following fields:
- Professor (ForeignKey to Professor)
- Lesson (ForeignKey to Lesson)
- Week start date
- Planning content (main planning text)
- Objectives (learning objectives)
- Resources needed (materials and resources)
- Notes (additional observations)

**API Endpoints:**

- `GET /api/school/weekly-plans/` - List all weekly lesson plans
- `POST /api/school/weekly-plans/` - Create a new weekly lesson plan
- `GET /api/school/weekly-plans/{id}/` - Get specific plan details
- `PUT /api/school/weekly-plans/{id}/` - Update a plan
- `DELETE /api/school/weekly-plans/{id}/` - Delete a plan

**Permissions:**
- List/Retrieve: Authenticated users
- Create/Update/Delete: Professors only
- Professors can only see/edit their own plans (unless staff/superuser)

### Usage Example

```python
# Create a weekly lesson plan
POST /api/school/weekly-plans/
{
    "professor": 1,
    "lesson": 5,
    "week_start_date": "2025-11-01",
    "planning_content": "Esta semana vamos estudar os conceitos de herança em POO",
    "objectives": "- Compreender herança\n- Implementar classes derivadas",
    "resources_needed": "Computadores, IDE instalada"
}
```

## 2. Efficiency Analysis (Análise de Eficiência)

### Backend Implementation

**Functions in `api/utils/reports.py`:**

#### 2.1 Approval Rate (Taxa de Aprovação)

`calculate_approval_rate(group=None, year=None)`

Calculates the approval rate based on student grades:
- Students with average grade ≥ 6.0 are considered approved
- Can be filtered by group and/or year
- Returns total students, approved count, failed count, and approval rate percentage

#### 2.2 Dropout Rate (Taxa de Evasão)

`calculate_dropout_rate(group=None, year=None)`

Calculates the dropout/evasion rate based on:
- Students with no presence records in the last 30 days
- OR students with absence rate > 75% in the last 30 days
- Returns total enrolled, active students, dropout count, and dropout rate percentage

#### 2.3 Comprehensive Analysis

`generate_efficiency_analysis(group=None, year=None)`

Combines both approval and dropout analysis into a single comprehensive report.

**API Endpoints:**

- `GET /api/students/efficiency-analysis/?year=2025` - Global efficiency analysis
- `GET /api/school/groups/{id}/efficiency-analysis/?year=2025` - Per group analysis

**Response Example:**

```json
{
    "approval_analysis": {
        "total_students": 100,
        "approved_students": 85,
        "failed_students": 15,
        "approval_rate": 85.0,
        "year": 2025,
        "group": "3º Ano A"
    },
    "dropout_analysis": {
        "total_enrolled": 100,
        "active_students": 95,
        "dropout_students": 5,
        "dropout_rate": 5.0,
        "year": 2025,
        "group": "3º Ano A"
    },
    "summary": {
        "year": 2025,
        "group": "3º Ano A",
        "total_students_evaluated": 100,
        "approval_rate": 85.0,
        "dropout_rate": 5.0,
        "retention_rate": 95.0
    }
}
```

## 3. Inbox/Notifications Page

### Frontend Implementation

**Location:** `/app/src/app/(annoucements)/inbox/page.tsx`

A new page for users to view and manage their notifications.

**Features:**
- View all notifications
- Filter unread notifications
- Mark individual notification as read
- Mark all notifications as read
- Color-coded badges by notification type
- Display notification timestamp

**Hook:** `useNotification` in `/app/src/hooks/useNotification.ts`

Provides methods:
- `data` - Array of notifications
- `loading` - Loading state
- `error` - Error message if any
- `refetch()` - Manually refresh notifications
- `markAsRead(id)` - Mark specific notification as read
- `markAllAsRead()` - Mark all notifications as read

**Notification Types:**
- GRADE - Nota
- ABSENCE - Falta
- WARNING - Advertência
- SUSPENSION - Suspensão
- EVENT - Evento
- ASSIGNMENT - Trabalho
- EXAM - Prova
- PAYMENT - Pagamento
- GENERAL - Geral

### Usage

Navigate to `/inbox` to view the notifications page.

## 4. Enhanced Authentication

### Frontend Implementation

**Fixed Issues in `app/src/services/api.ts`:**

1. **Token Refresh:** Response interceptor properly handles 401 errors and refreshes tokens
2. **Redirect on Auth Failure:** Automatically redirects to login page on 403 Forbidden or failed token refresh
3. **Proper Async Handling:** Ensures token refresh completes before retrying failed requests

**Flow:**
1. Request fails with 401 Unauthorized
2. Interceptor tries to refresh token using `/auth/refresh` endpoint
3. If refresh succeeds, retry original request with new token
4. If refresh fails or 403 occurs, redirect to `/auth/login`

## 5. Configuration Updates

**File:** `app/src/config.ts`

Added new routes for notifications:
- `NOTIFICATIONS` - Base notifications endpoint
- `NOTIFICATIONS_MARK_READ` - Mark single notification as read
- `NOTIFICATIONS_MARK_ALL_READ` - Mark all as read

## Testing the New Features

### 1. Test Weekly Lesson Planning

```bash
# Create a professor user first
# Then create a lesson plan
curl -X POST http://localhost:8080/api/school/weekly-plans/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "professor": 1,
    "lesson": 1,
    "week_start_date": "2025-11-01",
    "planning_content": "Test planning content"
  }'
```

### 2. Test Efficiency Analysis

```bash
# Get global efficiency analysis
curl http://localhost:8080/api/students/efficiency-analysis/?year=2025 \
  -H "Authorization: Bearer <token>"

# Get group-specific analysis
curl http://localhost:8080/api/school/groups/1/efficiency-analysis/?year=2025 \
  -H "Authorization: Bearer <token>"
```

### 3. Test Notifications Inbox

1. Navigate to http://localhost:8080/inbox
2. Should display all notifications for the logged-in user
3. Test marking notifications as read
4. Test mark all as read functionality

## Database Schema Changes

### New Table: school_weeklylessonplan

```sql
CREATE TABLE school_weeklylessonplan (
    id SERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES school_professor(id),
    lesson_id INTEGER NOT NULL REFERENCES school_lesson(id),
    week_start_date DATE NOT NULL,
    planning_content TEXT NOT NULL,
    objectives TEXT,
    resources_needed TEXT,
    notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    UNIQUE (lesson_id, week_start_date)
);
```

## Final Scope Compliance

All features implemented align with the Final Scope (Escopo Final):

✅ **I. HISTÓRICO ACADÊMICO** - Existing functionality verified
✅ **II. GESTÃO DE FALTAS** - Existing functionality with 25% notification logic
✅ **III. AGENDA ESCOLAR E NOTIFICAÇÕES** - Enhanced with weekly planning and inbox
✅ **IV. GESTÃO DE MATERIAIS E RECURSOS** - Existing functionality verified
✅ **V. RELATÓRIO E ANÁLISE GERENCIAL** - Enhanced with efficiency analysis (approval & dropout rates)

## Next Steps

1. Run database migrations (see MIGRATION_INSTRUCTIONS.md)
2. Test all endpoints with authentication
3. Verify frontend pages work correctly
4. Run automated tests
5. Update user documentation
