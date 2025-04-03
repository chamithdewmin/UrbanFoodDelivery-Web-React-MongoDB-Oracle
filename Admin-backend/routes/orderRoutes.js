const express = require('express');
const {
  placeOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

const router = express.Router();

// Order Routes
router.post('/', placeOrder);  // POST /api/orders
router.get('/', getOrders);    // GET /api/orders
router.put('/:id', updateOrderStatus);  // PUT /api/orders/:id
router.delete('/:id', deleteOrder);    // DELETE /api/orders/:id

module.exports = router;
