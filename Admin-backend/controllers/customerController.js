const { initializeDB } = require('../db/dbConnection');

// Function to get all customers (GET)
async function getCustomers(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute('SELECT * FROM customers');
    res.json(result.rows);  // Send customers as JSON response
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
}

// Function to create a new customer (POST)
async function createCustomer(req, res) {
  const { name, email, phone, address } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const connection = await initializeDB();
    const result = await connection.execute(
      `INSERT INTO customers (name, email, phone, address) 
      VALUES (:name, :email, :phone, :address)`,
      [name, email, phone, address],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error creating customer' });
    }

    res.status(201).json({ message: 'Customer created successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
}

// Function to update a customer (PUT)
async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const connection = await initializeDB();

    // Check if the customer exists
    const checkCustomer = await connection.execute(
      'SELECT * FROM customers WHERE id = :id',
      [id]
    );

    if (checkCustomer.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update customer in the database
    const result = await connection.execute(
      `UPDATE customers 
      SET name = :name, email = :email, phone = :phone, address = :address 
      WHERE id = :id`,
      [name, email, phone, address, id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error updating customer' });
    }

    res.json({ message: 'Customer updated successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
}

// Function to delete a customer (DELETE)
async function deleteCustomer(req, res) {
  const { id } = req.params;

  try {
    const connection = await initializeDB();

    // Check if the customer exists
    const checkCustomer = await connection.execute(
      'SELECT * FROM customers WHERE id = :id',
      [id]
    );

    if (checkCustomer.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Delete customer from the database
    const result = await connection.execute(
      `DELETE FROM customers WHERE id = :id`,
      [id],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(500).json({ message: 'Error deleting customer' });
    }

    res.json({ message: 'Customer deleted successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
}

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
