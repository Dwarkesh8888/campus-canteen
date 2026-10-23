const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const ordersRouter = require('./routes/orders');

const app = express();

// Early request logging middleware (logs every request in [METHOD] [PATH] [TIMESTAMP] format)
app.use(requestLogger);

// Built-in body parser and CORS
app.use(cors());
app.use(express.json());

// Handle malformed JSON bodies gracefully before routes
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }
  next(err);
});

// Root healthcheck
app.get('/', (req, res) => {
  res.json({ message: 'Campus Canteen API is running' });
});

// Orders API routes
app.use('/api/v1/orders', ordersRouter);

// GET /api/v1/boom: intentionally throws to verify centralized error-handling
app.get('/api/v1/boom', (req, res, next) => {
  throw new Error('Intentional crash for testing error handling');
});

// Centralized error handling middleware (must be registered after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
  });
}

module.exports = app;
