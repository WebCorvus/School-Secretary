# Manual de Instalação - Secretaria Escolar

Este guia fornece instruções passo a passo para instalar e executar o sistema de Secretaria Escolar.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em seu computador:

- **Docker**: versão 20.10 ou superior
- **Docker Compose**: versão 2.0 ou superior

Para verificar se estão instalados, execute:

```bash
docker --version
docker compose version
```

Se você não tiver o Docker instalado, visite:
- Windows/Mac: https://www.docker.com/products/docker-desktop
- Linux: https://docs.docker.com/engine/install/

## Passo 1: Obter o Código

Clone o repositório ou extraia os arquivos do projeto:

```bash
git clone https://github.com/WebCorvus/School-Secretary.git
cd School-Secretary
```

## Passo 2: Configurar Variáveis de Ambiente

O sistema requer arquivos `.env` para cada serviço. Copie os arquivos de exemplo:

```bash
# Copiar arquivos de exemplo para os arquivos .env
cp api/.env.example api/.env
cp app/.env.example app/.env
cp db/.env.example db/.env
cp proxy/.env.example proxy/.env
```

**Nota**: Para ambiente de produção, você deve alterar as senhas e chaves secretas nos arquivos `.env` criados.

## Passo 3: Iniciar o Sistema

Execute o seguinte comando na raiz do projeto:

```bash
docker compose up -d
```

Este comando irá:
1. Baixar as imagens Docker necessárias
2. Criar as redes Docker para comunicação entre serviços
3. Iniciar todos os containers (banco de dados, backend, frontend e proxy)

O processo pode levar alguns minutos na primeira execução.

### Verificar o Status

Verifique se todos os containers estão rodando corretamente:

```bash
docker ps
```

Você deve ver 4 containers em execução:
- `school-secretary-db` - Banco de dados PostgreSQL
- `school-secretary-api` - Backend Django
- `school-secretary-app` - Frontend Next.js
- `school-secretary-proxy` - Proxy Nginx

## Passo 4: Criar Usuário Administrador

Para acessar o sistema, você precisa criar um usuário administrador:

```bash
docker exec -it school-secretary-api uv run python manage.py shell -c "from users.models import User; User.objects.create_superuser('admin@escola.com', 'senha123', name='Administrador') if not User.objects.filter(email='admin@escola.com').exists() else print('Usuário já existe')"
```

**Importante**: Guarde essas credenciais:
- **Email**: admin@escola.com
- **Senha**: senha123

(Em produção, use uma senha forte e segura!)

## Passo 5: Acessar o Sistema

Abra seu navegador e acesse:

```
http://localhost:8080
```

Faça login com as credenciais criadas no passo anterior.

## Comandos Úteis

### Parar o Sistema

```bash
docker compose down
```

### Reiniciar o Sistema

```bash
docker compose restart
```

### Ver Logs

Para ver os logs de todos os serviços:

```bash
docker compose logs -f
```

Para ver logs de um serviço específico:

```bash
docker compose logs -f api      # Backend
docker compose logs -f app      # Frontend
docker compose logs -f db       # Banco de dados
docker compose logs -f proxy    # Proxy
```

### Criar Usuários de Teste

Para popular o sistema com dados de teste:

```bash
docker exec -it school-secretary-api uv run python manage.py seed_users --total 10
```

## Solução de Problemas

### O container `proxy` não inicia

Se o proxy não conseguir iniciar devido a erro de DNS, reinicie-o:

```bash
docker compose restart proxy
```

### Erro "Port 8080 is already in use"

Outro serviço está usando a porta 8080. Você pode:
1. Parar o outro serviço, ou
2. Alterar a porta no arquivo `compose.yaml` (linha com `8080:80`)

### Não consigo fazer login

1. Verifique se todos os containers estão rodando: `docker ps`
2. Verifique os logs do backend: `docker compose logs api`
3. Confirme que o usuário foi criado corretamente

### Reset completo do sistema

Para remover todos os dados e recomeçar:

```bash
docker compose down -v  # Remove containers e volumes
docker compose up -d    # Inicia novamente
# Recriar usuário administrador (Passo 4)
```

## Arquitetura do Sistema

O sistema é composto por 4 serviços principais:

1. **Banco de Dados (PostgreSQL)**: Armazena todos os dados
2. **Backend (Django)**: API REST que gerencia a lógica de negócio
3. **Frontend (Next.js)**: Interface web para usuários
4. **Proxy (Nginx)**: Roteia requisições entre frontend e backend

Toda comunicação com o sistema passa pelo proxy na porta 8080.

## Desenvolvimento

Para desenvolvimento, você pode executar os serviços individualmente. Consulte o `README.md` para mais detalhes sobre a arquitetura e desenvolvimento.

## Suporte

Para problemas ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação completa no `README.md`
