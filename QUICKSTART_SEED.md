# Início Rápido - Comando Seed

## TL;DR - Como Usar

### 1. Para Desenvolvimento e Testes
```bash
# No Docker
docker exec school-secretary-api python manage.py seed_data example

# Ou localmente
cd api
python manage.py seed_data example
```

**Resultado:** Sistema completo com dados de teste e credenciais de login exibidas no terminal.

### 2. Para Iniciar Sistema em Produção
```bash
# Limpa dados antigos (se houver)
python manage.py seed_data factory

# Cria estrutura básica
python manage.py seed_data fast-use
```

**Resultado:** Sistema pronto para cadastro manual de alunos e responsáveis reais.

### 3. Para Resetar Tudo
```bash
python manage.py seed_data factory
```

**Resultado:** Banco limpo, preservando apenas superusers e staff.

## Exemplo de Saída do Modo `example`

```
======================================================================
USUÁRIOS DE TESTE - CREDENCIAIS PARA LOGIN
======================================================================

STUDENT:
  Nome: Brayan Ramos
  Email: erick32@example.org
  Senha: student123
  Turma: 1º Ano A

GUARDIAN:
  Nome: Marcelo Sales
  Email: zpimenta@example.org
  Senha: guardian123
  Aluno: Brenda Leão

STAFF:
  Nome: Admin Staff
  Email: staff@escola.com
  Senha: staff123
  Descrição: Administrador da escola

PROFESSOR:
  Nome: Joaquim Marques
  Email: isabela62@example.com
  Senha: professor123
  Disciplina: Matemática
======================================================================
```

## Testando o Sistema

1. **Inicie o sistema:**
   ```bash
   ./controller.sh start
   ```

2. **Execute o seed:**
   ```bash
   docker exec school-secretary-api python manage.py seed_data example
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:8080
   ```

4. **Faça login com uma das credenciais exibidas**

5. **Teste as funcionalidades:**
   - Como STUDENT: veja suas notas, agenda, eventos
   - Como GUARDIAN: veja dados do seu aluno
   - Como PROFESSOR: gerencie aulas e notas
   - Como STAFF: administre o sistema

## Dúvidas?

Consulte `/api/SEED_COMMAND_README.md` para documentação completa.
