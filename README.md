# School Secretary

Simple school management system using Django in the Backend and Next.js in the Frontend.

## Technologies

-   Django + Django REST Framework + WhiteNoise
-   Next.js + Axios
-   PostgreSQL

## Structure

```
School-Secretary/
├── .github/            # Configuration for GitHub Actions
├── api/                # API with Django
├── app/                # Interface with Next.js
├── db/                 # Local DB configuration
├── docs/               # Project documents
├── proxy/              # Proxy with Nginx
├── scripts/            # General purpose scripts used by controller.sh
├── .gitattributes      # File encoding configuration saved by git
├── .gitignore          # Files ignored by Git, sometimes for security
├── compose.test.yaml   # Docker Compose test configuration
├── compose.yaml        # Docker Compose configuration
├── controller.sh       # Script that takes care of running the others in script/
├── INSTALLATION.md     # Installation information
├── README.md           # General project information
└── TODO.md             # Tasks to be done in the future
```

## Settings

The settings are injected into the Backend and Frontend without the need to change code.

To insert new settings, just overwrite the variables of the base `.env` file, inside the folder of each container. Locally, they will be included as follows:

```yaml
# compose.yaml
. . .
env_file:
    - .env
. . .
```

## Data Flow

Nginx acts as the entry point for all requests, directing them to the interface (Frontend) or to the API (Backend).

The interface consumes the Backend's REST API via `axios`. Check the URLs used by the Frontend in the [`config.ts`](./app/src/config.ts) file.

Therefore, the following Frontend excerpt, on the events page

```ts
// app/src/app/(annoucements)/events/page.tsx
export default function EventsPage() {
	const { data, loading, error, refetch } = useEvent();

	if (loading) return <FullScreenLoading />;
	if (error) return <FullScreenError error={error} />;
	if (!data || data.length === 0)
		return <FullScreenError error="No events found." />;

	return (
		<div className="space-y-6">
			{/* ... */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{data.map((event) => (
					<Card key={event.id}>
						<CardHeader>
							<CardTitle className="text-xl">
								{event.title}
							</CardTitle>
							<CardDescription>
								From {event.start_date} to {event.end_date}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="font-medium text-sm">
								<span className="text-muted-foreground">
									Location:
								</span>{" "}
								{event.location}
							</p>
							<p className="text-sm">{event.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
```

The [`useEvent`](./app/src/hooks/useEvent.ts) hook communicates, at the URL `http://{BASE_URL}/api/school/events/`, with the Backend excerpt

```py
# api/school/views.py
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-start_date", "-start_time")
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "location", "start_date"]
```

and, if acquiring the data, stores it in the `data` variable, so that the data can be easily displayed in [`EventsPage`](<./app/src/app/(annoucements)/events/page.tsx>).

## APP Architecture

The APP uses NextJS, a web framework, used in the construction of the components, together with React, as well as in the build function and to serve the static files.

### Endpoint Settings

The API endpoint settings are defined in [`config.ts`](./app/src/config.ts).

A concatenation with the base host of the API is performed to generate the `ROUTES` and `ROUTES_INTERNAL` objects that store the routes.

To define the API route, it is used:

```ts
// app/src/config.ts
const API_BASE = process.env.NEXT_PUBLIC_PUBLIC_API_HOST || "/api/";
const API_INTERNAL_BASE =
	process.env.NEXT_PUBLIC_PRIVATE_API_HOST || "http://api:8000/api/";
```

Example of how routes are accessed from [`config.ts`](./app/src/config.ts):

```ts
// app/src/hooks/useEvent.ts
. . .
const response = await api.get<EventProps[]>(`${ROUTES.EVENTS}`);
let payload = Array.isArray(response.data) ? response.data : [];
. . .
```

## API Architecture

### URLs

They are configured using the `DefaultRouter` of the `rest_framework`

