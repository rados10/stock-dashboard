require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import cors middleware
const stockRoutes = require('./routes/stockRoutes'); // Import routes (will create this next)

const app = express();
const PORT = process.env.PORT || 3001; // Use port from env or default to 3001

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/stocks', stockRoutes); // Mount stock routes

// Basic error handling (can be expanded)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});