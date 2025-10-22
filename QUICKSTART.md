# Guia Rápido - Secretaria Escolar

Este é um guia simplificado para iniciar o sistema rapidamente. Para instruções detalhadas, consulte o [INSTALLATION.md](INSTALLATION.md).

## Pré-requisitos

- Docker e Docker Compose instalados

## Passos Rápidos

### 1. Copiar arquivos de configuração

```bash
cd School-Secretary
cp api/.env.example api/.env
cp app/.env.example app/.env
cp db/.env.example db/.env
cp proxy/.env.example proxy/.env
```

### 2. Iniciar o sistema

```bash
docker compose up -d
```

Aguarde alguns minutos até todos os serviços estarem prontos.

### 3. Criar usuário admin

```bash
docker exec -it school-secretary-api uv run python manage.py shell -c "from users.models import User; User.objects.create_superuser('admin@escola.com', 'senha123', name='Administrador') if not User.objects.filter(email='admin@escola.com').exists() else print('Usuário já existe')"
```

### 4. Acessar o sistema

Abra seu navegador em: **http://localhost:8080**

- Email: `admin@escola.com`
- Senha: `senha123`

## Problemas Comuns

### Proxy não inicia

```bash
docker compose restart proxy
```

### Sistema não responde

Verifique se todos os containers estão rodando:

```bash
docker ps
```

Deve mostrar 4 containers: db, api, app, proxy

### Limpar e recomeçar

```bash
docker compose down -v
docker compose up -d
# Recriar usuário admin (passo 3)
```

## Comandos Úteis

- **Parar**: `docker compose down`
- **Ver logs**: `docker compose logs -f`
- **Reiniciar**: `docker compose restart`

## Próximos Passos

- Explore o painel administrativo em http://localhost:8080/api/admin/
- Crie alunos, professores e turmas
- Configure eventos e atividades

Para mais detalhes, consulte a [documentação completa](README.md).
