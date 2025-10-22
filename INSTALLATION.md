# Manual de Instalação - Secretaria Escolar

Este guia fornece instruções passo a passo para instalar e executar o sistema de Secretaria Escolar.

## Usando Docker (Recomendado)

### Pré-requisitos

-   Docker
-   Docker Compose

### Instruções

1.  Gere e, de preferência, edite os arquivos `.env`:

    ```bash
    ./controller.sh genenvs
    ```

2.  Inicialize o projeto com usando o [`controller.sh`](./controller.sh) (usa `docker` internamente):

    ```bash
    ./controller.sh start
    ```

3.  Crie um usuário administrador:

    ```bash
    ./controller.sh createsuperuser
    ```

Agora é possível acessar o site em: [`http://localhost:8080`](http://localhost:8080).

## Localmente (Manual)

### Pré-requisitos

-   Python
-   Node
-   uv

### API

1. Instale as dependências:

    ```bash
    uv sync
    ```

2. Crie as migrações:

    ```bash
    uv run python manage.py makemigrations
    ```

3. Atualize o banco de dados:

    ```bash
    uv run python manage.py migrate
    ```

4. Inicialize:

    ```bash
    uv run python manage.py runserver
    ```

### APP

1. Vá para o [`app/`](./app/):

    ```bash
    cd app/
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Rode em modo de desenvolvimento:

    ```bash
    npm run dev
    ```
