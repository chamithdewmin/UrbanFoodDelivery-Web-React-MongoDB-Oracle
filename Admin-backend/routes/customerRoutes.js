const express = require('express');
const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

const router = express.Router();

// Customer Routes
router.get('/customers', getCustomers);            // GET /api/customers
router.post('/customers', createCustomer);         // POST /api/customers
router.put('/customers/:id', updateCustomer);      // PUT /api/customers/:id
router.delete('/customers/:id', deleteCustomer);   // DELETE /api/customers/:id

module.exports = router;
