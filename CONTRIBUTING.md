# Contributing to School Secretary

First and foremost, thank you for your interest in contributing to the project! We are excited to welcome new contributors. This document provides a comprehensive guide to help you get involved, from setting up your environment to submitting your first pull request.

By participating, we expect you to follow our [**Code of Conduct**](CODE_OF_CONDUCT.md). Please read it to ensure we maintain a respectful and collaborative community.

## How to Contribute

There are many ways to contribute, and all are valuable.

-   **Reporting Bugs**: If you find a bug, please open an [issue](https://github.com/PinheiroReis/Lucas/School-Secretary/issues) using the **Bug Report** template. Provide as many details as possible, including steps to reproduce, expected behavior, and what actually happened.
-   **Suggesting Enhancements**: For new features or improvements, open an [issue](https://github.com/PinheiroReis/Lucas/School-Secretary/issues) using the **Feature Request** template. Describe your idea and its value to the project.
-   **Improving Documentation**: If you find any part of our documentation unclear or incomplete, feel free to suggest changes.

Before starting any implementation, please discuss the change you wish to make via the corresponding issue to ensure it aligns with the project's goals.

## 1. Getting Started: Your Development Environment

Our project is fully containerized using Docker to ensure a consistent development environment. The recommended and most straightforward way to get started is by using our main controller script.

### Prerequisites

-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

The entire setup process is managed by our `controller.sh` script.

1.  **Generate Environment Files**: This command creates the necessary `.env` files for all services (API, database, etc.).
    ```bash
    ./controller.sh genenvs
    ```
    *You can review and customize the generated `.env` files in each service directory (`api/`, `app/`, `db/`) if needed.*

2.  **Start the Application**: This will build the Docker images and start all the services.
    ```bash
    ./controller.sh start
    ```

3.  **Create a Superuser**: To access the admin panel and test authenticated routes, create an administrator account.
    ```bash
    ./controller.sh createsuperuser
    ```

Once these steps are complete, the application will be available at `http://localhost:8080`. For more details or manual setup instructions, see [**INSTALLATION.md**](INSTALLATION.md).

## 2. Development Workflow

### Branching Strategy

Create a new branch from `main` for every new feature or bug fix. Use a descriptive prefix, such as:
-   `feat/new-login-page` for new features.
-   `fix/user-auth-bug` for bug fixes.
-   `docs/update-readme` for documentation changes.
-   `chore/update-dependencies` for maintenance tasks (e.g., dependency updates, build process changes).

### Code Style and Quality

We enforce a consistent code style using automated tools. Please run them before committing your changes.

-   **Comments**: Add comments only when strictly necessary to explain complex logic.
-   **Markdown Links**: Always use Markdown links (`[text](url)`) for internal and external references.

#### Backend (Python / Django)

-   **Dependencies**: Managed with `uv` in `api/pyproject.toml`.
-   **Linting & Formatting**: Although not explicitly defined in `pyproject.toml`, we follow standard Django conventions and the **PEP 8** style guide. We recommend using tools like **Black** and **Ruff** or **Flake8** in your local editor.

#### Frontend (TypeScript / Next.js)

-   **Dependencies**: Managed with `npm` in `app/package.json`.
-   **Linting & Formatting**: We use **ESLint** with the `next/core-web-vitals` configuration. Run the linter to check for issues:
    ```bash
    cd app/
    npm run lint
    ```
    *We recommend integrating ESLint and a formatter like Prettier into your code editor to automatically format your code on save.*

### API and Frontend Synchronization

A critical part of the workflow is ensuring that the frontend application and the backend API are always in sync.

When you add or modify an endpoint in the Django API (e.g., in `api/school/urls.py`):
1.  **Update Frontend Configuration**: You must update the corresponding route in the frontend. The API routes used by the app are defined in `app/src/config.ts`.
2.  **Update Frontend Service**: Modify or create the frontend service or hook (e.g., in `app/src/hooks/` or `app/src/services/`) that consumes the endpoint.
3.  **Verify Manually**: After making these changes, you **must** manually test the entire flow. Navigate to the relevant page in the application and verify that the frontend correctly fetches data from or sends data to the new/updated backend endpoint. Check the browser's developer console for network errors.

### Testing

Tests are mandatory and are checked in our CI pipeline.

-   **Backend Tests**: Written using Django's native test framework. Run them with:
    ```bash
    cd api/
    uv run python manage.py test
    ```
-   **Frontend Tests**: Written using **Vitest**. Run them with:
    ```bash
    cd app/
    npm run test
    ```
-   **End-to-End Testing**: The entire test suite (backend and frontend) can be run in a clean, containerized environment using the controller script. This is the same command our CI uses.
    ```bash
    ./controller.sh test
    ```

For more details on creating tests, refer to [**TESTING.md**](TESTING.md).

## 3. Pull Request (PR) Process

Once your changes are ready, follow these steps to submit a Pull Request.

### Step 1: Pre-submission Checklist

Before opening a PR, please ensure you have completed the following:

-   [ ] All backend and frontend tests are passing (`./controller.sh test`).
-   [ ] The code is correctly formatted and passes all linter checks (`npm run lint`).
-   [ ] The application starts and runs without errors (`./controller.sh start`).
-   [ ] You have written new tests for your changes.
-   [ ] You have updated the [**README.md**](README.md) if you introduced changes to the interface, environment variables, or exposed ports.
-   [ ] You have documented significant changes in the [**NEW.md**](NEW.md) file.
-   [ ] You have ensured that any new install or build dependencies are properly added to `pyproject.toml` or `package.json` and not left as local artifacts.

### Step 2: Open the Pull Request

-   Push your branch to your fork and open a Pull Request against the `main` branch of the original repository.
-   Provide a clear and descriptive title for your PR.
-   Fill out the PR template, explaining **why** the change is needed and **what** it does. Link to the relevant issue if one exists.

### Step 3: Code Review and Merging

-   The project maintainers will review your code. Be prepared to make changes based on their feedback.
-   Once your PR is approved by at least **two other developers**, it can be merged. If you don't have merge permissions, you can request a reviewer to merge it for you.

Thank you for contributing to the future of School Secretary!
