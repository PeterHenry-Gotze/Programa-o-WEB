require('dotenv').config();

const express = require('express');
const corsMiddleware = require('./middlewares/cors');
const logMiddleware = require('./middlewares/log');
const authMiddleware = require('./middlewares/auth');

const authRoutes = require('./routes/authRoutes');
const filmesRoutes = require('./routes/filmesRoutes');
const diretoresRoutes = require('./routes/diretoresRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições
app.use(corsMiddleware); // Aplica as políticas de CORS
app.use(logMiddleware); // Aplica o logging de requisições

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas protegidas
// O middleware de autenticação é aplicado aqui para todas as rotas de filmes e diretores
app.use('/filmes', authMiddleware, filmesRoutes);
app.use('/diretores', authMiddleware, diretoresRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à Filmes API!',
    version: '1.0.0',
    documentation: 'Consulte o README.md para mais informações.'
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error('Erro ao iniciar o servidor:', err);
  } else {
    console.log(`Servidor Filmes API rodando na porta ${PORT}`);
  }
});