const { initializeDB } = require('../db/dbConnection');

async function getProducts(req, res) {
  try {
    const connection = await initializeDB();
    const result = await connection.execute('SELECT * FROM products');
    res.json(result.rows);
    await connection.close();
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
}

module.exports = { getProducts };
