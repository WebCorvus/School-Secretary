# Frontend Documentation

## Base URL

When running locally with Docker: `http://localhost:3000/`

## Pages

The frontend is built with Next.js and contains the following pages:

### Main

- `/`: The main page of the application.
- `/dashboard`: The user's dashboard.
- `/agenda`: The agenda page.
- `/events`: The events page.
- `/inbox`: The user's inbox.
- `/lessons`: The lessons page.
- `/about`: The about page.

### Authentication

- `/auth/login`: The login page.

## API Routes

The frontend also has the following API routes:

- `POST /auth/login`: Logs the user in.
- `POST /auth/logout`: Logs the user out.
- `POST /auth/refresh`: Refreshes the user's token.
- `GET /healthcheck`: Healthcheck endpoint.