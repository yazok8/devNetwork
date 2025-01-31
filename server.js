const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const winston = require('winston');
const cors = require('cors');

// Configure CORS to allow requests only from your production domain
const corsOptions = {
  origin: 'https://social-devnetwork.onrender.com', // adjust if needed
  credentials: true,
};

const app = express();

// Parse cookies first
app.use(cookieParser());

// Apply CORS with your options
app.use(cors(corsOptions));

// Setup winston logger for logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json({ extended: false }));

// Setup request logging via morgan (logs forwarded to winston)
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Mount API routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/health', require('./routes/api/health'));

// Handle requests for favicon or code icon gracefully
app.get('/code.ico', (req, res) => res.status(204));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Start the server on the configured port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});
