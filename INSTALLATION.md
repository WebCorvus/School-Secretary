# Manual de Instalação - Secretaria Escolar

Este guia fornece instruções passo a passo para instalar e executar o sistema de Secretaria Escolar.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu computador:

1.  Certifique-se de ter o Docker e o Docker Compose instalados.
2.  Para inicializar o projeto, faça:

    ```bash
    # Create .env files
    ./controller.sh genenvs

    # Run containers
    ./controller.sh start

    # Create an administrator user
    ./controller.sh createsuperuser
    ```

    Esses comandos vão construir as imagens Docker para todo os serviços(coforme necessário), iniciá-las e criar um usuário.

### Localmente (Manual)

1. Certifique-se de ter o [uv](https://docs.astral.sh/uv/getting-started/installation/) baixado.
2. Execute os comandos de setup

    ```bash
    uv sync # cria a .venv com as depedências
    uv run python manage.py makemigrations  # cria as migrações
    uv run python manage.py migrate # atualiza do db
    ```

3. Inicialize

    ```bash
    uv run python manage.py runserver # roda em modo dev
    ```

## Testando o sistema

Utilize o comando a seguir para inicializar containers de teste, que rodarão os processos de testagem configurados e depois serão destruidos completamente.

```bash
./controller.sh test
```

## Logging de Exceções com Usuário

Siga os tópicos anteriores parar inicializar o projeto

-   O middleware está em: `api/school/middleware.py`.
-   Logs de erro podem ser visualizados com:

    ```bash
    docker compose logs -f school-secretary-api

    # ou apenas observe o output se tiver feito localmente
    ```

-   Para testar, provoque uma exceção em uma view autenticada e verifique o log.
-   O logger pode ser aprimorado para incluir mais contexto, formatar mensagens ou integrar com sistemas externos.
