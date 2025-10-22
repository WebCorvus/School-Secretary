# Secretaria Escolar

Sistema simples de gerenciamento escolar usando Django no Backend e Next.js no Frontend.

## Tecnologias

-   Django + Django REST Framework + WhiteNoise
-   Next.js + Axios
-   PostgreSQL

## Estrutura

```
School-Secretary/
├── .github/            # Configuração para GitHub Actions
├── api/                # API com Django
├── app/                # Interface com Next.js
├── db/                 # Configuração do BD local
├── docs/               # Documentos do projeto
├── proxy/              # Proxy com Nginx
├── scripts/            # Scripts de propósito geral usados or controller.sh
├── .gitattributes      # Configuração de codificação de arquivos salvos pelo git
├── .gitignore          # Arquivos ignorados pelo Git, às vezes por segurança
├── compose.test.yaml   # Configuração de testes do Docker Compose
├── compose.yaml        # Configuração Docker Compose
├── controller.sh       # Script que cuida da execução dos outros em script/
├── INSTALLATION.md     # Informações de instalação
├── README.md           # Informações gerais do projeto
└── TODO.md             # Tarefas a serem feitas no futuro
```

## Configurações

As configurações são injetadas no Backend e Frontend sem a necessidade de mudar código.

Para inserir novas configurações, basta sobrescrever as variáveis do arquivo base `.env` , dentro da pasta de cada container. Localmente, serão incluídas assim:

```yaml
# compose.yaml
. . .
env_file:
    - .env
. . .
```

## Fluxo de Dados

O Nginx atua como o ponto de entrada para todas as requisições, direcionando-as para a interface (Frontend) ou para a API (Backend).

A interface consome a API REST do Backend via `axios`. Verifique as URLs utilizadas pelo Frontend no arquivo `app/src/config.ts`.

Sendo assim, o trecho do Frontend a seguir, na página de eventos

```ts
// app/src/app/(annoucements)/events/page.tsx
export default function EventsPage() {
	const { data, loading, error, refetch } = useEvent();

	if (loading) return <FullScreenLoading />;
	if (error) return <FullScreenError error={error} />;
	if (!data || data.length === 0)
		return <FullScreenError error="Nenhum evento encontrado." />;

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
								De {event.start_date} até {event.end_date}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<p className="font-medium text-sm">
								<span className="text-muted-foreground">
									Local:
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

O hook `useEvent` se comunica, na URL `http://{BASE_URL}/api/school/events/`, com o trecho do Backend

```py
# api/school/views.py
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-start_date", "-start_time")
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "location", "start_date"]
```

e, se adquirindo os dados, armazena na variável `data`, de forma que os dados podem ser facilmente exibidos em `EventsPage`.

## Arquitetura do APP

O APP utiliza NextJS, um framework web, utilizado na construção dos componentes, juntamente com o React, assim como na função de build e para servir os arquivos estáticos.

### Configurações dos Endpoints

As configurações dos endpoints da API são definidas em `app/src/config.ts`. Anteriormente, as URLs completas eram construídas diretamente neste arquivo. Agora, para maior flexibilidade e clareza, as constantes exportadas representam apenas as **rotas relativas** (`_ROUTE`) para os endpoints da API.

A concatenação com o host base da API (`EXTERNAL_API_HOST` ou `INTERNAL_API_HOST`) é realizada no ponto de uso, geralmente nas chamadas `axios` dentro dos componentes ou serviços do frontend.

-   `EXTERNAL_API_HOST`: Define o prefixo para chamadas de API que são roteadas externamente, geralmente via Nginx (`/api/`).
-   `INTERNAL_API_HOST`: Define o endereço interno direto para o serviço da API (e.g., `http://api:8000/`), usado em contextos específicos onde a comunicação direta é necessária (como em rotas de API do Next.js que atuam como proxy).

Exemplo de como as rotas são definidas em `app/src/config.ts`:

```ts
// app/src/config.ts
. . .
export const ITINERARY_ROUTE = SCHOOL_ROUTE + "itineraries/";
export const STUDENT_ROUTE = "students/";
export const LESSON_ROUTE = SCHOOL_ROUTE + "lessons/";
. . .
```

