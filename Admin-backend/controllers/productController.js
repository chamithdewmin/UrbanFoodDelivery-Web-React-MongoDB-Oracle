const express = require('express');
const multer = require('multer');
const { initializeDB } = require('../db/dbConnection');

// Set up multer to handle image uploads (store images in memory as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Function to get all products (GET)
async function getProducts(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute('SELECT * FROM products');
    
    // Convert image BLOB to base64 for easier handling in frontend (optional)
    const products = result.rows.map(product => {
      if (product.image) {
        const imageBase64 = product.image.toString('base64');
        product.image = `data:image/jpeg;base64,${imageBase64}`; // Assuming JPEG image
      }
      return product;
    });

    res.status(200).json(products);
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}

// Function to create a new product (POST)
async function createProduct(req, res) {
  const { name, category, price, supplier_id } = req.body;
  const image = req.file;  // multer stores the image as buffer in memory

  // Validate required fields
  if (!name || !price || !supplier_id || !image) {
    return res.status(400).json({ message: 'Name, price, supplier_id, and image are required' });
  }

  try {
    const connection = await initializeDB();

    // Insert new product with image (as BLOB)
    const result = await connection.execute(
      `INSERT INTO products (name, category, price, supplier_id, image) 
      VALUES (:name, :category, :price, :supplier_id, :image)`,
      [name, category, price, supplier_id, image.buffer], // image.buffer stores the binary data
      { autoCommit: true }
    );

    // Check if the insert was successful
    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error creating product' });
    }

    res.status(201).json({ message: 'Product created successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
}

// Function to update a product (PUT)
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, category, price, supplier_id } = req.body;
  const image = req.file;  // multer stores the image as buffer in memory

  // Validate required fields
  if (!name || !price || !supplier_id) {
    return res.status(400).json({ message: 'Name, price, and supplier_id are required' });
  }

  try {
    const connection = await initializeDB();

    // Check if the product exists
    const checkProduct = await connection.execute(
      'SELECT * FROM products WHERE id = :id',
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product in the database (with or without new image)
    const query = image ? 
      `UPDATE products SET name = :name, category = :category, price = :price, supplier_id = :supplier_id, image = :image WHERE id = :id` : 
      `UPDATE products SET name = :name, category = :category, price = :price, supplier_id = :supplier_id WHERE id = :id`;

    const params = image ? 
      [name, category, price, supplier_id, image.buffer, id] :
      [name, category, price, supplier_id, id];

    const result = await connection.execute(query, params, { autoCommit: true });

    // Check if the update was successful
    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error updating product' });
    }

    res.json({ message: 'Product updated successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
}

// Function to delete a product (DELETE)
async function deleteProduct(req, res) {
  const { id } = req.params;

  try {
    const connection = await initializeDB();

    // Check if the product exists
    const checkProduct = await connection.execute(
      'SELECT * FROM products WHERE id = :id',
      [id]
    );

    if (checkProduct.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product from the database
    const result = await connection.execute(
      `DELETE FROM products WHERE id = :id`,
      [id],
      { autoCommit: true }
    );

    // Check if the delete was successful
    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error deleting product' });
    }

    res.json({ message: 'Product deleted successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
}

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
