# Comando Seed Data

O comando `seed_data` é um utilitário para popular o banco de dados com dados de teste em três modos diferentes.

## Uso

```bash
python manage.py seed_data <mode>
```

Onde `<mode>` pode ser:
- `example`
- `fast-use`
- `factory`

## Modos

### 1. Example Mode
```bash
python manage.py seed_data example
```

**Descrição:** Gera dados completos em todas as models, incluindo:
- Usuários de todos os tipos (STUDENT, GUARDIAN, PROFESSOR, STAFF)
- Estudantes com matrículas, notas, presenças
- Responsáveis com contratos
- Professores vinculados a disciplinas
- Turmas, itinerários e disciplinas
- Aulas, eventos, recursos, salas
- Mensalidades, advertências, suspensões
- Itens de agenda

**Saída:** Exibe credenciais de login para um usuário de cada tipo para teste manual:
- STUDENT (estudante)
- GUARDIAN (responsável)
- PROFESSOR (professor)
- STAFF (equipe administrativa)

**Exemplo de saída:**
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

### 2. Fast-Use Mode
```bash
python manage.py seed_data fast-use
```

**Descrição:** Gera todos os dados necessários para iniciar o projeto como um sistema escolar operacional, **faltando apenas:**
- Dados de responsáveis (guardians)
- Dados de alunos (students)
- Dados correlacionados aos alunos (contratos, notas, presenças, mensalidades)

**Cria:**
- 3 Itinerários
- 10 Disciplinas
- 6 Turmas (1º, 2º e 3º ano, A e B)
- 10 Professores (um por disciplina)
- Grade de aulas para cada turma
- 6 Salas (classrooms, laboratórios, auditório, ginásio)
- 4 Recursos (computadores, equipamentos)
- 3 Eventos futuros
- 3 Livros na biblioteca

**Uso recomendado:** Para começar um sistema novo onde você vai cadastrar manualmente alunos e responsáveis reais.

### 3. Factory Mode
```bash
python manage.py seed_data factory
```

**Descrição:** Reseta todo o banco de dados para um estado limpo, removendo:
- Todos os estudantes e dados relacionados
- Todos os responsáveis e contratos
- Todos os professores
- Todas as turmas, disciplinas, itinerários
- Todos os eventos, recursos, salas
- Todos os usuários regulares

**Preserva:**
- Superusuários (is_superuser=True)
- Usuários staff (is_staff=True)

**Uso recomendado:** Para limpar completamente o banco de dados e recomeçar do zero, mantendo apenas contas administrativas importantes.

## Sequência Recomendada de Uso

1. **Desenvolvimento inicial:**
   ```bash
   python manage.py seed_data example
   ```
   Use este modo para testar todas as funcionalidades com dados completos.

2. **Preparar para produção:**
   ```bash
   python manage.py seed_data factory  # Limpa tudo
   python manage.py seed_data fast-use  # Cria estrutura básica
   ```
   Depois cadastre alunos e responsáveis reais através da interface.

3. **Resetar para testes:**
   ```bash
   python manage.py seed_data factory  # Limpa
   python manage.py seed_data example  # Gera dados de teste novamente
   ```

## Notas Importantes

- Todos os comandos são **transacionais** - se ocorrer um erro, nenhuma alteração será salva
- O modo `example` executa `fast-use` internamente antes de adicionar alunos e responsáveis
- As senhas dos usuários de teste são simples (student123, professor123, etc.) - **nunca use em produção**
- O modo `factory` é **destrutivo** - use com cuidado em ambientes de produção

## Dependências

- Faker (para gerar dados aleatórios em português brasileiro)
- Django 5.1+
- Todos os models configurados corretamente

## Autores

Desenvolvido para o projeto School-Secretary
