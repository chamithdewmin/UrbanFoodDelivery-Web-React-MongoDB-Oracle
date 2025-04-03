const express = require('express');
const { getCustomers } = require('../controllers/customerController');

const router = express.Router();

router.get('/customers', getCustomers);

module.exports = router;
