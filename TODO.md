### Completed ✅:

    - ✅ Arrumar refresh do token
        SOLUÇÃO: O interceptor do axios foi corrigido para ser async, redirecionar em caso de 403, e handle de token refresh apropriadamente.
    - ✅ Criar página Inbox
        SOLUÇÃO: Página de inbox criada em /inbox com hook useNotification e tipos apropriados.

### Pendente:

    - Implementar amplamente o search field no app/
        TODO: Adicionar componente de busca nas páginas principais
    
    - Testar autenticação end-to-end
        TODO: Validar fluxo completo de login, refresh e acesso a rotas protegidas
    
    - Criar e aplicar migrações do banco de dados
        TODO: Executar makemigrations e migrate para WeeklyLessonPlan model
