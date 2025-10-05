# Filmes API

Uma API RESTful completa para gerenciar um catálogo de filmes e diretores, construída com Node.js, Express e autenticação JWT.

## Funcionalidades

- CRUD completo para Filmes.
- CRUD completo para Diretores.
- Autenticação baseada em JWT (HMAC SHA256).
- Middlewares para CORS, Logging de requisições e Autorização.
- Validação de dados de entrada com Joi.
- Armazenamento de dados em arquivos JSON.
- Respostas de erro padronizadas.

## Tecnologias

- **Node.js**: v18 ou superior
- **Express**: v5 (beta)
- **Joi**: Para validação de schemas
- **dotenv**: Para gerenciamento de variáveis de ambiente

## Estrutura do Projeto

O projeto segue uma arquitetura modular para facilitar a manutenção e escalabilidade.

- `/src/models`: Definição das classes e schemas de validação (Joi).
- `/src/database`: Camada de abstração para acesso aos dados (JSON).
- `/src/middlewares`: Middlewares de CORS, logging e autenticação.
- `/src/routes`: Definição das rotas da API.
- `/src/auth`: Lógica de geração e validação de JWT.
- `/src/utils`: Funções utilitárias (ex: respostas de erro).
- `/src/data`: Arquivos JSON que servem como banco de dados.

## Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd filmes-api
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    - Renomeie o arquivo `.env.example` para `.env`.
    - Preencha as variáveis, especialmente `JWT_SECRET` com um valor seguro.

4.  **Inicie o servidor:**
    ```bash
    npm start
    ```

O servidor estará rodando em `http://localhost:3000`.

## Como Usar a API

Para interagir com os endpoints protegidos, primeiro obtenha um token de autenticação.

1.  **Obter Token:**
    - Faça uma requisição `POST` para `/auth/token` com sua `apiKey` no corpo.

2.  **Fazer Requisições Autenticadas:**
    - Adicione o header `Authorization: Bearer <seu-token-jwt>` em todas as chamadas para as rotas de `/filmes` e `/diretores`.

Consulte o arquivo `test.rest` para ver exemplos práticos de todas as requisições.