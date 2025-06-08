# URL Shortener

A simple URL shortener application built with React (frontend), Node.js + Express (backend), and MySQL (database).

---

## Features

- Shorten long URLs to easy-to-share short links
- Redirect short URLs to the original URLs
- View all shortened URLs with their original links
- Responsive and user-friendly UI

---

## Tech Stack

- Frontend: React
- Backend: Node.js, Express.js
- Database: MySQL
- Others: CORS, MySQL2 Node package

---

## Demo Video

Watch the demo of this project here:  
[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://youtu.be/YOUR_VIDEO_ID)

*(Click the image to watch the demo)*

---

## Installation & Setup

1. Clone the repo:

   ```
   git clone https://github.com/<your-username>/<repo-name>.git
   ```
2. Install backend dependencies and start server:

   ```
   cd server
   npm install
   node server.js
   ```
3. Install frontend dependencies and start React app:

   ```
   cd ../client
   npm install
   npm start
   ```
4. Open http://localhost:3000 in your browser.

## Database Setup
Create a MySQL database and run this SQL to create the urls table:
```
CREATE TABLE urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  short_id VARCHAR(10) NOT NULL UNIQUE,
  original_url TEXT NOT NULL
);
```
Update your MySQL credentials in server/server.js.

## Usage

-Enter a URL in the input field and click Shorten.
-View your shortened URL and all previously shortened URLs.
-Click on a short link to be redirected to the original URL.

## Demo Video

Watch the demo here: [Demo Video](https://drive.google.com/file/d/1kmHvtNUibMHw5VOQroGcyLC-NX02kMFz/view?usp=sharing)
