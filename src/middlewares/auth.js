const { validateToken } = require('../auth/jwt');
const { errorResponse } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return errorResponse(res, 401, 'Token de autorização não fornecido.');
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return errorResponse(res, 401, 'Formato do header de autorização inválido. Esperado: "Bearer <token>".');
  }

  try {
    const result = await validateToken(token);

    if (!result.valid) {
      return errorResponse(res, 401, result.message || 'Token inválido ou expirado.');
    }

    // Injeta o ID do usuário na requisição para uso posterior nas rotas
    req.userId = result.payload.userId;
    next();
  } catch (error) {
    console.error('Erro na validação do token:', error);
    return errorResponse(res, 500, 'Erro interno ao processar o token.');
  }
};

module.exports = authMiddleware;