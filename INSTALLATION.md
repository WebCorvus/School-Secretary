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

    Siga as instruções no terminal para definir o nome de usuário, e-mail e senha.

### Gerar Usuários de Teste (seed_users)

Para criar usuários de teste automaticamente, execute:

```bash
docker exec -it school-secretary-api python manage.py seed_users --total 5
```

Você pode ajustar o número de usuários com o parâmetro `--total` e definir o papel com `--role` (opcional).


### Monitoramento de Entradas e Remoções de Models

Para monitorar periodicamente a entrada e remoção de registros nos principais models do sistema, execute:

```bash
docker exec -it school-secretary-api python manage.py monitor_models
```
docker compose down && docker compose up --build -d ; sleep 2 && docker exec -it school-secretary-api python manage.py monitor_models

O comando irá exibir no console, a cada poucos segundos, qualquer novo registro ou remoção detectada nas tabelas principais, utilizando as APIs do sistema.
=======
```bash
docker compose up test --build --abort-on-container-exit
```