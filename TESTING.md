# Manual de Testagem

## Executando Testes

### Usando Docker (Recomendado)

Para rodar todos os testes de uma só fez, em _containers_ separados e temporários, execute:

```bash
./controller.sh test
```

O qual executa [`./scripts/test.sh`](./scripts/test.sh), que cria todos os _containers_, roda, testa e apaga.

### Localmente (Manual)

Para isso faça o _setup_ local do site, informado em [INSTALLATION](./INSTALLATION.md), depois siga as instruções abaixo:

#### API

```bash
cd api/
uv run python manage.py test
```

#### APP

```bash
cd app/
npm run test
```

## Criando Testes

### API

No [`api/`](./api/) os testes estão em arquivos específicos para cada _app_:

-   [`api/users/tests/test_models.py`](./api/users/tests/test_models.py)
-   [`api/users/tests/test_serializers.py`](./api/users/tests/test_serializers.py)

Para criar um novo arquivo de testes, basta colocá-lo dentro da pasta `tests/` do _App Django_ (criado com `./manage.py startapp`). Lembre-se de seguir a convensão de nomenclatura `test_*` para o arquivo.

### APP

No [`app/`](./app/) os testes estão ao lado de seu respectivo arquivo `*.tsx` e possuem, obrigatoriamente, o nome `*.test.tsx`. Por exemplo:

-   [`UserInfoCard/index.tsx`](./app/src/components/UserInfoCard/index.tsx) é testado por [`UserInfoCard/index.test.tsx`](./app/src/components/UserInfoCard/index.test.tsx)

## Logging de Exceções com Usuário

Siga os tópicos anteriores parar inicializar o projeto

-   O middleware está em: [`school/middleware.py`](./api/school/middleware.py).
-   Logs de erro podem ser visualizados com:

    ```bash
    docker compose logs -f school-secretary-api

    # ou apenas observe o output se tiver feito localmente
    ```

-   Para testar, provoque uma exceção em uma view autenticada e verifique o log.
-   O logger pode ser aprimorado para incluir mais contexto, formatar mensagens ou integrar com sistemas externos.
