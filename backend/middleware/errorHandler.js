function errorHandler(err, req, res, next) {
  // Never expose stack trace or internal error details to the client
  // Respond with HTTP 500 and the exact JSON { "error": "Something went wrong" }
  res.status(500).json({ error: 'Something went wrong' });
}

module.exports = errorHandler;
