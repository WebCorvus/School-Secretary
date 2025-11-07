# Installation Manual - School Secretary

This guide provides step-by-step instructions for installing and running the School Secretary system.

## Using Docker (Recommended)

### Prerequisites

-   Docker
-   Docker Compose

### Instructions

1.  Generate and, preferably, edit the `.env` files:

    ```bash
    ./controller.sh genenvs
    ```

2.  Initialize the project using the [`controller.sh`](./controller.sh) (uses `docker` internally):

    ```bash
    ./controller.sh start
    ```

3.  Create an administrator user:

    ```bash
    ./controller.sh createsuperuser
    ```

Now you can access the site at: [`http://localhost:8080`](http://localhost:8080).

## Locally (Manual)

### Prerequisites

-   Python
-   Node
-   uv

### API

1. Install the dependencies:

    ```bash
    uv sync
    ```

2. Create the migrations:

    ```bash
    uv run python manage.py makemigrations
    ```

3. Update the database:

    ```bash
    uv run python manage.py migrate
    ```

4. Initialize:

    ```bash
    uv run python manage.py runserver
    ```

### APP

1. Go to the [`app/`](./app/):

    ```bash
    cd app/
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Run in development mode:

    ```bash
    npm run dev
    ```