E como são utilizadas em um componente do frontend (ex: `app/src/hooks/useEvent.ts`):

```ts
// app/src/hooks/useEvent.ts
import { EVENTS_ROUTE } from "@/config";
// ...
const response = await api.get<EventProps[]>(`${EVENTS_ROUTE}`);
// ...
```

### Componentes

São blocos de código que podem ser utilizados em diversas páginas, ou seja, são focado em reutilização.

Todos ficam em `app/src/components/`

### Páginas

As páginas são o bloco de código que sintetiza o que será exibido na tela.

No caso do NextJS elas são exibidas como children, com base no layout

```ts
// app/src/app/layout.tsx
export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="pt-br" suppressHydrationWarning>
			<body className={`${inter.className} `}>
				<ThemeProvider>
					<SidebarProvider>
						<AppSidebar />
						<SidebarInset>
							<SiteHeader />
							<main className="flex flex-1 flex-col gap-4 p-4">
								{children}
							</main>
							<Toaster />
						</SidebarInset>
					</SidebarProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
```

onde há a presença de alguns componenentes também, os quais serão exibidos em todas as rotas (todas as páginas).

As próprias páginas são criadas em `app/src/app` e a estrutura de pastas, a partir desse ponto, define automaticamente as rotas.

```
app/src/app
│   favicon.ico
│   globals.css
│   layout.tsx
│
├───(account)
│   ├───dashboard
│   │   │   page.tsx
│   │   └───add
│   │           page.tsx
│   └───auth
│       ├───login
│       │       route.ts
│       └───logout
│               route.ts
│
├───(annoucements)
│   ├───events
│   │       page.tsx
│   └───lessons
│           page.tsx
│
└───(marketing)
    └───about
            page.tsx
```

Considerando que as pastas cujo nome possui os parênteses são ignoradas e somente os `page.tsx` e `route.ts` marcam uma rota válida, as rotas são:

```
{BASE_URL}/dashboard/
{BASE_URL}/dashboard/add/
{BASE_URL}/auth/login/
{BASE_URL}/auth/logout/
{BASE_URL}/events/
{BASE_URL}/lessons/
{BASE_URL}/about/
. . .
```

## Arquitetura da API

### URLs

São a rota para acessar uma `ViewSet`.

Devido ao uso de `ViewSet` - que cobram um sistema de roteamento mais complexo - nesse projeto usamos o `DefaultRouter`.

As URLs de acesso de dados estão nos arquivos `api/{app}/urls.py`.

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

### ViewSet

São uma pré-configuração (de um conjunto de `ViewSet`) de uma saída de dados do BD.

Servem para lidar com diversos tipos de operação: `create`, `destroy`, `list`, `retrieve`, `update`, `partial_update`.

Tais configurações estão em `api/{app}/views.py`.

```py
# api/school/views.py
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-start_date", "-start_time")
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "location", "start_date"]
```

### Serializers

Os serializers são uma espécie de ponte entre entre dados externos da API (JSON) e internos do BD (objetos do BD).

Nesse caso, serve para transformar, ou validar, dados de objetos de classes definidas em `api/{app}/models.py`.

A seguir, serve para converter dados de objetos da classe Event (Evento), incluindo todos os campos do objeto.

```py
# api/school/serializers.py
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
```

Depois disso, o serializer pode ser usado nas `ViewSet` (como visto anteriormente) ou da seguinte forma:

```py
from school.models import Event

event = Event.objects.create(title="Reunião de Pais")
serializer = EventSerializer(event)
print(serializer.data)
# Output: {'id': 1, 'title': 'Reunião de Pais', ...}

data = {'title': 'Festa Junina'}
serializer = EventSerializer(data=data)

if serializer.is_valid():
    event = serializer.save()
    print(event)  # <Event: Festa Junina>
else:
    print(serializer.errors)
```

### Viewset Functions

Há funções em alguns serializers, que servem para propósitos específicos.

No caso abaixo, serve para listar as aulas de uma turma, a URL usada é: `http://{BASE_URL}/school/groups/{OBJECT_PK}/get-lessons`.

