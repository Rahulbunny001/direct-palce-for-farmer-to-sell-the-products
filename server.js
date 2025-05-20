// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Your MySQL password
    database: 'farmer_market' // Your database name
});

// Connect to the MySQL database
connection.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Register route
app.post('/api/register', (req, res) => {
    const { username, fullName, email, password } = req.body;
    console.log('Registration request received:', req.body); // Log request data

    // Check if username already exists
    const checkUserQuery = 'SELECT * FROM customers WHERE username = ?';
    connection.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error('Database error (checking username):', err); // More specific error logging
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        // Hash the password before storing it
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error('Hashing error:', err); // More specific error logging
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            // Insert new user into the database
            const insertQuery = 'INSERT INTO customers (username, full_Name, email, password) VALUES (?, ?, ?, ?)';
            connection.query(insertQuery, [username, fullName, email, hash], (err, results) => {
                if (err) {
                    console.error('Database error (inserting user):', err); // More specific error logging
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: 'Email already exists' });
                    }
                    return res.status(500).json({ message: 'Failed to register customer' });
                }
                res.status(201).json({ message: 'Customer registered successfully', customerId: results.insertId });
            });
        });
    });
});

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received:', req.body); // Log request data

    // Check if the user exists
    const checkUserQuery = 'SELECT * FROM customers WHERE username = ?';
    connection.query(checkUserQuery, [username], (err, results) => {
        if (err) {
            console.error('Database error (checking username):', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // If user not found
        if (results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        // Compare the hashed password
        const user = results[0]; // Get the user from the results
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (!match) {
                return res.status(400).json({ success: false, message: 'Invalid username or password' });
            }

            // If the username and password match
            res.status(200).json({ success: true, message: 'Login successful' });
        });
    });
});


// Start your server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});