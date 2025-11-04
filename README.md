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

A interface consome a API REST do Backend via `axios`. Verifique as URLs utilizadas pelo Frontend no arquivo [`config.ts`](./app/src/config.ts).

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

O hook [`useEvent`](./app/src/hooks/useEvent.ts) se comunica, na URL `http://{BASE_URL}/api/school/events/`, com o trecho do Backend

```py
# api/school/views.py
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-start_date", "-start_time")
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "location", "start_date"]
```

e, se adquirindo os dados, armazena na variável `data`, de forma que os dados podem ser facilmente exibidos em [`EventsPage`](<./app/src/app/(annoucements)/events/page.tsx>).

## Arquitetura do APP

O APP utiliza NextJS, um framework web, utilizado na construção dos componentes, juntamente com o React, assim como na função de build e para servir os arquivos estáticos.

### Configurações dos Endpoints

As configurações dos endpoints da API são definidas em [`config.ts`](./app/src/config.ts).

Uma concatenação com o host base da API é realizada no para gerar os objectos `ROUTES` e `ROUTES_INTERNAL` que guardam as rotas.

Para definir a rota da API é usando:

```ts
// app/src/config.ts
const API_BASE = process.env.NEXT_PUBLIC_PUBLIC_API_HOST || "/api/";
const API_INTERNAL_BASE =
	process.env.NEXT_PUBLIC_PRIVATE_API_HOST || "http://api:8000/api/";
```

Exemplo de como as rotas são acessadas de [`config.ts`](./app/src/config.ts):

```ts
// app/src/hooks/useEvent.ts
. . .
const response = await api.get<EventProps[]>(`${ROUTES.EVENTS}`);
let payload = Array.isArray(response.data) ? response.data : [];
. . .
```

## Arquitetura da API

### URLs

São configurados usando o `DefaultRouter` do `rest_framework`

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

### Serializers

Estão nos arquivos `serializers.py` dentro de cada app.

Há as versões padrão, como esta:

```py
. . .
class GroupSerializer(serializers.ModelSerializer):
    itinerary_details = ItineraryCompactSerializer(source="itinerary", read_only=True)

    class Meta:
        model = Group
        fields = "__all__"
. . .
```

e também suas respectivas verões compact, sem alguns atributos ou detalhes de outras classes:

```py
. . .
class GroupCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "short_name", "full_name"]
. . .
```

Siga esse padrão para evitar importações circulares.

### Viewset Functions

Há funções em alguns serializers, que servem para propósitos específicos, as chamadas actions.

Quando dados relacionados a algum model forem extraídos, como as notas de um determinado aluno, é recomendável usar uma action:

```py
. . .
class StudentViewSet(viewsets.ModelViewSet):
    . . .
    @action(detail=True, methods=["get"], url_path="download-grades")
    def download_grades_pdf(self, request, pk=None):
        student = self.get_object()
        subjects = get_subject_names()
        data = {}
        for subject in subjects:
            data[subject] = Grade.objects.filter(
                student=student,
                subject__full_name=subject,
            )
        return pdfgen(
            "grades.html",
            {"student": student, "data": data},
            f"Grades_{student.full_name}.pdf",
        )
. . .
```

## Arquitetura do Banco de Dados

O sistema de banco de dados utilizado é o PostgreSQL. A estrutura e os dados do DB são controlados pelo Django.

### Configuração

O PostgreSQL, é conectado ao Django por meio das configurações nas `.env` de cada um, veja o [`.env.example`](./db/.env.example) do Postgres para ter uma ideia:

```
# .env.example
PGDATA="/var/lib/postgresql/data/pgdata"
PGPORT="5432"
POSTGRES_DB="school_secretary"
POSTGRES_PASSWORD="L0IYKNqlwTlxhW396BMNvgPp1p19oYwWR9r8mnzIDI0="
POSTGRES_USER="postgres"
SSL_CERT_DAYS="820". . .
```

Mas, para um ambiente de produção, mudar os valores - em especial das credenciais - será necessário, faça isso no arquivo `.env`, gerado pelo [`controller.sh`](./controller.sh).

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

## Proxy Reverso (Nginx)

O Nginx atua como um proxy reverso para a aplicação, lidando com as rotas de acesso à aplicação. Sua configuração fica em [`nginx.conf`](./proxy/nginx.conf), consulte para entender as rotas.

Use-o para garantir o funcionamento local, com Docker Compose, do projeto. Em produção, algo diferente será usado.

## Servidor de Aplicação (Gunicorn)

O Gunicorn (Green Unicorn) é um servidor de aplicação WSGI (Web Server Gateway Interface) para Python. Ele é utilizado para servir a aplicação Django, atuando como uma interface de acesso.

### Uso no projeto

