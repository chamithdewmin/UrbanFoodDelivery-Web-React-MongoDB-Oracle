const { initializeDB } = require('../db/dbConnection');

async function getCustomers(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute('SELECT * FROM customers');
    res.json(result.rows);
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
}

module.exports = { getCustomers };
