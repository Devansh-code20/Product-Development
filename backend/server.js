require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/solutions', require('./routes/solutions'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/events', require('./routes/events'));
app.use('/api/gallery', require('./routes/gallery'));


const emailRoutes = require('./routes/email');


app.use('/api/email', emailRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI-Solutions API is running', timestamp: new Date().toISOString() });
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // 404 handler for API-only dev mode
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found.' });
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

// Initialize DB then start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 AI-Solutions API server running on port ${PORT}`);
    console.log(`📊 Admin login: username=admin, password=Admin@123`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

