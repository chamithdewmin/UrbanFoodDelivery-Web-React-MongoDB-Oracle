const express = require('express');
const cors = require('cors');
const customerRoutes = require('./routes/customerRoutes');  // Customer routes
const productRoutes = require('./routes/productRoutes');    // Product routes
const orderRoutes = require('./routes/orderRoutes');        // Order routes

const app = express();
const port = 3000;

// Middleware
app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json());  // Parse JSON bodies

// Routes with specific prefixes
app.use('/api/customers', customerRoutes);  // Prefix for customer routes
app.use('/api/products', productRoutes);   // Prefix for product routes
app.use('/api/orders', orderRoutes);       // Prefix for order routes

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
