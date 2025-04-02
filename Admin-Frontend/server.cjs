const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'foodie'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.post('/add-item', (req, res) => {
    const { name, description, category, price, image } = req.body;
    const sql = 'INSERT INTO items (name, description, category, price, image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, category, price, image], (err, result) => {
        if (err) throw err;
        res.send('Item added successfully');
    });
});

app.get('/items', (req, res) => {
    const sql = 'SELECT * FROM items';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.delete('/delete-item/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM items WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send('Item deleted successfully');
    });
});

app.put('/update-item/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, image } = req.body;
    const sql = 'UPDATE items SET name = ?, description = ?, category = ?, price = ?, image = ? WHERE id = ?';
    db.query(sql, [name, description, category, price, image, id], (err, result) => {
        if (err) throw err;
        res.send('Item updated successfully');
    });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});


app.get('/orders', (req, res) => {
    const sql = 'SELECT * FROM orders';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/add-order', (req, res) => {
    const { customer, items, status } = req.body;
    const sql = 'INSERT INTO orders (customer, items, status) VALUES (?, ?, ?)';
    db.query(sql, [customer, items, status], (err, result) => {
        if (err) throw err;
        res.send('Order added successfully');
    });
});

app.put('/update-order/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
        if (err) throw err;
        res.send('Order updated successfully');
    });
});
