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

3. Rodar migrations e iniciar o servidor:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

4. Criar um usuário administrador:

    ```bash
    python manage.py createsuperuser
    ```

5. Verificar o `CORS_ALLOWED_ORIGINS` no `settings.py`:

    ```python
    CORS_ALLOWED_ORIGINS = [
        "http://127.0.0.1:3000",
    ]
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

A interface consome a API REST do backend via Axios. Verifique as URLs no arquivo `frontend/src/config/index.ts`.

## Funcionalidades

-   Cadastro e listagem de alunos, professores, aulas e turmas.
-   Autenticação de usuário (JWT) com rotas protegidas.

## Autenticação

### Backend

-   A API fornece tokens JWT usando uma view customizada com `@api_view(['POST'])`.
-   Após o login, o backend retorna os tokens `access` e `refresh`.

Exemplo de endpoint:

```http
POST /api/token/
```

### Frontend

-   O login é feito com `axios.post`, e os tokens são armazenados em cookies:

```ts
document.cookie = `access=${access}; path=/;`;
document.cookie = `refresh=${refresh}; path=/;`;
```

-   O middleware (`middleware.ts`) protege as rotas sensíveis:

```ts
export function middleware(request: NextRequest) {
	const accessToken = request.cookies.get("access")?.value;
	const pathname = request.nextUrl.pathname;

	const protectedRoutes =
		pathname.startsWith("/student") ||
		pathname.startsWith("/professor") ||
		pathname.split("/").includes("add");

	if (protectedRoutes && !accessToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}
```

-   A interface da página de login reutiliza o tema e classes definidas em `globals.css`, usando Tailwind.

-   Enquanto os cookies persistirem, o usuário permanecerá autenticado mesmo após fechar e abrir o navegador (salvo política de expiração configurada no backend).

## Autor

João Victor Pinheiro Reis - Desenvolvedor em formação.
