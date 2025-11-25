const express = require('express');
const cors = require('cors');
const apodRoutes = require('./routes/apodRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NASA APOD Explorer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      today: '/api/apod/today',
      byDate: '/api/apod/by-date?date=YYYY-MM-DD',
      recent: '/api/apod/recent?days=N'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// APOD routes
app.use('/api/apod', apodRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
