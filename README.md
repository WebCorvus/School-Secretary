# Secretaria Escolar

Sistema simples de gerenciamento escolar usando Django no backend e Next.js no frontend.

## Tecnologias

-   Django + Django REST Framework
-   Next.js + Axios

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

## Comunicação

A interface consome a API REST do backend via Axios. Verifique as URLs no arquivo `app/src/config.ts`.

### APIs

#### URLs

São a rota para acessar uma ViewSet

As URLs de acesso de dados estão nos arquivos `api/{app}/urls.py`

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

#### ViewSet

Sintetizam uma configuração de saída de dados do BD.

As configurações das saídas de dado do BD estão em `api/{app}/views.py`.

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

#### Serializers

Os serializers são ferramentas de conversão de dados complexos (do BD) em dados nativos python.
Nesse caso, serve para transformar dados de objetos da classe Subject, incluindo todos os campos.

```py
# api/school/serializers.py
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"
```

### Viewset Functions

Há funções em alguns serializers, que servem para propósitos específicos.

No caso abaixo, serve para listar as aulas de uma turma, a URL usada é: `# http://{BASE_URL}/school/lesson/{OBJECT_PK}/get-lessons`.

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

Frontend - João Victor Pinheiro Reis - Desenvolvedor Fullstack em formação.

Backend - João Miguel Freire de Oliveira Mendes - Desenvolvedor Fullstack em formação.
