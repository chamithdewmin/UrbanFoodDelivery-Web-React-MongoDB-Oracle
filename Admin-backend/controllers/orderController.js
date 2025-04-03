const { initializeDB } = require('../db/dbConnection');

// Function to place an order (POST)
async function placeOrder(req, res) {
  const { customer_id, total_amount, status } = req.body;
  try {
    const connection = await initializeDB();
    await connection.execute(
      `INSERT INTO orders (customer_id, total_amount, status) VALUES (:customer_id, :total_amount, :status)`,
      [customer_id, total_amount, status],
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Order placed successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
}

// Function to get all orders (GET)
async function getOrders(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute('SELECT * FROM orders');
    res.status(200).json(result.rows);
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
}

// Function to update order status (PUT)
async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const connection = await initializeDB();
    await connection.execute(
      `UPDATE orders SET status = :status WHERE id = :id`,
      [status, id],
      { autoCommit: true }
    );
    res.json({ message: 'Order status updated successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
}

// Function to delete an order (DELETE)
async function deleteOrder(req, res) {
  const { id } = req.params;
  try {
    const connection = await initializeDB();
    await connection.execute(
      `DELETE FROM orders WHERE id = :id`,
      [id],
      { autoCommit: true }
    );
    res.json({ message: 'Order deleted successfully' });
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
}

module.exports = { placeOrder, getOrders, updateOrderStatus, deleteOrder };
