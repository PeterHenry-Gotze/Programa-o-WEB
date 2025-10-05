const { createHmac } = require('node:crypto');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('A variável de ambiente JWT_SECRET é obrigatória.');
}

const SECRET_BUFFER = Buffer.from(JWT_SECRET, 'utf-8');
const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

const base64UrlEncode = (buffer) => {
  return buffer.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const generateToken = (payloadData) => {
  return new Promise((resolve, reject) => {
    try {
      const header = { alg: 'HS256', typ: 'JWT' };
      const now = Date.now();
      const payload = {
        ...payloadData,
        iat: now,
        exp: now + TEN_MINUTES_IN_MS,
        iss: 'filmes-api',
      };

      const headerBase64 = base64UrlEncode(Buffer.from(JSON.stringify(header)));
      const payloadBase64 = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
      
      const dataToSign = `${headerBase64}.${payloadBase64}`;

      const signature = createHmac('sha256', SECRET_BUFFER)
        .update(dataToSign)
        .digest();
      
      const signatureBase64 = base64UrlEncode(signature);
      
      const jwt = `${dataToSign}.${signatureBase64}`;
      resolve(jwt);
    } catch (err) {
      reject(err);
    }
  });
};

const validateToken = (token) => {
  return new Promise((resolve) => {
    try {
      const [encHeader, encPayload, signature] = token.split('.');
      if (!encHeader || !encPayload || !signature) {
        return resolve({ valid: false, message: 'Formato do token inválido.' });
      }

      const dataToSign = `${encHeader}.${encPayload}`;
      const computedSignature = base64UrlEncode(createHmac('sha256', SECRET_BUFFER).update(dataToSign).digest());

      if (computedSignature !== signature) {
        return resolve({ valid: false, message: 'Assinatura do token inválida.' });
      }

      const decodedPayload = JSON.parse(Buffer.from(encPayload, 'base64').toString());

      if (Date.now() > decodedPayload.exp) {
        return resolve({ valid: false, message: 'Token expirado.' });
      }

      resolve({ valid: true, payload: decodedPayload });
    } catch (err) {
      resolve({ valid: false, message: 'Erro ao decodificar o token.' });
    }
  });
};

module.exports = { generateToken, validateToken };