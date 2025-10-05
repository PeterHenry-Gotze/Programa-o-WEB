const express = require('express');
const { findUserByApiKey } = require('../database/database');
const { generateToken } = require('../auth/jwt');
const { errorResponse } = require('../utils/response');

const router = express.Router();

router.post('/token', async (req, res) => {
  const { apiKey } = req.body;

  if (!apiKey) {
    return errorResponse(res, 400, 'apiKey é obrigatória.');
  }

  try {
    const user = await findUserByApiKey(apiKey);

    if (!user) {
      // Verificação para apiKey no .env como fallback
      if (apiKey !== process.env.API_KEY) {
        return errorResponse(res, 401, 'apiKey inválida.');
      }
      // Se a chave do .env for usada, atribuímos um ID padrão
      user = { id: 'default_user' };
    }

    const token = await generateToken({ userId: user.id });
    return res.status(200).json({ token });

  } catch (error) {
    console.error('Erro ao gerar token:', error);
    return errorResponse(res, 500, 'Erro interno ao gerar o token.');
  }
});

module.exports = router;