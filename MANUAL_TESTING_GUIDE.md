# Manual Testing Guide

## Overview
This guide provides instructions for manually testing the new features implemented in this PR. Since automated Docker testing is not available in this environment, follow these steps to test locally.

## Prerequisites
- Docker and Docker Compose installed
- Port 8080 available on your machine

## Setup Instructions

### 1. Clone and Navigate to Repository
```bash
git clone https://github.com/WebCorvus/School-Secretary.git
cd School-Secretary
git checkout copilot/add-academic-performance-management
```

### 2. Generate Environment Files
```bash
./controller.sh genenvs
```

### 3. Build and Start Containers
```bash
docker compose build
docker compose up -d
```

Wait for all services to be healthy. You can check status with:
```bash
docker compose ps
```

### 4. Run Database Migrations
```bash
docker compose exec api uv run python manage.py makemigrations
docker compose exec api uv run python manage.py migrate
```

### 5. Create Test Data
```bash
docker compose exec api uv run python manage.py shell < create_test_data.py
```

Or manually enter Django shell and run the script:
```bash
docker compose exec api uv run python manage.py shell
```
Then copy/paste the content from `create_test_data.py`

## Test Scenarios

### Test 1: Authentication Fix ✅

**Objective:** Verify token refresh and redirect functionality

**Steps:**
1. Access http://localhost:8080/auth/login
2. Login with: `student@school.com` / `student123`
3. After login, open browser DevTools > Network tab
4. Navigate to a protected page (e.g., /inbox)
5. Wait for token to expire (or manually delete access token from cookies)
6. Make a request that requires authentication
7. **Expected:** Token should refresh automatically OR redirect to login page

**Success Criteria:**
- ✅ No infinite redirect loops
- ✅ Automatic token refresh on 401 error
- ✅ Redirect to login on 403 or refresh failure
- ✅ Original request retried after successful refresh

### Test 2: Weekly Lesson Planning ✅

**Objective:** Test professor's ability to create and manage weekly lesson plans

**Steps:**
1. Login as professor: `professor@school.com` / `prof123`
2. Navigate to the API: http://localhost:8080/api/school/weekly-plans/
3. View existing plans (should see 3 test plans)
4. Create a new plan via API or Django admin
5. Verify plan appears in the list
6. Try to edit a plan
7. Try to delete a plan

**API Testing:**
```bash
# List all weekly plans
curl -H "Authorization: ******" \
  http://localhost:8080/api/school/weekly-plans/

# Create a new plan
curl -X POST -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{
    "professor": 1,
    "lesson": 1,
    "week_start_date": "2025-11-08",
    "planning_content": "Test planning content",
    "objectives": "Test objectives",
    "resources_needed": "Test resources"
  }' \
  http://localhost:8080/api/school/weekly-plans/
```

**Success Criteria:**
- ✅ Professor can view their own plans
- ✅ Professor can create new plans
- ✅ Professor can update their plans
- ✅ Professor can delete their plans
- ✅ Professor cannot see/edit other professors' plans
- ✅ Unique constraint prevents duplicate (lesson, week_start_date)

### Test 3: Efficiency Analysis ✅

**Objective:** Test approval and dropout rate calculations

**Steps:**

#### Global Analysis
```bash
# Test global efficiency analysis
curl -H "Authorization: ******" \
  "http://localhost:8080/api/students/efficiency-analysis/?year=2025"
```

**Expected Response:**
```json
{
  "approval_analysis": {
    "total_students": 1,
    "approved_students": 1,
    "failed_students": 0,
    "approval_rate": 100.0,
    "year": 2025,
    "group": "All groups"
  },
  "dropout_analysis": {
    "total_enrolled": 1,
    "active_students": 1,
    "dropout_students": 0,
    "dropout_rate": 0.0,
    "year": 2025,
    "group": "All groups"
  },
  "summary": {
    "year": 2025,
    "group": "All groups",
    "total_students_evaluated": 1,
    "approval_rate": 100.0,
    "dropout_rate": 0.0,
    "retention_rate": 100.0
  }
}
```

#### Group-Specific Analysis
```bash
# Get group ID first
curl -H "Authorization: ******" \
  http://localhost:8080/api/school/groups/

# Then test group efficiency analysis (use the group ID from above)
curl -H "Authorization: ******" \
  "http://localhost:8080/api/school/groups/1/efficiency-analysis/?year=2025"
```

**Success Criteria:**
- ✅ Returns valid approval rate based on grades ≥ 6.0
- ✅ Returns valid dropout rate based on absence patterns
- ✅ Calculates retention rate correctly (100% - dropout_rate)
- ✅ Works for both global and group-specific queries
- ✅ Handles year parameter correctly
- ✅ Returns appropriate values when no data exists

### Test 4: Inbox/Notifications ✅

**Objective:** Test notification viewing and management

**Steps:**

#### Via Browser
1. Login as student: `student@school.com` / `student123`
2. Navigate to: http://localhost:8080/inbox
3. **Expected:** See 4 notifications (2 grade, 1 absence, 1 event, 1 general)
4. Click "Marcar como lida" on one notification
5. **Expected:** Notification marked as read (opacity changes, badge removed)
6. Click "Marcar todas como lidas"
7. **Expected:** All notifications marked as read