```py
# api/school/views.py
    @action(detail=True, methods=["get"], url_path="get-lessons")
    def get_lessons(self, request, pk=None):
        group = self.get_object()
        group_lessons = Lesson.objects.filter(group=group)
        week_lessons = []

        for day in range(7):
            day_lessons = []
            for time in range(LESSONS_PER_DAY):
                lesson = group_lessons.filter(day=day, time=time + 1).first()
                day_lessons.append(LessonSerializer(lesson).data if lesson else None)
            week_lessons.append({"day": get_day_name(day), "lessons": day_lessons})

        return Response(week_lessons)
```

## Arquitetura do Banco de Dados

O sistema de banco de dados utilizado é o PostgreSQL

### Configuração

O PostgreSQL, é conectado ao Django por meio das configurações em `.env.base`.

```
# .env.base
DATABASE_ENGINE=postgresql_psycopg2
DATABASE_ENGINE=postgresql_psycopg2
DATABASE_NAME=school_secretary
DATABASE_USERNAME=root
DATABASE_PASSWORD=123
DATABASE_HOST=db
DATABASE_PORT=1000
. . .
```

Mas, para um ambiente de produção, mudar os valores - em especial das credenciais - será necessário, faça isso em `.env.prod`.

### Modelos

Os modelos são definidos nos arquivos `api/{app}/models.py`

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

Cada campo é criado a partir de um objeto, como `CharField` e `DateField`, classes que recebem dados e os constroem.

Quando o usuário utiliza o comando

```
python manage.py makemigrations
```

essas classes de objetos (dos arquivos `models.py`) são lidas e a arquitetura deles é gerada.

Após isso, ao usuário utilizar o comando

```
python manage.py migrate
```

essa arquitetura é aplicada no banco de dados, criando as tabelas necessárias.

### Preenchendo o BD

Em diversos pontos do Frontend, um usuário autenticado, consegue fazer registros de determinados objetos.

Entretanto, para colocar dados no BD utilizando o próprio `python` é necessário utilizar os modelos informados (após o migrate), criar os objetos com os dados e os salvar (necessário somente se não usar `create`).

```py
from school.models import Event

event = Event.objects.create(
    title="Festa Junina"
)

print(event.id)
```

Os dados são salvos de forma persistente dentro do sistema do Docker, ou seja, mesmo excluindo os conteineres eles serão mantidos.

```yaml
# compose.yaml
volumes:
    - db_data:/var/lib/postgresql/data/
```

```yaml
# compose.yaml
volumes:
    db_data:
```

## Proxy Reverso (Nginx)

O Nginx atua como um proxy reverso para a aplicação, direcionando as requisições do cliente para o serviço apropriado - app (frontend) ou api (backend). Ele também é responsável por servir arquivos estáticos e gerenciar o tráfego de rede de forma eficiente.

A configuração do Nginx é definida no `compose.yaml` e no `proxy/nginx.conf`.

### Configuração no Docker Compose

No `compose.yaml`, o serviço `proxy` é definido para construir a imagem do Nginx e expor a porta 8080 do host para a porta 80 do contêiner:

```yaml
# compose.yaml
services:
    proxy:
        build: ./proxy
        container_name: school-secretary-proxy
        ports:
            - "8080:80"
        depends_on:
            - api
            - app
        networks:
            - public
```

### Configuração do Nginx (proxy/nginx.conf)

O arquivo `proxy/nginx.conf` define como o Nginx roteia as requisições:

