const express = require('express');
const { getLiveStockData } = require('../services/finnhubService'); // Service to fetch data (will create next)

const router = express.Router();

// GET /api/stocks
router.get('/', async (req, res, next) => {
  try {
    const symbols = ['AAPL', 'GOOGL', 'MSFT']; // Stocks to fetch
    const stockData = await getLiveStockData(symbols);
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    // Pass error to the central error handler in server.js
    next(error);
    // Or send a specific error response here:
    // res.status(500).json({ message: 'Failed to fetch stock data', error: error.message });
  }
});

module.exports = router;