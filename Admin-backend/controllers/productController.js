const { initializeDB } = require('../db/dbConnection');

// Function to get all products (GET)
async function getProducts(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute('SELECT * FROM products');
    res.status(200).json(result.rows);
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}

// Function to create a new product (POST)
async function createProduct(req, res) {
  const { name, category, price, supplier_id } = req.body;

  // Validate required fields
  if (!name || !price || !supplier_id) {
    return res.status(400).json({ message: 'Name, price, and supplier_id are required' });
  }

  try {
    const connection = await initializeDB();
    // Insert new product into the database
    const result = await connection.execute(
      `INSERT INTO products (name, category, price, supplier_id) 
      VALUES (:name, :category, :price, :supplier_id)`,
      [name, category, price, supplier_id],
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

    // Update product in the database
    const result = await connection.execute(
      `UPDATE products 
      SET name = :name, category = :category, price = :price, supplier_id = :supplier_id 
      WHERE id = :id`,
      [name, category, price, supplier_id, id],
      { autoCommit: true }
    );

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
