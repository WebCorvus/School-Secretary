# Novas Funcionalidades - Sistema de Secretaria Escolar

Este documento descreve todas as novas funcionalidades implementadas no sistema de gerenciamento escolar.

## Índice

1. [Novos Modelos](#novos-modelos)
2. [Gestão de Notas e Desempenho](#gestão-de-notas-e-desempenho)
3. [Gestão de Faltas e Presenças](#gestão-de-faltas-e-presenças)
4. [Gestão Disciplinar](#gestão-disciplinar)
5. [Gestão Financeira](#gestão-financeira)
6. [Gestão de Matrículas](#gestão-de-matrículas)
7. [Gestão de Recursos e Materiais](#gestão-de-recursos-e-materiais)
8. [Gestão de Salas](#gestão-de-salas)
9. [Sistema de Notificações](#sistema-de-notificações)
10. [Relatórios e Análises](#relatórios-e-análises)
11. [Eventos e Inscrições](#eventos-e-inscrições)

---

## Novos Modelos

### Modelos de Estudantes (`students/models.py`)

#### Warning (Advertência)
Registra advertências disciplinares dadas aos alunos.
- **Campos**: aluno, motivo, data, emitido_por
- **Acesso**: Staff/Superuser (criar/editar), Autenticados (visualizar)

#### Suspension (Suspensão)
Registra suspensões de alunos.
- **Campos**: aluno, motivo, data_início, data_fim, emitido_por
- **Acesso**: Staff/Superuser (criar/editar), Autenticados (visualizar)

#### Tuition (Mensalidade)
Gerencia pagamentos de mensalidades.
- **Campos**: aluno, valor, data_vencimento, data_pagamento, status, mês_referência
- **Status**: PENDING, PAID, OVERDUE, CANCELLED
- **Acesso**: Staff/Superuser (criar/editar), Autenticados (visualizar histórico)

#### Enrollment (Matrícula)
Gerencia matrículas e rematrículas.
- **Campos**: aluno, turma, ano, status, data_matrícula, é_rematrícula
- **Status**: PENDING, APPROVED, REJECTED
- **Acesso**: Staff/Superuser (gerenciar), Autenticados (visualizar)

### Modelos da Escola (`school/models.py`)

#### EventRegistration (Inscrição em Evento)
Gerencia inscrições de alunos em eventos.
- **Campos**: evento, aluno, data_inscrição
- **Acesso**: Autenticados (criar), Staff (gerenciar)

#### Resource (Recurso)
Cataloga recursos disponíveis (computadores, livros, equipamentos).
- **Campos**: nome, tipo, descrição, status
- **Tipos**: COMPUTER, BOOK, EQUIPMENT, OTHER
- **Status**: AVAILABLE, IN_USE, MAINTENANCE, UNAVAILABLE
- **Acesso**: Staff (gerenciar), Autenticados (visualizar)

#### ResourceLoan (Empréstimo de Recurso)
Gerencia empréstimos de recursos para alunos.
- **Campos**: recurso, aluno, data_empréstimo, data_devolução_prevista, data_devolução_efetiva
- **Acesso**: Staff (gerenciar), Autenticados (visualizar próprios empréstimos)

#### Room (Sala)
Cadastra salas e espaços da escola.
- **Campos**: nome, tipo, capacidade, descrição
- **Tipos**: CLASSROOM, LABORATORY, AUDITORIUM, GYM, OTHER
- **Acesso**: Staff (gerenciar), Autenticados (visualizar)

#### RoomReservation (Reserva de Sala)
Gerencia reservas de salas por professores.
- **Campos**: sala, reservado_por, finalidade, data, hora_início, hora_fim
- **Acesso**: Professores (criar reservas), Staff (gerenciar), Autenticados (visualizar)

#### Notification (Notificação)
Sistema de notificações para usuários.
- **Campos**: destinatário, tipo, título, mensagem, lida, data_criação
- **Tipos**: GRADE, ABSENCE, WARNING, SUSPENSION, EVENT, ASSIGNMENT, EXAM, PAYMENT, GENERAL
- **Acesso**: Usuários veem apenas suas próprias notificações

---

## Gestão de Notas e Desempenho

### Endpoints Disponíveis

#### `GET /api/students/{id}/academic-report/`
Retorna relatório acadêmico completo do aluno.

**Resposta**:
```json
{
  "student_id": 1,
  "student_name": "João Silva",
  "registration_number": "123456",
  "group": "3º Ano A",
  "grades": {
    "Matemática": {
      "grades": {"1B": 8.5, "2B": 7.0, "3B": 9.0, "4B": 8.0},
      "average": 8.13
    }
  },
  "attendance": {
    "total_days": 100,
    "presences": 85,
    "absences": 15,
    "absence_rate": 15.00,
    "needs_attention": false
  },
  "discipline": {
    "warnings_count": 1,
    "suspensions_count": 0,
    "recent_warnings": [],
    "recent_suspensions": []
  }
}
```

#### `GET /api/students/{id}/download-academic-report/`
Baixa relatório acadêmico completo em PDF.

#### `GET /api/school/groups/{id}/performance-report/`
Retorna relatório de desempenho da turma.

**Resposta**:
```json
{
  "group": "3º Ano A",
  "total_students": 30,
  "subjects_performance": [
    {
      "subject": "Matemática",
      "average_grade": 7.5,
      "students_evaluated": 28
    }
  ],
  "attendance": {
    "overall_absence_rate": 12.5,
    "students_with_high_absences": [],
    "total_absences": 125
  },
  "discipline": {
    "total_warnings": 5,
    "total_suspensions": 1
  }
}
```

---

## Gestão de Faltas e Presenças

### Endpoints Disponíveis

#### `GET /api/students/presences/absence-report/`
Gera relatório de faltas identificando alunos com taxa acima de 25%.

**Resposta**:
```json
[
  {
    "student_id": 1,
    "student_name": "João Silva",
    "total_days": 100,
    "absences": 30,
    "absence_rate": 30.00,
    "needs_notification": true
  }
]
```

### Notificações Automáticas
- Sistema verifica automaticamente alunos com taxa de faltas > 25%
- Notifica responsáveis automaticamente quando limite é ultrapassado
- Comando para verificação periódica: `python manage.py send_notifications --absences`

---

## Gestão Disciplinar

### Endpoints Disponíveis

#### `GET /api/students/warnings/`
Lista todas as advertências.

#### `POST /api/students/warnings/`
Cria nova advertência (Staff/Superuser).

**Body**:
```json
{
  "student": 1,
  "reason": "Comportamento inadequado em sala de aula",
  "date": "2025-01-15",
  "issued_by": 2
}
```

#### `GET /api/students/suspensions/`
Lista todas as suspensões.

#### `POST /api/students/suspensions/`
Cria nova suspensão (Staff/Superuser).

**Body**:
```json
{
  "student": 1,
  "reason": "Violação grave do código de conduta",
  "start_date": "2025-01-20",
  "end_date": "2025-01-27",
  "issued_by": 2
}
```

### Notificações Automáticas
- Responsáveis são notificados automaticamente quando advertência é criada
- Responsáveis são notificados automaticamente quando suspensão é criada

---

## Gestão Financeira

### Endpoints Disponíveis

#### `GET /api/students/tuitions/`
Lista todas as mensalidades.

**Filtros**: `?status=PENDING`, `?student_id=1`

#### `POST /api/students/tuitions/`
Cria nova mensalidade (Staff/Superuser).

**Body**:
```json
{
  "student": 1,
  "amount": 1500.00,
  "due_date": "2025-02-10",
  "status": "PENDING",
  "reference_month": "2025-02-01"
}
```

#### `PATCH /api/students/tuitions/{id}/`
Atualiza status de mensalidade (marcar como paga).

**Body**:
```json
{
  "status": "PAID",
  "payment_date": "2025-02-08"
}
```

#### `GET /api/students/tuitions/payment-history/`
Retorna histórico de pagamentos.

**Query params**: `?student_id=1` (opcional)

#### `GET /api/students/tuitions/financial-report/`
Gera relatório financeiro completo.

**Query params**: `?student_id=1` (opcional para relatório individual)

**Resposta**:
```json
{
  "summary": {
    "total_pending": 5,
    "total_paid": 20,
    "total_overdue": 2,
    "amount_pending": 7500.00,
    "amount_paid": 30000.00
  },
  "payment_history": [...]
}
```

#### `GET /api/students/tuitions/download-financial-report/`
Baixa relatório financeiro em PDF.

### Notificações Automáticas
- Responsáveis são notificados quando mensalidade fica vencida
- Comando para verificação periódica: `python manage.py send_notifications --payments`

---

## Gestão de Matrículas

### Endpoints Disponíveis

#### `GET /api/students/enrollments/`
Lista todas as matrículas.

#### `POST /api/students/enrollments/`
Cria nova matrícula ou rematrícula (Staff/Superuser).

**Body**:
```json
{
  "student": 1,
  "group": 2,
  "year": 2025,
  "status": "PENDING",
  "enrollment_date": "2025-01-10",
  "is_reenrollment": false
}
```

#### `PATCH /api/students/enrollments/{id}/`
Atualiza status da matrícula.

**Body**:
```json
{
  "status": "APPROVED"
}
```

---

## Gestão de Recursos e Materiais

### Endpoints Disponíveis

#### `GET /api/school/resources/`
Lista todos os recursos disponíveis.

#### `POST /api/school/resources/`
Cadastra novo recurso (Staff).

**Body**:
```json
{
  "name": "Notebook Dell Inspiron 15",
  "resource_type": "COMPUTER",
  "description": "Notebook para uso em laboratório",
  "status": "AVAILABLE"
}
```

#### `GET /api/school/resource-loans/`
Lista todos os empréstimos.

#### `POST /api/school/resource-loans/`
Cria novo empréstimo (Staff).

**Body**:
```json
{
  "resource": 1,
  "student": 5,
  "loan_date": "2025-01-15",
  "return_date": "2025-01-29"
}
```

#### `PATCH /api/school/resource-loans/{id}/`
Registra devolução de recurso.

**Body**:
```json
{
  "actual_return_date": "2025-01-28"
}
```

---

## Gestão de Salas

### Endpoints Disponíveis

#### `GET /api/school/rooms/`
Lista todas as salas.

#### `POST /api/school/rooms/`
Cadastra nova sala (Staff).

**Body**:
```json
{
  "name": "Laboratório de Química",
  "room_type": "LABORATORY",
  "capacity": 30,
  "description": "Laboratório equipado com bancadas e equipamentos"
}
```

#### `GET /api/school/room-reservations/`
Lista todas as reservas de salas.

#### `POST /api/school/room-reservations/`
Cria nova reserva (Professores).

**Body**:
```json
{
  "room": 1,
  "reserved_by": 3,
  "purpose": "Aula prática de Química",
  "date": "2025-01-20",
  "start_time": "14:00:00",
  "end_time": "16:00:00"
}
```

---

## Sistema de Notificações

### Endpoints Disponíveis

#### `GET /api/school/notifications/`
Lista notificações do usuário autenticado.

**Filtros**: `?read=false`, `?notification_type=ABSENCE`

#### `POST /api/school/notifications/{id}/mark-read/`
Marca notificação como lida.

#### `POST /api/school/notifications/mark-all-read/`
Marca todas as notificações do usuário como lidas.

### Tipos de Notificações

1. **GRADE** - Notas baixas
2. **ABSENCE** - Taxa de faltas elevada (>25%)
3. **WARNING** - Nova advertência
4. **SUSPENSION** - Nova suspensão
5. **EVENT** - Eventos próximos
6. **ASSIGNMENT** - Novos trabalhos
7. **EXAM** - Provas agendadas
8. **PAYMENT** - Mensalidades vencidas
9. **GENERAL** - Notificações gerais

### Sistema Automático

#### Notificações em Tempo Real (Signals)
- Advertências criadas → notifica responsáveis
- Suspensões criadas → notifica responsáveis
- Mensalidades vencidas → notifica responsáveis
- Itens de agenda criados → notifica alunos

#### Verificações Periódicas (Management Command)
```bash
# Verificar todas as notificações
python manage.py send_notifications --all

# Verificar apenas faltas
python manage.py send_notifications --absences

# Verificar apenas notas
python manage.py send_notifications --grades

# Verificar apenas pagamentos
python manage.py send_notifications --payments

# Verificar apenas eventos próximos
python manage.py send_notifications --events
```

**Recomendação**: Configurar cron job ou task scheduler para executar diariamente:
```cron
0 8 * * * /path/to/python /path/to/manage.py send_notifications --all
```

---

## Relatórios e Análises

### Relatórios Disponíveis

#### 1. Relatório Acadêmico do Aluno
- **Endpoint**: `GET /api/students/{id}/academic-report/`
- **PDF**: `GET /api/students/{id}/download-academic-report/`
- **Conteúdo**: Notas por disciplina e bimestre, média geral, frequência, advertências, suspensões

#### 2. Relatório de Desempenho da Turma
- **Endpoint**: `GET /api/school/groups/{id}/performance-report/`
- **Conteúdo**: Média da turma por disciplina, taxa de faltas, registros disciplinares, alunos em situação crítica

#### 3. Relatório Financeiro
- **Endpoint**: `GET /api/students/tuitions/financial-report/`
- **PDF**: `GET /api/students/tuitions/download-financial-report/`
- **Conteúdo**: Resumo de pagamentos (pendentes, pagos, vencidos), histórico de pagamentos

#### 4. Relatório de Faltas
- **Endpoint**: `GET /api/students/presences/absence-report/`
- **Conteúdo**: Lista de todos os alunos com suas taxas de falta, identificando quem precisa de atenção

#### 5. Alunos Necessitando Atenção
- **Endpoint**: `GET /api/students/students-needing-attention/`
- **Conteúdo**: Lista alunos com faltas altas, notas baixas ou pagamentos atrasados

---

## Eventos e Inscrições

### Funcionalidades Aprimoradas

#### Campos Adicionados ao Modelo Event
- `allow_registration`: Permite inscrições de alunos
- `max_participants`: Limite de participantes

#### Endpoints Disponíveis

#### `POST /api/school/events/{id}/register/`
Inscreve aluno autenticado em evento.

**Resposta de sucesso**:
```json
{
  "message": "Successfully registered for event"
}
```

**Respostas de erro**:
- Evento não permite inscrições
- Evento lotado (máximo de participantes atingido)
- Apenas alunos podem se inscrever

#### `GET /api/school/event-registrations/`
Lista todas as inscrições em eventos.

**Filtros**: `?event=1`, `?student=5`

---

## Permissões por Tipo de Usuário

### STUDENT (Aluno)
- **Visualizar**: próprias notas, faltas, advertências, suspensões, mensalidades, horários, eventos
- **Baixar**: próprio relatório acadêmico, relatório financeiro
- **Inscrever-se**: em eventos abertos
- **Receber**: notificações de trabalhos, provas, eventos

### GUARDIAN (Responsável)
- **Visualizar**: dados do aluno responsável (notas, faltas, advertências, suspensões, mensalidades)
- **Baixar**: relatórios acadêmicos e financeiros do aluno
- **Receber**: notificações sobre faltas, notas baixas, advertências, suspensões, pagamentos

### PROFESSOR (Professor)
- **Criar/Editar**: notas, presenças, itens de agenda, reservas de salas
- **Visualizar**: dados de alunos, turmas, horários
- **Gerenciar**: recursos educacionais

### STAFF (Equipe)
- **Gerenciar**: todos os recursos, matrículas, mensalidades, disciplina, salas
- **Criar**: alunos, professores, turmas, eventos, advertências, suspensões
- **Visualizar**: todos os relatórios e análises

### SUPERUSER (Superusuário)
- **Acesso total**: todas as funcionalidades do sistema

---

## Próximos Passos

Para continuar o desenvolvimento, considere:

1. **Frontend**: Criar interfaces para todas as novas funcionalidades
2. **Dashboards**: Criar painéis visuais com gráficos de desempenho
3. **Email**: Integrar envio de emails para notificações críticas
4. **SMS**: Integrar envio de SMS para alertas urgentes
5. **API de Pagamento**: Integrar gateway de pagamento para mensalidades online
6. **Relatórios Avançados**: Adicionar mais tipos de análises e comparações
7. **Exportação**: Permitir exportação de relatórios em diversos formatos (Excel, CSV)
8. **Histórico**: Manter histórico completo de mudanças em registros importantes
9. **Assinatura Digital**: Implementar assinatura digital para documentos oficiais
10. **Mobile App**: Desenvolver aplicativo mobile para acesso dos pais

---

## Suporte

Para dúvidas ou suporte, consulte:
- Documentação técnica em `/docs`
- README.md do projeto
- Comentários no código fonte

## Autores

Backend e novas funcionalidades implementadas por João Miguel Freire de Oliveira Mendes e João Victor Pinheiro Reis.
