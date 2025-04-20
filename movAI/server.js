require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to authenticate token for protected routes
const authenticateToken = (req, res, next) => {
    // Retrieve the Authorization header
    const authenticateHeader = req.headers['authorization'];

    // Extract the token from the Authorization header
    const token = authenticateHeader && authenticateHeader.split(' ')[1];

    // If no token is provided, return 401 Unauthorized
    if (token == null) return res.sendStatus(401);

    // Verify the token using JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // If token is invalid, return 403 Forbidden
        if (err) return res.sendStatus(403);

        // Attach the user info from the token to the request
        req.user = user;

        // Continue to the next middleware or route handler
        next();
    });
};

// Route to handle user signup
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email or username already exists in the database
        const query = 'SELECT * FROM users WHERE email = ? OR username = ?';

        db.get(query, [email, username], async (err, row) => {
            if (err) {
                // Return a 500 error if there's a database issue
                return res.status(500).json({ 
                        msg: 'Database error!' 
                });
            }
            if (row) {
                // Return a 400 error if the username or email already exists
                return res.status(400).json({ 
                    msg: 'Username or email already exists!' 
                });
            }

            try {
                // Hash the user's password before storing
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // Insert the new user into the database
                const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

                db.run(query, [username, email, hashedPassword], (err) => {
                    if (err) {
                        // Return a 500 error if there's an issue saving the user
                        return res.status(500).json({ 
                            msg: 'Error saving user!' 
                        });
                    }

                    // Return a success message if the user is created
                    return res.status(201).json({ 
                        msg: 'User created successfully!' 
                    });
                });
            } catch (hashError) {
                // Return a 500 error if password hashing fails
                return res.status(500).json({ 
                    msg: 'Error processing request!' 
                });
            }
        });
    } catch (err) {
        // Return a 500 error for any server-side issues
        return res.status(500).json({ 
            msg: 'Server error!' 
        });
    }
});

// Route to handle user login
app.post('/api/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {
        // Check if the username or email exists in the database
        const query = 'SELECT * FROM users WHERE email = ? OR username = ?';

        db.get(query, [usernameOrEmail, usernameOrEmail], async (err, row) => {
            if (err) {
                // Return a 500 error if there's a database issue
                return res.status(500).json({ 
                    msg: 'Database error!' 
                });
            }
            if (!row) {
                // Return a 400 error if the user doesn't exist
                return res.status(400).json({ 
                    msg: 'Invalid credentials!' 
                });
            }

            // Compare the provided password with the stored hashed password
            const isMatch = await bcrypt.compare(password, row.password);
            if (!isMatch) {
                // Return a 400 error if the passwords don't match
                return res.status(400).json({ 
                    msg: 'Invalid credentials!' 
                });
            }

            // Create a JWT token for the authenticated user
            const payload = { user: { user_id: row.user_id, username: row.username } };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

            // Return the token and user ID to the client
            return res.json({ 
                token, user_id: row.user_id 
            });
        });
    } catch (err) {
        // Return a 500 error for any server-side issues
        return res.status(500).json({ 
            msg: 'Server error!' 
        });
    }
});

// Route to fetch user data based on user ID
app.get('/api/user/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;

    try {
        // Query to get the username based on user ID
        const query = `SELECT username FROM users WHERE user_id = ?`;
        db.get(query, [userId], (err, row) => {
            if (err) {
                // Return a 500 error if there's a database issue
                return res.status(500).json({ 
                    error: 'Failed to retrieve user data!' 
                });
            } else if (!row) {
                // Return a 404 error if the user is not found
                return res.status(404).json({ 
                    error: 'User not found!' 
                });
            } else {
                // Return the username if the user is found
                return res.status(200).json({ 
                    username: row.username 
                });
            }
        });
    } catch (err) {
        // Return a 500 error for any server-side issues
        return res.status(500).json({ 
            msg: 'Server error!' 
        });
    }
});

// Route to add a movie to the user's watchlist
app.post('/api/watchlist', authenticateToken, (req, res) => {
    const { userId, movieId, title, posterPath } = req.body;

    try {
        // Query to insert a movie into the user's watchlist
        const query = `
            INSERT INTO watchlist (user_id, movie_id, title, poster_path)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id, movie_id) DO NOTHING;
        `;

        db.run(query, [userId, movieId, title, posterPath], function(err) {
            if (err) {
                // Return a 500 error if there's an issue adding the movie
                return res.status(500).json({ 
                    error: 'Failed to add movie to watchlist!' 
                });
            } else {
                // Return a success message if the movie is added
                return res.status(200).json({ 
                    message: 'Movie added to watchlist!' 
                });
            }
        });
    } catch (err) {
        // Return a 500 error for any server-side issues
        return res.status(500).json({ 
            msg: 'Server error!' 
        });
    }
});

// Route to fetch the user's watchlist
app.get('/api/watchlist', authenticateToken, (req, res) => {
    const { userId } = req.query;
    try {
        // Query to fetch all movies in the user's watchlist
        const query = 'SELECT * FROM watchlist WHERE user_id = ?';
        db.all(query, [userId], (err, rows) => {
            if (err) {
                // Return a 500 error if there's an issue fetching the watchlist
                return res.status(500).json({ 
                    error: 'Failed to fetch watchlist!' 
                });
            } else {
                // Return the watchlist movies to the client
                return res.status(200).json(rows);
            }
        });
    } catch (err) {
        // Return a 500 error for any server-side issues
        return res.status(500).json({ 
            msg: 'Server error!' 
        });
    }
});

// Route to remove a movie from the user's watchlist
app.delete('/api/watchlist', authenticateToken, (req, res) => {
    const { userId, movieId } = req.body;

    try {
        // Query to remove a movie from the watchlist
        const query = `DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?`;

        db.run(query, [userId, movieId], function(err) {
            if (err) {
                // Return a 500 error if there's an issue removing the movie
                return res.status(500).json({ 
                    error: 'Failed to remove movie from watchlist!' 
                });
            } else if (this.changes === 0) {
                // Return a 404 error if the movie isn't in the watchlist
                return res.status(404).json({ 
                    error: 'Movie not found in watchlist!' 
                });
            } else {
                // Return a success message if the movie is removed
                return res.status(200).json({ 
                    message: 'Movie removed from watchlist!' 
                });
            }
        });
    } catch (err) {
        // Return a 500 error for any server-side issues
        return res.status(500).json({ 
            msg: 'Server error!' 
        });
    }
});

// Start the server on the port defined in the environment variables
const port = process.env.PORT;
app.listen(port, () => console.log(`Server started on port ${port}!`));
