const logMiddleware = (req, res, next) => {
  const startTime = new Date();
  const { method, originalUrl } = req;

  console.log(`[${startTime.toISOString()}] ${method} ${originalUrl} -> Request received`);

  // 'finish' é um evento emitido quando a resposta é enviada ao cliente
  res.on('finish', () => {
    const endTime = new Date();
    const duration = endTime - startTime;
    const { statusCode } = res;

    console.log(`[${endTime.toISOString()}] ${method} ${originalUrl} -> ${statusCode} (${duration}ms)`);
  });

  next();
};

module.exports = logMiddleware;