```py
# api/school/urls.py
router = DefaultRouter()
router.register(r"professors", ProfessorViewSet, basename="professor")
router.register(r"subjects", SubjectViewSet, basename="subject")
router.register(r"itineraries", ItineraryViewSet, basename="itinerary")
router.register(r"groups", GroupViewSet, basename="group")
router.register(r"schoolrecords", SchoolRecordViewSet, basename="schoolrecord")
router.register(r"books", BookViewSet, basename="book")
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"agenda", AgendaItemViewSet, basename="agendaitem")
router.register(r"events", EventViewSet, basename="event")
```

### Serializers

They are in the `serializers.py` files inside each app.

There are the standard versions, like this one:

```py
. . .
class GroupSerializer(serializers.ModelSerializer):
    itinerary_details = ItineraryCompactSerializer(source="itinerary", read_only=True)

    class Meta:
        model = Group
        fields = "__all__"
. . .
```

and also their respective compact versions, without some attributes or details of other classes:

```py
. . .
class GroupCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "short_name", "full_name"]
. . .
```

Follow this pattern to avoid circular imports.

### Viewset Functions

There are functions in some serializers, which serve specific purposes, the so-called actions.

When data related to some model is extracted, such as the grades of a certain student, it is recommended to use an action:

```py
. . .
class StudentViewSet(viewsets.ModelViewSet):
    . . .
    @action(detail=True, methods=["get"], url_path="download-grades")
    def download_grades_pdf(self, request, pk=None):
        student = self.get_object()
        subjects = get_subject_names()
        data = {}
        for subject in subjects:
            data[subject] = Grade.objects.filter(
                student=student,
                subject__full_name=subject,
            )
        return pdfgen(
            "grades.html",
            {"student": student, "data": data},
            f"Grades_{student.full_name}.pdf",
        )
. . .
```

## Database Architecture

The database system used is PostgreSQL. The structure and data of the DB are controlled by Django.

### Configuration

PostgreSQL is connected to Django through the settings in the `.env` of each one, see the Postgres [`.env.example`](./db/.env.example) to get an idea:

```
# .env.example
PGDATA="/var/lib/postgresql/data/pgdata"
PGPORT="5432"
POSTGRES_DB="school_secretary"
POSTGRES_PASSWORD="L0IYKNqlwTlxhW396BMNvgPp1p19oYwWR9r8mnzIDI0="
POSTGRES_USER="postgres"
SSL_CERT_DAYS="820". . .
```

But, for a production environment, changing the values - especially the credentials - will be necessary, do this in the `.env` file, generated by [`controller.sh`](./controller.sh).

### Models

The models are defined in the `api/{app}/models.py` files

```py
# api/school/models.py
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return self.title
```

Each field is created from an object, such as `CharField` and `DateField`, classes that receive data and build them.

When the user uses the command

```
python manage.py makemigrations
```

these object classes (from the `models.py` files) are read and their architecture is generated.

After that, when the user uses the command

```
python manage.py migrate
```

this architecture is applied to the database, creating the necessary tables.

## Reverse Proxy (Nginx)

Nginx acts as a reverse proxy for the application, handling the access routes to the application. Its configuration is in [`nginx.conf`](./proxy/nginx.conf), consult it to understand the routes.

Use it to ensure the local operation, with Docker Compose, of the project. In production, something different will be used.

## Application Server (Gunicorn)

Gunicorn (Green Unicorn) is a WSGI (Web Server Gateway Interface) application server for Python. It is used to serve the Django application, acting as an access interface.

### Use in the project

The Django development server (`manage.py runserver`) is used for development, but it is not robust enough for production. `gunicorn`, on the other hand, is designed for production, managing multiple worker processes to handle concurrent requests efficiently.

In [`api/entrypoint.sh`](./api/entrypoint.sh), `gunicorn` is used for this purpose:

```bash
# api/entrypoint.sh
. . .
echo "--- Running API with gunicorn ---"
uv run gunicorn School-Secretary.wsgi:application --bind 0.0.0.0:8000
. . .
```

The command above instructs `gunicorn` to serve the API on the `0.0.0.0` network interfaces on port `8000`, making Django accessible there.

## Authentication System

### Backend

