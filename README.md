# Secretaria Escolar

Sistema simples de gerenciamento escolar usando Django no backend e Next.js no frontend.

## Tecnologias

-   Django + Django REST Framework
-   Next.js + Axios

## Estrutura

```
secretaria-escolar/
├── api/            # API Django
├── app/            # Interface Next.js
├── compose.yaml    # Docker Compose config
└── README.md
```

## Como rodar

O projeto utiliza Docker Compose para orquestrar os serviços de backend (Django) e frontend (Next.js).

### Com Docker Compose (Recomendado)

Para iniciar a aplicação completa (backend e frontend) em ambiente de desenvolvimento:

1.  Certifique-se de ter o Docker e o Docker Compose instalados.
2.  Na raiz do projeto, execute:

    ```bash
    docker compose up --build
    ```

    Este comando irá construir as imagens Docker para ambos os serviços (se necessário) e iniciá-los. O serviço `school-secretary-app-1` (frontend) já está configurado para realizar o build e iniciar para ambiente de produção automaticamente.

### Criar Usuário Administrador (Superuser)

Para acessar certas funcionalidades do sistema, é necessário ter um usuário cadastrado. Você pode criar um superusuário no banco de dados do Django (serviço `school-secretary-api-1`):

1.  Com os serviços do Docker Compose em execução, abra um novo terminal.
2.  Execute o comando para criar um superusuário dentro do container `school-secretary-api-1`:

    ```bash
    docker compose exec school-secretary-api-1 python manage.py createsuperuser
    ```

    Siga as instruções no terminal para definir o nome de usuário, e-mail e senha.

### Execução Manual (Alternativa para Desenvolvimento)

Se preferir rodar os serviços manualmente, siga as instruções abaixo:

#### Backend (api/)

1.  Navegue até o diretório `api/`:

    ```bash
    cd api
    ```

2.  Criar ambiente virtual:

    ```bash
    python -m venv .venv
    source .venv/bin/activate  # ou .\.venv\Scripts\activate no Windows
    ```

3.  Instalar dependências:

    ```bash
    pip install -r requirements.txt
    ```

4.  Rodar migrations e iniciar o servidor:

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    python manage.py runserver
    ```

5.  Verificar o `CORS_ALLOWED_ORIGINS` no `School-Secretary/settings.py`:

    ```python
    CORS_ALLOWED_ORIGINS = [
        "http://127.0.0.1:3000",
    ]
    ```

#### Frontend (app/)

1.  Navegue até o diretório `app/`:

    ```bash
    cd app
    ```

2.  Instalar pacotes:

    ```bash
    npm install
    ```

3.  Iniciar:

    ```bash
    npm run dev
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
