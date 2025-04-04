import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file

// Simple component to display individual stock data
function StockCard({ symbol, price, changePercent, error }) {
  const changeClass = changePercent >= 0 ? 'positive' : 'negative';
  // Use Number.isFinite to check for valid numbers before formatting
  const displayPrice = Number.isFinite(price) ? `$${price.toFixed(2)}` : 'N/A';
  const displayChange = Number.isFinite(changePercent) ? `${Number(changePercent).toFixed(2)}%` : 'N/A';

  if (error) {
    return (
      <div className="stock-card error">
        <h2>{symbol}</h2>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="stock-card">
      <h2>{symbol}</h2>
      <p className="price">{displayPrice}</p>
      <p className={`change ${changeClass}`}>{displayChange}</p>
    </div>
  );
}

function App() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vite uses import.meta.env for environment variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const fetchStockData = async () => {
    setLoading(true); // Set loading true before fetch
    setError(null); // Clear previous errors
    console.log('Fetching stock data from:', `${backendUrl}/api/stocks`);
    try {
      const response = await fetch(`${backendUrl}/api/stocks`);
      if (!response.ok) {
         const errorBody = await response.text(); // Try to get more error details
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }
      const data = await response.json();
      console.log('Data received:', data);
      // Check if the backend returned an error for specific symbols
      const hasError = data.some(stock => stock.error);
      if (hasError) {
         console.warn("Some stock symbols failed to fetch:", data.filter(s => s.error));
         // We still set the data, the StockCard component will handle displaying errors
      }
      setStockData(data);
    } catch (e) {
      console.error("Failed to fetch stock data:", e);
      setError(`Failed to load data: ${e.message}. Is the backend running at ${backendUrl}?`);
      setStockData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(); // Fetch data on initial load

    const intervalId = setInterval(() => {
      fetchStockData(); // Fetch data every 5 minutes
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [backendUrl]); // Dependency array includes backendUrl

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Dashboard</h1>
      </header>
      <main className="dashboard">
        {loading && <p>Loading stock data...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && stockData.length === 0 && <p>No stock data available.</p>}
        {!loading && stockData.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            price={stock.price}
            changePercent={stock.changePercent}
            error={stock.error} // Pass potential error message
          />
        ))}
      </main>
    </div>
  );
}

export default App;
