function errorResponse(res, status, message) {
  return res.status(status).json({
    error: true,
    message,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { errorResponse };