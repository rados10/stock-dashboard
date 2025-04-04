const axios = require('axios');

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

if (!FINNHUB_API_KEY) {
  console.error('Error: FINNHUB_API_KEY environment variable not set.');
  // Optionally, throw an error to prevent the app from starting without a key
  // throw new Error('FINNHUB_API_KEY environment variable not set.');
}

/**
 * Fetches live quote data for given stock symbols from Finnhub.
 * @param {string[]} symbols - Array of stock symbols (e.g., ['AAPL', 'GOOGL'])
 * @returns {Promise<object[]>} - Array of objects with { symbol, price, changePercent }
 */
async function getLiveStockData(symbols) {
  if (!FINNHUB_API_KEY) {
    throw new Error('Finnhub API key is missing. Please set the FINNHUB_API_KEY environment variable.');
  }
  if (!symbols || symbols.length === 0) {
    return [];
  }

  const promises = symbols.map(async (symbol) => {
    try {
      const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
        params: {
          symbol: symbol,
          token: FINNHUB_API_KEY,
        },
      });

      const quote = response.data;
      const currentPrice = quote.c;
      const prevClose = quote.pc;
      let changePercent = 0;

      // Calculate percentage change, handle potential division by zero
      if (prevClose && prevClose !== 0) {
        changePercent = ((currentPrice - prevClose) / prevClose) * 100;
      }

      return {
        symbol: symbol,
        price: currentPrice,
        changePercent: changePercent.toFixed(2), // Format to 2 decimal places
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error.response ? error.response.data : error.message);
      // Return null or a specific error object for this symbol
      return { symbol: symbol, price: null, changePercent: null, error: `Failed to fetch data for ${symbol}` };
    }
  });

  // Wait for all API calls to complete
  const results = await Promise.all(promises);
  // Filter out any results that might have failed completely, though the current logic returns an error object
  return results; //.filter(result => result !== null);
}

module.exports = {
  getLiveStockData,
};