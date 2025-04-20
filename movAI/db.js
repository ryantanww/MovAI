const sqlite3 = require('sqlite3').verbose();

// Initialize the SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        // Log error if database connection fails
        console.error('Error opening database:', err.message);
    } else {
        // Log success message when database connection is established
        console.log('Connected to the SQLite database.');
        
        // Create the 'users' table if it doesn't exist
        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE, 
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL 
            );`, (err) => {
                if (err) {
                    // Log error if 'users' table creation fails
                    console.error('Error creating users table:', err.message);
                } else {
                    // Log success message when 'users' table is created
                    console.log('User table created successfully!');
                }
            }
        );

        // Create the 'watchlist' table if it doesn't exist
        db.run(
            `CREATE TABLE IF NOT EXISTS watchlist (
                watchlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                movie_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                poster_path TEXT,
                UNIQUE(user_id, movie_id), 
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );`, (err) => {
                if (err) {
                    // Log error if 'watchlist' table creation fails
                    console.error('Error creating watchlist table:', err.message);
                } else {
                    // Log success message when 'watchlist' table is created
                    console.log('Watchlist table created successfully!');
                }
            }
        );
    }
});

module.exports = db;