```nginx
# proxy/nginx.conf
server {
    listen 80;

    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

-   Requisições para a raiz (`/`) são encaminhadas para o serviço `app` (Next.js) na porta 3000.
-   Requisições para `/api/` são encaminhadas para o serviço `api` (Django) na porta 8000.

Dessa forma, o usuário precisa de apenas uma URL (e também apenas uma porta) para ter toda a aplicação rodando. Uma vez que, o Nginx permite que tudo fique na rede interna do Docker e que pela rota seja feito acesso ao APP ou API na porta correta.

## Servidor de Aplicação (Gunicorn)

O Gunicorn (Green Unicorn) é um servidor de aplicação WSGI (Web Server Gateway Interface) para Python. Ele é utilizado para servir a aplicação Django, atuando como uma interface entre o Nginx e a aplicação.

### Funcionamento

Enquanto o servidor de desenvolvimento do Django (`manage.py runserver`) é ideal para o desenvolvimento, ele não é robusto o suficiente para um ambiente de produção. O Gunicorn, por outro lado, é projetado para produção, gerenciando múltiplos processos de trabalho para lidar com requisições concorrentes de forma eficiente.

No `compose.yaml`, o serviço da `api` é configurado para usar o Gunicorn para iniciar a aplicação Django:

```yaml
# compose.yaml
services:
    api:
        build:
            context: ./api
        container_name: school-secretary-api
        command: gunicorn School-Secretary.wsgi:application --bind 0.0.0.0:8000
        volumes:
            - ./api:/usr/src/app/
            - static_volume:/usr/src/app/static
        expose:
            - 8000
        env_file:
            - .env.base
            - .env.prod
            - .env.local
        depends_on:
            - db
        networks:
            - public
```

O comando `gunicorn School-Secretary.wsgi:application --bind 0.0.0.0:8000` instrui o Gunicorn a:

-   Utilizar o arquivo de configuração WSGI da aplicação, localizado em `api/School-Secretary/wsgi.py`.
-   Disponibilizar a aplicação em todas as interfaces de rede (`0.0.0.0`) na porta `8000`.

Dessa forma, o Nginx pode encaminhar as requisições para a porta `8000` do contêiner da `api`, onde o Gunicorn está escutando e gerenciando a aplicação Django.

## Sistema de Autenticação

### Backend

-   A API fornece tokens JWT para autenticação.
-   Após o login, o Backend retorna os tokens `access` e `refresh`.

Exemplo de endpoint de login:

```http
POST /api/users/token/
```

### Frontend

-   O login é feito através da rota `/auth/login`, que envia as credenciais para o backend e armazena os tokens em cookies:

```ts
// app/src/app/(account)/auth/login/route.ts
// ...
const { access, refresh } = response.data;

setCookie("access", access, {
	req,
	res,
	path: "/",
	sameSite: "lax",
	maxAge: 60 * 60,
});

setCookie("refresh", refresh, {
	req,
	res,
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	path: "/",
	sameSite: "lax",
	maxAge: 60 * 60 * 24 * 30,
});
// ...
```

-   O middleware (`middleware.ts`) protege as rotas sensíveis:

```ts
// app/src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

const protectedRoutes = [
	"/agenda",
	"/dashboard",
	"/events",
	"/groups",
	"/itineraries",
	"/lessons",
	"/subject",
	"/professors",
	"/students",
];
const loginRoute = "/";

export function middleware(request: NextRequest) {
	// ...
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);

	if (isProtectedRoute && !accessToken) {
		const loginUrl = new URL(loginRoute, request.url);
		loginUrl.searchParams.set("from", pathname);
		return NextResponse.redirect(loginUrl);
	}

	return NextResponse.next();
}
```

-   Enquanto os cookies persistirem, o usuário permanecerá autenticado mesmo após fechar e abrir o navegador (salvo política de expiração configurada no Backend).

#### Gerenciamento de Requisições Autenticadas no Frontend

Para garantir que todas as requisições à API Django sejam devidamente autenticadas e que o processo de renovação de tokens seja transparente para o desenvolvedor, foi implementada uma instância centralizada do `axios` com interceptadores.

**A Solução: Instância `api` Centralizada (`app/src/services/api.ts`)**
Para resolver isso, foi criada uma instância customizada do `axios` em `app/src/services/api.ts`. Esta instância é configurada com interceptadores de requisição e resposta que automatizam o processo de autenticação:

1.  **Interceptador de Requisição:** Antes de cada requisição ser enviada, ele verifica a presença de um token de acesso (JWT) nos cookies. Se encontrado, o token é anexado ao cabeçalho `Authorization` no formato `Bearer <token>`.
2.  **Interceptador de Resposta:** Monitora as respostas da API. Se uma resposta `401 Unauthorized` for recebida (indicando que o token de acesso pode ter expirado), ele tenta obter um novo token de acesso através da rota de proxy `/auth/refresh`. Se a renovação for bem-sucedida, a requisição original é repetida com o novo token. Caso contrário, o erro é registrado no console.

**Código da Instância `api`:**

```ts
// app/src/services/api.ts
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const api = axios.create();

