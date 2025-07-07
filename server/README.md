# FinanceTracker Server

This is the backend for the FinanceTracker application, built with Node.js, Express, and MongoDB. It provides RESTful APIs for managing transactions, budgets, and financial data.

## Features

- RESTful API for transactions and budgets
- MongoDB data storage
- Data validation with Mongoose schemas
- CORS support for frontend integration

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the `server/` directory with the following:
   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   PORT=5000
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Folder Structure

- `src/routes/` - API route handlers
- `src/schema/` - Mongoose schemas

## License

MIT
