### front:

    - Arrumar refresh do token
        CAUSA: O interceptor do axios não estava marcado como async, impedindo o uso correto de await/refresh. Além disso, o frontend não redirecionava para login em caso de 403, e pode faltar fluxo de login funcional.
        + arrumar notas e presença: "detail": "Authentication credentials were not provided."
        CAUSA: O frontend está tentando acessar rotas protegidas sem token válido ou sem fluxo de login, resultando em 401 do backend.
    - Criar página Inbox
    - Implementar amplamente o search field no app/