api.interceptors.request.use(
	(config: any) => {
		const token = getCookie("access");
		if (token) {
			if (!config.headers) config.headers = {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error: any) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const response = await axios.post("/auth/refresh");
				const { access } = response.data;

				setCookie("access", access, { path: "/", sameSite: "lax" });

				if (!originalRequest.headers) originalRequest.headers = {};
				originalRequest.headers.Authorization = `Bearer ${access}`;

				console.log("Token refreshed!");
				return api(originalRequest);
			} catch (refreshError) {
				console.error("Refresh token failed", refreshError);
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
```

**Processo de Uso:**
Para utilizar essa instância e garantir a autenticação, os componentes e rotas de API do Next.js que interagem com a API Django devem seguir o seguinte padrão:

1.  **Importar a instância `api`:** Em vez de `import axios from "axios";`, utilize `import api from "@/services/api";`.
2.  **Utilizar `api` para requisições:** Substitua todas as chamadas `axios.get()`, `axios.post()`, `axios.delete()`, etc., pelas suas equivalentes `api.get()`, `api.post()`, `api.delete()`.

**Exemplos de Uso:**

-   **Em um Hook (ex: `app/src/hooks/useEvent.ts`)**:

    ```ts
    // app/src/hooks/useEvent.ts
    import api from "@/services/api";
    import { EVENTS_ROUTE } from "@/config";

    // ...
    const response = await api.get<EventProps[]>(`${EVENTS_ROUTE}`);
    // ...
    ```

-   **Em uma Rota de API do Next.js (ex: `app/src/app/(account)/auth/login/route.ts`)**:

    ```ts
    // app/src/app/(account)/auth/login/route.ts
    import api from "@/services/api";
    import { LOGIN_ROUTE } from "@/config";

    const DJANGO_LOGIN_URL = process.env.INTERNAL_DJANGO_API_URL + LOGIN_ROUTE;

    export async function POST(req: NextRequest) {
    	// ...
    	const response = await api.post(
    		DJANGO_LOGIN_URL,
    		{ email, password },
    		{ headers: { "Content-Type": "application/json" } }
    	);
    	// ...
    }
    ```

**Benefícios desta Abordagem:**

-   **Autenticação Centralizada:** Garante que todos os tokens de acesso sejam incluídos automaticamente e que a lógica de renovação de tokens seja aplicada de forma consistente em toda a aplicação.
-   **Redução de Código Repetitivo:** Evita a necessidade de escrever manually a lógica de autenticação em cada chamada de API.
-   **Manutenção Simplificada:** Alterações no mecanismo de autenticação (por exemplo, mudança de tipo de token, nova lógica de renovação) precisam ser feitas apenas em `app/src/services/api.ts`, impactando toda a aplicação de forma transparente.
-   **Clareza e Padronização:** Promove um padrão claro para todas as interações com a API autenticada.

### Níveis de Acesso e Permissões

O sistema utiliza um modelo de controle de acesso baseado em papéis (Role-Based Access Control - RBAC) para proteger os dados e as ações. Cada usuário possui um papel que define seu nível de acesso.

#### Papéis de Usuário

Existem quatro papéis definidos no sistema:

-   **`STUDENT`**: O nível de acesso mais básico. Pode visualizar informações públicas e seus próprios dados, mas não pode modificar dados de outros usuários ou acessar áreas restritas.
-   **`PROFESSOR`**: Pode gerenciar informações relacionadas às suas próprias turmas e alunos, como lançar notas e registrar presença.
-   **`STAFF`**: Possui acesso administrativo para gerenciar dados essenciais da escola, como cadastrar novos alunos, turmas e professores.
-   **`SUPERUSER`**: Possui acesso irrestrito a todo o sistema, incluindo a capacidade de gerenciar todos os outros usuários e configurações do sistema.

#### Proteção de Endpoints

A segurança é aplicada no Backend, controlando o acesso a cada endpoint da API com base no papel do usuário autenticado. Por exemplo, as ações relacionadas ao gerenciamento de alunos (`/api/students/`) são protegidas da seguinte forma:

-   **Listar, Visualizar, Criar, Atualizar e Deletar Alunos**: Acesso restrito a usuários com o papel `STAFF` ou `SUPERUSER`.

Esta abordagem garante que um usuário `STUDENT`, por exemplo, não possa adicionar ou remover outros alunos do sistema, mesmo que consiga acessar a interface. A lógica de permissão é centralizada na API para garantir a segurança e a integridade dos dados.

### Estrutura do Usuário

O modelo de usuário (`User`) é a base do sistema de autenticação e autorização. Ele é definido em `api/users/models.py` e estende as funcionalidades padrão do Django para se adequar às necessidades específicas da aplicação.

#### Modelo `User`

Nosso modelo `User` é construído a partir de `AbstractBaseUser` e `PermissionsMixin`.

```python
# api/users/models.py
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        PROFESSOR = "PROFESSOR", "Professor"
        STAFF = "STAFF", "Staff"
        SUPERUSER = "SUPERUSER", "Superuser"

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.STUDENT)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # ... (rest of the model, including __str__ and save methods) ...
```

-   **`AbstractBaseUser`**: Fornece a implementação central de um modelo de usuário, incluindo senhas com hash e autenticação baseada em token. Ele não inclui campos relacionados a permissões.
-   **`PermissionsMixin`**: É uma classe mixin que adiciona campos e métodos relacionados a permissões ao modelo de usuário. Ao herdar de `PermissionsMixin`, nosso modelo `User` automaticamente ganha:
    -   `is_superuser`: Um campo booleano que indica se o usuário tem todas as permissões sem ser explicitamente atribuído.
    -   `groups`: Um campo Many-to-Many para gerenciar grupos de usuários.
    -   `user_permissions`: Um campo Many-to-Many para gerenciar permissões individuais do usuário.
    -   Métodos como `has_perm`, `has_module_perms`, etc., para verificação de permissões.

Além desses, nosso modelo `User` inclui campos personalizados como `email` (usado como campo de nome de usuário), `name`, e `role` (para definir o papel do usuário no sistema: `STUDENT`, `PROFESSOR`, `STAFF`, `SUPERUSER`).

#### `UserManager`

O `UserManager` (definido em `api/users/models.py`) é o gerenciador personalizado para o nosso modelo `User`. Ele atua como a interface principal para operações de banco de dados relacionadas ao usuário.

```python
# api/users/models.py
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', self.model.Role.SUPERUSER)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        if extra_fields.get('role') is not self.model.Role.SUPERUSER:
            raise ValueError('Superuser must have role of Superuser.')

        return self.create_user(email, password, **extra_fields)
```

-   **Criação de Usuários**: Ele fornece métodos especializados como `create_user()` e `create_superuser()`. Esses métodos são cruciais porque o modelo de usuário personalizado não usa o campo `username` padrão do Django. O `UserManager` garante que os usuários sejam criados corretamente com `email` e `password`, e que os superusuários tenham os sinalizadores `is_staff` e `is_superuser` (e o `role` apropriado) definidos.
-   **`extra_fields`**: Nos métodos `create_user()` e `create_superuser()` do `UserManager`, o parâmetro `**extra_fields` permite que campos adicionais do modelo `User` (como `name` ou `role`) sejam passados durante a criação do usuário. Isso torna os métodos de criação flexíveis, permitindo que você defina quaisquer outros campos necessários para o seu modelo de usuário.

## Autoria

Frontend e Sistema de Autenticação de Usuários - João Victor Pinheiro Reis - Desenvolvedor Fullstack em formação.

Backend e Sistema de logs - João Miguel Freire de Oliveira Mendes - Desenvolvedor Fullstack em formação.
