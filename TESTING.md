# Testing Manual

## Running Tests

### Using Docker (Recommended)

To run all tests at once, in separate and temporary containers, run:

```bash
./controller.sh test

# or, if running without interaction:

./controller.sh test --no-confirm
```

Which runs [`./scripts/test.sh`](./scripts/test.sh), which creates all containers, runs, tests and deletes them.

### Locally (Manual)

To do this, do the local setup of the site, informed in [INSTALLATION](./INSTALLATION.md), then follow the instructions below:

#### API

```bash
cd api/
uv run python manage.py test
```

#### APP

```bash
cd app/
npm run test
```

## Creating Tests

### API

In [`api/`](./api/) the tests are in specific files for each app:

-   [`api/users/tests/test_models.py`](./api/users/tests/test_models.py)
-   [`api/users/tests/test_serializers.py`](./api/users/tests/test_serializers.py)

To create a new test file, just put it inside the `tests/` folder of the Django App (created with `./manage.py startapp`). Remember to follow the `test_*` naming convention for the file.

### APP

In [`app/`](./app/) the tests are next to their respective `*.tsx` file and must have the name `*.test.tsx`. For example:

-   [`UserInfoCard/index.tsx`](./app/src/components/UserInfoCard/index.tsx) is tested by [`UserInfoCard/index.test.tsx`](./app/src/components/UserInfoCard/index.test.tsx)

## User Exception Logging

Follow the previous topics to initialize the project

-   The middleware is in: [`school/middleware.py`](./api/school/middleware.py).
-   Error logs can be viewed with:

    ```bash
    docker compose logs -f school-secretary-api

    # or just watch the output if you have done it locally
    ```

-   To test, trigger an exception in an authenticated view and check the log.
-   The logger can be improved to include more context, format messages or integrate with external systems.