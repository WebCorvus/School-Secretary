# Secretaria Escolar

Sistema simples de gerenciamento escolar usando Django no Backend e Next.js no Frontend.

## Tecnologias

-   Django + Django REST Framework
-   Next.js + Axios
-   PostgreSQL

## Estrutura

```
secretaria-escolar/
├── api/            # Django API
├── app/            # Next.js Interface
├── docs/           # Project documents
├── compose.yaml    # Docker Compose config
├── INSTALLATION.md
└── README.md
```

## Configurações

As configurações são injetadas no Backend e Frontend sem a necessidade de mudar código.

Nesse sentido, basta acessar o arquivo `.env.base` para ver as configurações padrão da aplicação.

Depois disso, para inserir novas configurações, basta sobrescrever as variáveis do arquivo base nos arquivos vazios `.env.local` ou `.env.prod`.

Saiba que `.env.local` sobrescreve `.env.prod`, que sobrescreve `.env.base`, nessa ordem, uma vez que:

```yaml
# compose.yaml
. . .
env_file:
    - .env.base
    - .env.prod
    - .env.local
. . .
```

## Fluxo de Dados

O Nginx atua como o ponto de entrada para todas as requisições, direcionando-as para a interface (Frontend) ou para a API (Backend).

A interface consome a API REST do Backend via `axios`. Verifique as URLs utilizadas pelo Frontend no arquivo `app/src/config.ts`.

Sendo assim, o trecho do Frontend a seguir, executado logo após a renderização da página de matérias

```ts
// app/src/app/(public)/subjects/page.tsx
useEffect(() => {
	axios
		.get<SubjectProps[]>(`${SUBJECT_BASE_URL}?search=${search}`)
		.then((response) => setData(response.data))
		.catch((error) => {
			alert(`Erro ao carregar matérias: ${error}`);
		});

	setUpdate(false);
}, [update]);
```

se comunica, na URL `SUBJECT_BASE_URL`, ou http://{BASE_URL}/school/subject/, com o trecho do Backend

```py
# api/school/views.py
class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("full_name")
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]
```

e, se adquirindo os dados, armazena na variável `data`, de forma que os dados podem ser facilmente exibidos em

```ts
// app/src/app/(public)/page.tsx
<tbody>
	{data.map((subject) => (
		<tr key={subject.id}>
			<td>{subject.short_name}</td>
			<td>{subject.full_name}</td>
			<td>
				<button
					className="link-blue"
					onClick={() => handleDelete(subject.id)}
				>
					Remover
				</button>
			</td>
		</tr>
	))}
</tbody>
```

## Arquitetura do APP

O APP utiliza NextJS, um framework web, utilizado na construção dos componentes, juntamente com o React, assim como na função de build e para servir os arquivos estáticos.

### Configurações dos Endpoints

As configurações se dão por constantes do TypeScript. Note que `API_BASE_URL` aponta para o endereço interno do serviço `api` dentro da rede Docker. Externamente, a aplicação é acessada via Nginx na porta 8080.

```ts
// app/src/config.ts
. . .
export const ITINERARY_BASE_URL = `${API_BASE_URL}/school/itinerary/`;
export const STUDENT_BASE_URL = `${API_BASE_URL}/students/`;
export const LESSON_BASE_URL = `${API_BASE_URL}/school/lesson/`;
. . .
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
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<Header />
				<HorizontalLine />
				<div>{children}</div>
				<Footer />
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
├───(private)
│   ├───professors
│   │   │   page.tsx
│   │   │
│   │   └───add
│   │           page.tsx
│   │
│   └───students
│       │   page.tsx
│       │
│       └───add
│               page.tsx
│
└───(public)
    │   page.tsx
    │
    ├───groups
    │   │   page.tsx
    │   │
    │   └───add
    │           page.tsx
    │
    ├───itineraries
    │   │   page.tsx
    │   │
    │   └───add
    │           page.tsx
    │
    ├───lessons
    │   │   page.tsx
    │   │
    │   └───add
    │           page.tsx
    │
    ├───login
    │       page.tsx
    │
    └───subjects
        │   page.tsx
        │
        └───add
                page.tsx
```

Considerando que as pastas cujo nome possui os parênteses são ignoradas e somente os `page.tsx` marcam uma rota válida, as rotas são:

