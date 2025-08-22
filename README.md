# Secretaria Escolar

Sistema simples de gerenciamento escolar usando Django no Backend e Next.js no Frontend.

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

## Fluxo de Dados

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
					className="link link-blue"
					onClick={() => handleDelete(subject.id)}
				>
					Remover
				</button>
			</td>
		</tr>
	))}
</tbody>
```

## Comunicação

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

## Banco de Dados

### Modelos

Os modelos são definidos nos arquivos `api/{app}/models.py`

```py
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

Para colocar dados no BD é necessário utilizar os modelos informados (após o migrate), criar os objetos com os dados e os salvar.

```py
from school.models import Subject

subject = Subject.objects.create(
    name="Physics"
)

print(subject.id)
```

## Funcionalidades

-   Cadastro e listagem de alunos, professores, aulas e turmas.
-   Autenticação de usuário (JWT) com rotas protegidas.

## Autenticação

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

-   Enquanto os cookies persistirem, o usuário permanecerá autenticado mesmo após fechar e abrir o navegador (salvo política de expiração configurada no Backend).

## Autor

Frontend - João Victor Pinheiro Reis - Desenvolvedor Fullstack em formação.

Backend - João Miguel Freire de Oliveira Mendes - Desenvolvedor Fullstack em formação.
