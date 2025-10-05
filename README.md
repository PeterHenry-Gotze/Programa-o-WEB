# Programa-o-WEB
Trabalho de Programação WEB - Aluno: Pedro Henrique - RA: 41389
##IAs usadas: ChatGPT e Gemini. 

##ChatGPT:
Deixo abaixo o link com a interação com o ChatGPT para melhor visualização e interação com os prompts:
https://chatgpt.com/share/68e2c899-39a4-8012-827b-749ade5ea52f


##Gemini:

Crie um projeto completo em Node.js + Express, inspirado no código base que já foi fornecido (o projeto das Músicas com Joi, Express e middlewares).

Use o mesmo padrão de arquitetura e estilo de código, mas com o novo domínio de negócio: “Filmes”, adicionando também um segundo recurso (entidade) chamado “Diretores”.
O projeto será um servidor HTTP RESTful que oferece endpoints CRUD (Create, Read, Update, Delete) para ambos os recursos.
A IA deverá gerar todo o código, organizado em múltiplos arquivos e pastas, mantendo o mesmo espírito do projeto enviado como referência (uso de módulos, middlewares, Joi, JSON ou SQLite como armazenamento, etc.).
📂 Estrutura de pastas esperada
A estrutura do novo projeto deverá ser semelhante a esta:

/filmes-api
│
├── /src
│   ├── /models
│   │   ├── Filme.js
│   │   └── Diretor.js
│   │
│   ├── /database
│   │   └── database.js        # abstração para leitura/escrita em JSON
│   │
│   ├── /middlewares
│   │   ├── cors.js
│   │   ├── log.js
│   │   └── auth.js
│   │
│   ├── /utils
│   │   ├── order.js
│   │   └── response.js
│   │
│   ├── /routes
│   │   ├── filmesRoutes.js
│   │   └── diretoresRoutes.js
│   │
│   ├── /auth
│   │   └── jwt.js
│   │
│   ├── /data
│   │   ├── filmes.json
│   │   └── diretores.json
│   │
│   └── server.js
│
├── package.json
├── .env.example
└── README.md
⚙️ Tecnologias obrigatórias
Node.js (v18 ou superior)
Express (v5 ou superior)
Joi (para validação dos modelos)
Crypto (para assinatura HMAC de tokens JWT)
File System (JSON) como armazenamento inicial
dotenv para variáveis de ambiente
(opcional, mas recomendado: preparar base para migração a SQLite ou MongoDB futuramente)
🎬 Entidade 1: Filmes
Atributos obrigatórios:

{
  "id": 1,
  "titulo": "O Poderoso Chefão",
  "diretor": "Francis Ford Coppola",
  "ano": 1972,
  "genero": "Drama",
  "duracao_minutos": 175,
  "nota_imdb": 9.2
}
Validações Joi:

titulo: string obrigatória
diretor: string obrigatória
ano: inteiro entre 1900 e 2025
genero: string obrigatória
duracao_minutos: número inteiro positivo
nota_imdb: número de 0 a 10 (pode ter decimal)
🎥 Entidade 2: Diretores
Atributos obrigatórios:

{
  "id": 1,
  "nome": "Christopher Nolan",
  "pais_origem": "Reino Unido",
  "ano_nascimento": 1970,
  "quantidade_filmes": 12
}
Validações Joi:

nome: string obrigatória
pais_origem: string obrigatória
ano_nascimento: número entre 1900 e 2020
quantidade_filmes: inteiro >= 0
🌐 Rotas REST (CRUD completo)
🎬 Rotas de Filmes
MétodoRotaDescriçãoGET/filmesListar todos os filmesGET/filmes/:idObter detalhes de um filme específicoPOST/filmesCadastrar novo filmePUT/filmes/:idAtualizar dados de um filmeDELETE/filmes/:idRemover filme🎥 Rotas de Diretores
MétodoRotaDescriçãoGET/diretoresListar todos os diretoresGET/diretores/:idDetalhar um diretor específicoPOST/diretoresCadastrar novo diretorPUT/diretores/:idAtualizar dados de um diretorDELETE/diretores/:idRemover diretor🔐 Autenticação JWT
O projeto deve conter uma rota pública:

POST /auth/token
Esta rota deve receber um apiKey no corpo da requisição (ex: { "apiKey": "123abc" }) e retornar um JWT válido, gerado com HMAC SHA256 usando um segredo do .env (JWT_SECRET).
Todas as rotas de CRUD (Filmes e Diretores) deverão ser protegidas por um middleware de autenticação (auth.js), que:

Verifica se existe header Authorization: Bearer <token>
Decodifica o JWT e valida assinatura e expiração
Caso inválido → retorna 401 Unauthorized
Caso válido → injeta req.userId e chama next()
O token deve ter expiração curta (por exemplo, 10 minutos) e conter no payload:

{
  "userId": 1,
  "iat": 1728075600000,
  "exp": 1728076200000,
  "iss": "filmes-api"
}
🧩 Middlewares obrigatórios
1️⃣ CORS Middleware
Reaproveite o estilo da Pasta 1, implementando:

Liberação de origem *
Headers:
Access-Control-Allow-Origin,
Access-Control-Allow-Methods,
Access-Control-Allow-Headers
Resposta imediata a OPTIONS com status 200
2️⃣ LOG Middleware
Inspiração: Pasta 2 — logMiddleware.