```
{BASE_URL}/
{BASE_URL}/professors/
{BASE_URL}/professors/add/
{BASE_URL}/students/
{BASE_URL}/students/add/
{BASE_URL}/groups/
{BASE_URL}/groups/add/
{BASE_URL}/itineraries/
{BASE_URL}/itineraries/add/
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
router.register(r"professor", ProfessorViewSet, basename="professor") # http://{BASE_URL}/school/professor/
router.register(r"subject", SubjectViewSet, basename="subject") # http://{BASE_URL}/school/subject/
router.register(r"itinerary", ItineraryViewSet, basename="itinerary") # http://{BASE_URL}/school/itinerary/
router.register(r"group", GroupViewSet, basename="group") # http://{BASE_URL}/school/group/
router.register(r"schoolrecord", SchoolRecordViewSet, basename="schoolrecord") # http://{BASE_URL}/school/schoolrecord/
router.register(r"book", BookViewSet, basename="book") # http://{BASE_URL}/school/book/
router.register(r"lesson", LessonViewSet, basename="lesson") # http://{BASE_URL}/school/lesson/
```

### ViewSet

São uma pré-configuração (de um conjunto de `ViewSet`) de uma saída de dados do BD.

Servem para lidar com diversos tipos de operação: `create`, `destroy`, `list`, `retrieve`, `update`, `partial_update`.

Tais configurações estão em `api/{app}/views.py`.

```py
# api/school/views.py
class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("full_name")
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]
```

### Serializers

Os serializers são uma espécie de ponte entre entre dados externos da API (JSON) e internos do BD (objetos do BD).

Nesse caso, serve para transformar, ou validar, dados de objetos de classes definidas em `api/{app}/models.py`.

A seguir, serve para converter dados de objetos da classe Subject (Matéria), incluindo todos os campos do objeto.

```py
# api/school/serializers.py
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"
```

Depois disso, o serializer pode ser usado nas `ViewSet` (como visto anteriormente) ou da seguinte forma:

```py
subject = Subject.objects.create(full_name="Mathematics")
serializer = SubjectSerializer(subject)
print(serializer.data)
# Output: {'id': 1, 'name': 'Mathematics'}

data = {'full_name': 'Physics'}
serializer = SubjectSerializer(data=data)

if serializer.is_valid():
    subject = serializer.save()
    print(subject)  # <Subject: Physics>
else:
    print(serializer.errors)
```

### Viewset Functions

Há funções em alguns serializers, que servem para propósitos específicos.

No caso abaixo, serve para listar as aulas de uma turma, a URL usada é: `http://{BASE_URL}/school/lesson/{OBJECT_PK}/get-lessons`.

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
                lesson = group_lessons.filter(day=day, time=time).first()
                if lesson:
                    day_lessons.append(LessonSerializer(lesson).data)
                else:
                    day_lessons.append(None)
            week_lessons.append(
                {
                    "day": get_day_name(day),
                    "lessons": day_lessons,
                }
            )
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
class Subject(models.Model):
    short_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    full_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

    def __str__(self):
        return self.full_name
```

Cada campo é criado a partir de um objeto, como `CharField` e `DateTimeField`, classes que recebem dados e os constroem.

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
from school.models import Subject

subject = Subject.objects.create(
    name="Physics"
)

print(subject.id)
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

-   Utilizar o arquivo de configuração WSGI da aplicação, localizado em `School-Secretary/wsgi.py`.
-   Disponibilizar a aplicação em todas as interfaces de rede (`0.0.0.0`) na porta `8000`.

Dessa forma, o Nginx pode encaminhar as requisições para a porta `8000` do contêiner da `api`, onde o Gunicorn está escutando e gerenciando a aplicação Django.

## Sistema de Autenticação

### Backend

-   A API fornece tokens JWT usando uma view customizada com `@api_view(['POST'])`.
-   Após o login, o Backend retorna os tokens `access` e `refresh`.

Exemplo de endpoint:

```http
POST /api/token/
```

### Frontend

-   O login é feito com `axios.post`, e os tokens são armazenados em cookies:

```ts
// app/src/services/auth.ts
document.cookie = `access=${access}; path=/;`;
document.cookie = `refresh=${refresh}; path=/;`;
```

-   O middleware (`middleware.ts`) protege as rotas sensíveis:

```ts
// app/src/middleware.ts
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

-   Enquanto os cookies persistirem, o usuário permanecerá autenticado mesmo após fechar e abrir o navegador (salvo política de expiração configurada no Backend).

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

Frontend - João Victor Pinheiro Reis - Desenvolvedor Fullstack em formação.

Backend - João Miguel Freire de Oliveira Mendes - Desenvolvedor Fullstack em formação.
