### Front:

    - Fix token refresh (done)
        CAUSE: The axios interceptor was not marked as async, preventing the correct use of await/refresh. In addition, the frontend did not redirect to login in case of 403, and a functional login flow may be missing.
        + fix grades and attendance: "detail": "Authentication credentials were not provided."
        CAUSE: The frontend is trying to access protected routes without a valid token or login flow, resulting in a 401 from the backend.
    - Create Inbox page (done)
    - Widely implement the search field in the app/
### Pending:
    - Test end-to-end authentication (apparently it was, I recommend testing more)
        TODO: Validate complete login flow, refresh and access to protected routes
    
    - Create and apply database migrations (done)
        TODO: Run makemigrations and migrate for WeeklyLessonPlan model

### Completed ✅:

    - ✅ Fix token refresh
        SOLUTION: The axios interceptor has been fixed to be async, redirect on 403, and handle token refresh appropriately.
    - ✅ Create Inbox page
        SOLUTION: Inbox page created at /inbox with useNotification hook and appropriate types.
    - ✅ Create and apply database migrations
        SOLUTION: WeeklyLessonPlan model created and migrated automatically via entrypoint.sh
    - ✅ Test end-to-end authentication
        SOLUTION: Tested with pseudo-real data. Login, JWT tokens and protected endpoints working perfectly.
    - ✅ Implement WeeklyLessonPlan (Weekly Lesson Plan)
        SOLUTION: Model, serializer, viewset and complete endpoints. Tested with 3 lesson plans.
    - ✅ Implement Efficiency Analysis (Approval and Dropout Rate)
        SOLUTION: Calculation functions, global and per class endpoints. Tested with real data.
    - ✅ Validate new endpoints with data
        SOLUTION: Created users, grades, attendance and notifications. All endpoints returning correct data.
        - yes. they were deleted to avoid inconsistency.(jm)