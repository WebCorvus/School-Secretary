# Database Migration Instructions

## WeeklyLessonPlan Model Migration

A new model `WeeklyLessonPlan` has been added to the `school` app to support weekly lesson planning for professors.

### To create and apply the migration:

#### Using Docker (Recommended):

```bash
# Generate migration files
docker compose exec api uv run python manage.py makemigrations

# Apply migrations to database
docker compose exec api uv run python manage.py migrate
```

#### Using Local Environment:

```bash
cd api/

# Generate migration files
uv run python manage.py makemigrations

# Apply migrations to database
uv run python manage.py migrate
```

### Expected Migration

The migration will create the `school_weeklylessonplan` table with the following fields:

- `id` (AutoField, Primary Key)
- `professor_id` (ForeignKey to school_professor)
- `lesson_id` (ForeignKey to school_lesson)
- `week_start_date` (DateField)
- `planning_content` (TextField)
- `objectives` (TextField, nullable)
- `resources_needed` (TextField, nullable)
- `notes` (TextField, nullable)
- `created_at` (DateTimeField, auto_now_add)
- `updated_at` (DateTimeField, auto_now)

The table will also have a unique constraint on (`lesson_id`, `week_start_date`).

## Verification

After running migrations, verify the new model is accessible:

```bash
# Check migrations status
docker compose exec api uv run python manage.py showmigrations school

# Test the API endpoint
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/school/weekly-plans/
```

## Rollback (if needed)

If you need to rollback the migration:

```bash
# Identify the migration to rollback to
docker compose exec api uv run python manage.py showmigrations school

# Rollback to previous migration
docker compose exec api uv run python manage.py migrate school <previous_migration_number>
```