-   The API provides JWT tokens for authentication.
-   The APP provides the tokens as Bearer in the Authorization header of the HTTP communication.
-   After login, the Backend returns the `access` and `refresh` tokens, which the APP stores as cookies in the browser.

Example of login endpoint:

```http
POST /api/users/token/
```

### Frontend

-   Login is done through the `/auth/login` route, created by the [`login.ts`](<./app/src/app/(account)/auth/login/route.ts>) file, which sends the credentials to the backend and stores the tokens in cookies:
-   The middleware ([`middleware.ts`](./app/src/middleware.ts)) protects sensitive routes:
-   As long as the cookies persist, the user will remain authenticated even (except for the expiration policy configured in the Backend and cache cleaning).

Other files in [`auth/`](<./app/src/app/(account)/auth>) do things like [`logout`](<./app/src/app/(account)/auth/logout/route.ts>) and [`refresh`](<./app/src/app/(account)/auth/refresh/route.ts>)

#### Management of Authenticated Requests in the Frontend

To ensure authentication of operations, a centralized instance of `axios` was implemented.

This instance is in [`api.ts`](./app/src/services/api.ts). This instance is configured with request and response interceptors that automate the authentication process.

**Process of Use:**
To use this instance and ensure authentication, the Next.js components and API routes that interact with the Django API must follow the following pattern:

1.  **Import the `api` instance:** Instead of `import axios from "axios";`, use `import api from "@/services/api";`.
2.  **Use `api` for requests:** Replace all `axios.get()`, `axios.post()`, `axios.delete()`, etc., calls with their `api.get()`, `api.post()`, `api.delete()` equivalents.

**Examples of Use:**

-   **In a Hook (ex: `app/src/hooks/useEvent.ts`)**:

    ```ts
    // app/src/hooks/useEvent.ts
    import api from "@/services/api";
    import { EVENTS_ROUTE } from "@/config";

    // ...
    const response = await api.get<EventProps[]>(`${EVENTS_ROUTE}`);
    // ...
    ```

-   **In a Next.js API Route (ex: [`login/route.ts`](<app/src/app/(account)/auth/login/route.ts>))**:

    ```ts
    // app/src/app/(account)/auth/login/route.ts
    const { email, password } = await req.json();

    const response = await api.post(
    	DJANGO_LOGIN_URL,
    	{
    		email,
    		password,
    	},
    	{
    		headers: {
    			"Content-Type": "application/json",
    		},
    	}
    );
    ```

### Access Levels and Permissions

The system uses a Role-Based Access Control (RBAC) model to protect data and actions. Each user has a role that defines their access level.

#### User Roles

There are four roles defined in the system:

-   **`STUDENT`**: The most basic access level. Can only view public information and, in part, manipulate their own data.
-   **`GUARDIAN`**: Can access everything the student accesses, only.
-   **`PROFESSOR`**: Can manage information related to their own classes and students.
-   **`STAFF`**: Has administrative access, but cannot create another `STAFF`.
-   **`SUPERUSER`**: Has unrestricted access to the entire system.

#### Endpoint Protection

Security is applied in the Backend, controlling access to each API endpoint based on the role of the authenticated user. For example, the student model has the following configuration:

```py
    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "download_grades_pdf",
            "download_presence_pdf",
            "academic_report",
            "download_academic_report",
            "students_needing_attention",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()
```

Which defines the permission based on the action to be taken.

### User Structure

The user model (`User`) is the basis of the authentication and authorization system. It is defined in [`users/models.py`](./api/users/models.py) and extends the standard Django functionalities to suit the specific needs of the application.

#### `User` Model

The user model was built from `AbstractBaseUser` and `PermissionsMixin` and has base fields used for all users of all types. Then, a profile is linked to this user, with specific data of their role in the system, if applicable.

#### `UserManager` Model

The `UserManager` is the custom manager for our `User` model. It acts as the main interface for user-related database operations.

## Authorship

Frontend and User Authentication System - João Victor Pinheiro Reis - Fullstack Developer in training.

Backend and Log System - João Miguel Freire de Oliveira Mendes - Fullstack Developer in training.
