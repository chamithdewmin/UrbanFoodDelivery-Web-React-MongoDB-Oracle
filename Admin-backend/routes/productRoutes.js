const express = require('express');
const multer = require('multer');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Set up multer to handle image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());  // Make sure to use this for POST and PUT requests

// Product Routes
router.get('/', getProducts);            // GET /api/products
router.post('/', upload.single('image'), createProduct);  // POST /api/products with image
router.put('/:id', upload.single('image'), updateProduct); // PUT /api/products/:id with image
router.delete('/:id', deleteProduct);   // DELETE /api/products/:id

module.exports = router;
