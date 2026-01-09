require("dotenv").config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so React frontend (localhost:3000) can talk to backend (localhost:5000)
app.use(cors());

// Parse JSON body
app.use(express.json());

const url = require('url');

// Parse the Railway DATABASE_URL
const dbUrl = url.parse(process.env.DATABASE_URL);
const [user, password] = dbUrl.auth.split(':');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});


// Helper function to generate short IDs (6 chars alphanumeric)
function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}

// POST /shorten - Create a new shortened URL
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.original_url;

  if (!originalUrl) {
    return res.status(400).json({ error: 'original_url is required' });
  }

  const shortId = generateShortId();

  const query = 'INSERT INTO urls (short_id, original_url) VALUES (?, ?)';

  db.query(query, [shortId, originalUrl], (err, result) => {
    if (err) {
      console.error('Error inserting into DB:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    res.json({ short_url: `http://localhost:${PORT}/${shortId}` });
  });
});

// GET /urls - Get all shortened URLs
app.get('/urls', (req, res) => {
  const query = 'SELECT short_id, original_url FROM urls ORDER BY id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching URLs:', err);
      return res.status(500).json({ error: 'Database fetch failed' });
    }

    res.json(results);
  });
});

// Redirect short URL to original URL
app.get('/:shortId', (req, res) => {
  const shortId = req.params.shortId;

  const query = 'SELECT original_url FROM urls WHERE short_id = ? LIMIT 1';

  db.query(query, [shortId], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(404).send('URL not found');
    }

    res.redirect(results[0].original_url);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