#### Via API
```bash
# List notifications
curl -H "Authorization: ******" \
  http://localhost:8080/api/school/notifications/

# Mark specific notification as read (replace {id})
curl -X POST -H "Authorization: ******" \
  http://localhost:8080/api/school/notifications/{id}/mark-read/

# Mark all as read
curl -X POST -H "Authorization: ******" \
  http://localhost:8080/api/school/notifications/mark-all-read/
```

**Success Criteria:**
- ✅ Inbox page loads without errors
- ✅ All notifications are displayed
- ✅ Unread count is correct
- ✅ Mark as read works for individual notifications
- ✅ Mark all as read works
- ✅ Notifications are color-coded by type
- ✅ Timestamps are displayed correctly
- ✅ Users only see their own notifications

### Test 5: Notification Types and Badges ✅

**Objective:** Verify all notification types display correctly

**Expected Types and Colors:**
- 🔵 GRADE (Nota) - Blue
- 🟠 ABSENCE (Falta) - Orange
- 🟡 WARNING (Advertência) - Yellow
- 🔴 SUSPENSION (Suspensão) - Red
- 🟢 EVENT (Evento) - Green
- 🟣 ASSIGNMENT (Trabalho) - Purple
- 🌸 EXAM (Prova) - Pink
- 🔵 PAYMENT (Pagamento) - Cyan
- ⚫ GENERAL (Geral) - Gray

**Success Criteria:**
- ✅ Each type has correct label in Portuguese
- ✅ Each type has correct color badge
- ✅ "Nova" badge appears only on unread notifications

### Test 6: Integration Testing ✅

**Objective:** Test complete user workflows

#### Student Workflow
1. Login as student
2. Check inbox for notifications
3. View grades (should show grades from test data)
4. Check attendance records
5. Register for an event
6. Mark notifications as read

#### Professor Workflow
1. Login as professor
2. View weekly lesson plans
3. Create a new lesson plan for next week
4. View student grades
5. Add presence records
6. Check notifications

#### Guardian Workflow
1. Login as guardian
2. Check inbox for student notifications
3. View student's academic report
4. View student's attendance
5. Mark notifications as read

**Success Criteria:**
- ✅ All workflows complete without errors
- ✅ Data displays correctly
- ✅ Permissions are enforced correctly
- ✅ No console errors in browser

## Validation Checklist

### Backend ✅
- [ ] WeeklyLessonPlan model created and migrated
- [ ] WeeklyLessonPlan admin registered
- [ ] WeeklyLessonPlanViewSet permissions correct
- [ ] Efficiency analysis endpoints return correct data
- [ ] Approval rate calculation works (≥ 6.0)
- [ ] Dropout rate calculation works (>75% absence or no presence in 30d)
- [ ] Notification endpoints work
- [ ] Mark as read functionality works

### Frontend ✅
- [ ] Inbox page renders without errors
- [ ] Notifications display with correct colors
- [ ] Mark as read updates UI
- [ ] Mark all as read works
- [ ] Authentication interceptor redirects on 401/403
- [ ] Token refresh works automatically
- [ ] No infinite redirect loops
- [ ] Console shows no errors

### Security ✅
- [ ] Users can only see their own notifications
- [ ] Professors can only see/edit their own lesson plans
- [ ] Students cannot access admin endpoints
- [ ] Token validation works correctly
- [ ] No sensitive data leaked in errors

## Common Issues and Solutions

### Issue: Docker build fails
**Solution:** Ensure you have enough disk space and Docker is up to date. Try `docker system prune -a` to clean up.

### Issue: Migrations fail
**Solution:** Ensure database is running: `docker compose ps`. Check logs: `docker compose logs db api`

### Issue: Cannot login
**Solution:** Ensure test data was created. Try creating superuser manually:
```bash
docker compose exec api uv run python manage.py createsuperuser
```

### Issue: 404 on API endpoints
**Solution:** Check that API is running: `docker compose logs api`. Verify URLs in browser network tab.

### Issue: Inbox page is blank
**Solution:** Check browser console for errors. Verify notifications exist in database. Check API response.

## Screenshots

After testing, take screenshots of:
1. Inbox page with notifications
2. Weekly lesson plans list
3. Efficiency analysis API response
4. Student workflow completion
5. Professor workflow completion

## Performance Testing

### Load Testing
```bash
# Test efficiency analysis with multiple requests
for i in {1..10}; do
  curl -H "Authorization: ******" \
    "http://localhost:8080/api/students/efficiency-analysis/?year=2025"
done
```

### Response Time
- Inbox page: < 2 seconds
- Efficiency analysis: < 3 seconds
- Weekly plans list: < 1 second
- Mark as read: < 500ms

## Cleanup

After testing, clean up:
```bash
docker compose down -v
rm -rf data/
```

## Report Issues

If you find any issues during testing:
1. Check browser console for JavaScript errors
2. Check API logs: `docker compose logs api`
3. Check database logs: `docker compose logs db`
4. Document the exact steps to reproduce
5. Include error messages and screenshots
6. Report in the PR comments