O middleware deve:
Registrar antes do handler:
método HTTP
URL
timestamp inicial
Registrar depois do handler:
status de resposta
duração em ms
timestamp final
Formato sugerido de log:

[2025-10-04T15:23:11Z] GET /filmes -> 200 (32ms)
3️⃣ Autenticação Middleware
Inspirado na Pasta 2, mas agora:

Verifica header Authorization
Decodifica o token via módulo jwt.js
Se falhar → responde com 401
Se passar → segue para o próximo handler
⚠️ Tratamento de erros (Boas práticas HTTP)
Respostas esperadas:
200 OK → operações bem-sucedidas (GET, PUT, DELETE)
201 Created → criação com sucesso (POST)
400 Bad Request → dados inválidos (Joi ou formato incorreto)
401 Unauthorized → token inválido ou ausente
404 Not Found → id inexistente
500 Internal Server Error → erro inesperado (exceptions, parse, IO)
Exemplo de resposta padrão de erro:
{
  "error": true,
  "message": "Filme não encontrado",
  "timestamp": "2025-10-04T15:30:02Z"
}
Crie um helper em utils/response.js:

function errorResponse(res, status, message) {
  return res.status(status).json({
    error: true,
    message,
    timestamp: new Date().toISOString()
  });
}
💾 Armazenamento (File-based JSON)
Cada entidade (Filmes, Diretores) terá um arquivo JSON dentro de /src/data, no formato:

{
  "nextId": 3,
  "filmes": [
    { "id": 1, "titulo": "...", ... }
  ]
}
O módulo /src/database/database.js deve exportar funções genéricas como:

async function readData(file) { ... }
async function writeData(file, data) { ... }
async function getAll(resource) { ... }
async function getById(resource, id) { ... }
async function insert(resource, obj) { ... }
async function update(resource, id, obj) { ... }
async function remove(resource, id) { ... }
Todas elas devem usar fs/promises e tratar erros com try/catch, retornando códigos HTTP apropriados.
📚 Boas práticas exigidas
Código 100% funcional (sem funções vazias ou pseudocódigo)
Sem uso incorreto de Promises (sempre await ou .then)
Usar async/await em todas as operações assíncronas
Nenhuma promise sem return
Nenhum try sem catch
Nenhum erro genérico sem log de contexto
Não duplicar código entre rotas
Comentários breves e claros
Linter/formatter configurado (ESLint + Prettier recomendados)
🧪 Testes e exemplos de uso
Gerar um arquivo test.rest (compatível com REST Client) contendo exemplos de chamadas para todas as rotas:

### Token (público)
POST http://localhost:3000/auth/token
Content-Type: application/json

{
  "apiKey": "123abc"
}

### Listar Filmes
GET http://localhost:3000/filmes
Authorization: Bearer <token>

### Inserir Filme
POST http://localhost:3000/filmes
Authorization: Bearer <token>
Content-Type: application/json

{
  "titulo": "Interestelar",
  "diretor": "Christopher Nolan",
  "ano": 2014,
  "genero": "Ficção Científica",
  "duracao_minutos": 169,
  "nota_imdb": 8.6
}
✅ Critérios de aceitação
Todas as rotas CRUD de ambos os recursos funcionando.
Autenticação obrigatória em tudo exceto /auth/token.
Middlewares (CORS, LOG, AUTH) ativos e aplicados corretamente.
Validações Joi ativas em POST e PUT.
Respostas com códigos HTTP corretos.
Projeto rodando em npm start na porta 3000.
Nenhum erro de lint, promise pendente ou bug lógico como no código original.
💡 Resumo rápido das instruções que a IA deve seguir
Gere um servidor Express completo, reutilizando padrões e ideias do projeto de músicas fornecido, mas:

substitua o domínio por “Filmes” e adicione “Diretores”;
use middlewares de CORS, LOG e AUTH;
implemente CRUD completo para ambos;
valide com Joi;
use JWT com HMAC SHA256;
trate erros com mensagens JSON padronizadas;
mantenha tudo modular e limpo.
🔨 Extras opcionais (para bônus de complexidade)
Adicionar endpoint /filmes/populares que retorna top 5 por nota IMDb
Adicionar endpoint /diretores/prolificos que lista diretores com +10 filmes
Criar cache simples em memória (Map) para GET /filmes
Criar logs em arquivo (logs/app.log) além do console
🚀 Resultado esperado
Ao rodar o comando:

npm install
npm start
Deve exibir:

Servidor Filmes API rodando na porta 3000
E ao acessar GET /filmes com um token válido, deve retornar uma lista de filmes com status 200.

No arquivo, mostrar os resultados:

/Filmes
│
├── src/
│   ├── models/
│   │   ├── Filme.js
│   │   └── Diretor.js
│   │
│   ├── database/
│   │   └── database.js
│   │
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── cors.js
│   │   └── log.js
│   │
│   ├── utils/
│   │   └── response.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── filmesRoutes.js
│   │   └── diretoresRoutes.js
│   │
│   ├── auth/
│   │   └── jwt.js
│   │
│   ├── data/
│   │   ├── filmes.json
│   │   ├── diretores.json
│   │   └── users.json
│   │
│   └── server.js
│
├── .env
├── .env.example
├── package.json
├── README.md
└── test.rest


##O resultado funcionou para você?
Sim, porém, não satisfatório, ficou muito portador de diploma sem saber o que estava acontecendo. Em resumo, meio que um CTRL+C e CTRL+V de prompts de IA
