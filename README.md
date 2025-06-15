# Secretaria Escolar

Sistema simples de gerenciamento escolar usando Django no backend e Next.js no frontend.

## Tecnologias

-   Django + Django REST Framework
-   Next.js + Axios
-   pnpm ou npm

## Estrutura

```
secretaria-escolar/
├── backend/     # API Django
├── frontend/    # Interface Next.js
└── README.md
```

## Como rodar

### Backend

1. Criar ambiente virtual:

    ```bash
    python -m venv venv
    source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
    ```

2. Instalar dependências:

    ```bash
    pip install -r requirements.txt
    ```

3. Rodar migrations e iniciar:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

### Frontend

1. Acessar a pasta:

    ```bash
    cd frontend
    ```

2. Instalar pacotes:

    ```bash
    pnpm install  # ou npm install
    ```

3. Iniciar:
    ```bash
    pnpm run dev  # ou npm run dev
    ```

## Comunicação

A interface consome a API REST via Axios. Verifique as URLs no frontend.

## Funcionalidades

-   Cadastro e listagem de alunos, professores, aulas e turmas.

## Autenticação

Ainda não implementada.

## Autor

João Victor Pinheiro Reis - Desenvolvedor em formação.
