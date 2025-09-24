## Como rodar

O projeto utiliza Docker Compose para orquestrar os serviços de backend (Django) e frontend (Next.js).

### Com Docker Compose (Recomendado)

Para iniciar a aplicação completa (backend e frontend) em ambiente de desenvolvimento:

1.  Certifique-se de ter o Docker e o Docker Compose instalados.
2.  Na raiz do projeto, execute:

    ```bash
    docker compose up --build (-d)
    ```

    Este comando irá construir as imagens Docker para ambos os serviços (se necessário) e iniciá-los. O serviço `school-secretary-app-1` (frontend) já está configurado para realizar o build e iniciar para ambiente de produção automaticamente.

### Criar Usuário Administrador (Superuser)

Para acessar certas funcionalidades do sistema, é necessário ter um usuário cadastrado. Você pode criar um superusuário no banco de dados do Django (serviço `school-secretary-api-1`):

1.  Com os serviços do Docker Compose em execução, abra um novo terminal.
2.  Execute o comando para criar um superusuário dentro do container `school-secretary-api-1`:

        ```bash
        docker exec -it school-secretary-api python manage.py createsuperuser
        ```

        Siga as instruções no terminal para definir o nome de usuário, e-mail e senha.

    BETA: docker compose exec api python manage.py seed_school --students <NÚMERO> --guardians <NÚMERO> --professors <NÚMERO>

### Testando o sistema

Utilize o comando a seguir para inicializar o projeto e, tomando o container de teste como referencia, realizar uma testagem e depois abortar tudo.

```bash
docker compose up test --build --abort-on-container-exit # Test E2E
```

```bash
docker compose up --build -d                                        # Test E2E
docker compose exec -it school-secretary-api python manage.py test  # Test Backend
docker compose exec -it school-secretary-app npm run test           # Test Frontend
```

### Gerar Usuários de Teste (seed_users)

Para criar usuários de teste automaticamente, execute:

```bash
docker exec -it school-secretary-api python manage.py seed_users --total 5
```

Você pode ajustar o número de usuários com o parâmetro `--total` e definir o papel com `--role` (opcional).

BETA: docker compose exec api python manage.py seed_school --students <NÚMERO> --guardians <NÚMERO> --professors <NÚMERO>

## Logging de Exceções com Usuário

O backend Django possui um middleware que registra exceções junto ao usuário autenticado.

- O middleware está em: `api/school/middleware.py`.
- Logs de erro podem ser visualizados com:

    ```bash
    docker compose logs -f school-secretary-api
    ```
- Para testar, provoque uma exceção em uma view autenticada e verifique o log.
- O logger pode ser aprimorado para incluir mais contexto, formatar mensagens ou integrar com sistemas externos.
