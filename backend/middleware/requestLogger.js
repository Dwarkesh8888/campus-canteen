function requestLogger(req, res, next) {
  const method = req.method;
  const path = req.originalUrl || req.url;
  const timestamp = new Date().toISOString();

  // Exactly one log line per request
  console.log(`[${method}] ${path} ${timestamp}`);
  next();
}

module.exports = requestLogger;