O servidor de desenvolvimento do Django (`manage.py runserver`) é usado para desenvolvimento, mas não é robusto o suficiente para produção. O `gunicorn`, por outro lado, é projetado para produção, gerenciando múltiplos processos de trabalho para lidar com requisições concorrentes de forma eficiente.

No [`api/entrypoint.sh`](./api/entrypoint.sh), o `gunicorn` é usado para esse fim:

```bash
# api/entrypoint.sh
. . .
echo "--- Running API with gunicorn ---"
uv run gunicorn School-Secretary.wsgi:application --bind 0.0.0.0:8000
. . .
```

O comando acima instrui o `gunicorn` a servir a API nas interfaces da rede `0.0.0.0` na porta `8000`, tornando o Django acessível por lá.

## Sistema de Autenticação

### Backend

-   A API fornece tokens JWT para autenticação.
-   O APP fornece so tokens como Bearer no header Authorization da comunicação HTTP.
-   Após o login, o Backend retorna os tokens `access` e `refresh`, que o APP armazena em forma de cookies no navegador.

Exemplo de endpoint de login:

```http
POST /api/users/token/
```

### Frontend

-   O login é feito através da rota `/auth/login`, criado pelo arquivo [`login.ts`](<./app/src/app/(account)/auth/login/route.ts>), que envia as credenciais para o backend e armazena os tokens em cookies:
-   O middleware ([`middleware.ts`](./app/src/middleware.ts)) protege as rotas sensíveis:
-   Enquanto os cookies persistirem, o usuário permanecerá autenticado mesmo (salvo política de expiração configurada no Backend e limpeza de cache).

Outros arquivos em [`auth/`](<./app/src/app/(account)/auth>) fazem coisas como [`logout`](<./app/src/app/(account)/auth/logout/route.ts>) e [`refresh`](<./app/src/app/(account)/auth/refresh/route.ts>)

#### Gerenciamento de Requisições Autenticadas no Frontend

Para garantir autentificação das operações, foi implementada uma instância centralizada do `axios`.

Tal instância está em [`api.ts`](./app/src/services/api.ts). Esta instância é configurada com interceptadores de requisição e resposta que automatizam o processo de autenticação.

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

-   **Em uma Rota de API do Next.js (ex: [`login/route.ts`](<app/src/app/(account)/auth/login/route.ts>))**:

    ```ts
    // app/src/app/(account)/auth/login/route.ts
    const { email, password } = await req.json();

    const response = await api.post(
    	DJANGO_LOGIN_URL,
    	{
    		email,
    		password,
    	},
    	{
    		headers: {
    			"Content-Type": "application/json",
    		},
    	}
    );
    ```

### Níveis de Acesso e Permissões

O sistema utiliza um modelo de controle de acesso baseado em papéis (Role-Based Access Control - RBAC) para proteger os dados e as ações. Cada usuário possui um papel que define seu nível de acesso.

#### Papéis de Usuário

Existem quatro papéis definidos no sistema:

-   **`STUDENT`**: O nível de acesso mais básico. Pode apenas visualizar informações públicas e, em parte, manipular seus próprios dados.
-   **`GUARDIAN`**: Pode acessar tudo que o aluno acessa, apenas.
-   **`PROFESSOR`**: Pode gerenciar informações relacionadas às suas próprias turmas e alunos.
-   **`STAFF`**: Possui acesso administrativo, mas não pode criar outro `STAFF`.
-   **`SUPERUSER`**: Possui acesso irrestrito a todo o sistema.

#### Proteção de Endpoints

A segurança é aplicada no Backend, controlando o acesso a cada endpoint da API com base no papel do usuário autenticado. Por exemplo, o modelo de estudante possui a seguinte configuração:

```py
    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "download_grades_pdf",
            "download_presence_pdf",
            "academic_report",
            "download_academic_report",
            "students_needing_attention",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()
```

Que define a a permission com base na ação que será tomada.

### Estrutura do Usuário

O modelo de usuário (`User`) é a base do sistema de autenticação e autorização. Ele é definido em [`users/models.py`](./api/users/models.py) e estende as funcionalidades padrão do Django para se adequar às necessidades específicas da aplicação.

#### Modelo `User`

O modelo de user foi construído a partir de `AbstractBaseUser` e `PermissionsMixin` e possui campos usados base para todos os usuários de todos os tipos. Depois, é linkado um perfil a esse usuário, com dados específicos de seu papel no sistema, se aplicável.

#### Modelo `UserManager`

O `UserManager` é o gerenciador personalizado para o nosso modelo `User`. Ele atua como a interface principal para operações de banco de dados relacionadas ao usuário.

## Autoria

Frontend e Sistema de Autenticação de Usuários - João Victor Pinheiro Reis - Desenvolvedor Fullstack em formação.

Backend e Sistema de logs - João Miguel Freire de Oliveira Mendes - Desenvolvedor Fullstack em formação.
