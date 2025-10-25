### front:

    - Arrumar refresh do token (feito)
        CAUSA: O interceptor do axios não estava marcado como async, impedindo o uso correto de await/refresh. Além disso, o frontend não redirecionava para login em caso de 403, e pode faltar fluxo de login funcional.
        + arrumar notas e presença: "detail": "Authentication credentials were not provided."
        CAUSA: O frontend está tentando acessar rotas protegidas sem token válido ou sem fluxo de login, resultando em 401 do backend.
    - Criar página Inbox (feito)
    - Implementar amplamente o search field no app/
### Pendente:
    - Testar autenticação end-to-end(aparenteme foi, recomendo testar mais)
        TODO: Validar fluxo completo de login, refresh e acesso a rotas protegidas
    
    - Criar e aplicar migrações do banco de dados(feito)
        TODO: Executar makemigrations e migrate para WeeklyLessonPlan model

### Completed ✅:

    - ✅ Arrumar refresh do token
        SOLUÇÃO: O interceptor do axios foi corrigido para ser async, redirecionar em caso de 403, e handle de token refresh apropriadamente.
    - ✅ Criar página Inbox
        SOLUÇÃO: Página de inbox criada em /inbox com hook useNotification e tipos apropriados.
    - ✅ Criar e aplicar migrações do banco de dados
        SOLUÇÃO: WeeklyLessonPlan model criado e migrado automaticamente via entrypoint.sh
    - ✅ Testar autenticação end-to-end
        SOLUÇÃO: Testado com dados pseudo-reais. Login, tokens JWT e endpoints protegidos funcionando perfeitamente.
    - ✅ Implementar WeeklyLessonPlan (Planejamento Semanal de Aulas)
        SOLUÇÃO: Modelo, serializer, viewset e endpoints completos. Testado com 3 planos de aula.
    - ✅ Implementar Análise de Eficiência (Taxa de Aprovação e Evasão)
        SOLUÇÃO: Funções de cálculo, endpoints globais e por turma. Testado com dados reais.
    - ✅ Validar novos endpoints com dados
        SOLUÇÃO: Criados usuários, notas, presença e notificações. Todos os endpoints retornando dados corretos.
        - sim. foram apagados para evitar inconsistencia.(jm)

