//server.js 
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// PostgreSQL connection configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce_db',
  password: 'Joker123#',
  port: 5432,
});

client.connect();

// JWT secret key
const JWT_SECRET = 'your_secret_key_here';

// Register a new user
app.post('/register', async (req, res) => {
    const { email, password, name, phone_number, address } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query(
            'INSERT INTO users (email, password, name, phone_number, address) VALUES ($1, $2, $3, $4, $5)',
            [email, hashedPassword, name, phone_number, address]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login a user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
});
// Fetch products
app.get('/products', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM products');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  });
  

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
