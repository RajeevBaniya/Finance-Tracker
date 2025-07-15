# FinanceTracker Backend

The backend API server for FinanceTracker built with Node.js, Express, and MongoDB.

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication(Clerk)
- Express Middleware

## Directory Structure

```
server/
├── src/
│   ├── index.js         # Application entry point
│   ├── middleware/      # Custom middleware
│   │   └── auth.js      # Authentication middleware
│   ├── routes/          # API route handlers
│   │   ├── budgets.js   # Budget endpoints
│   │   └── financial-records.js # Transaction endpoints
│   └── schema/          # Mongoose schemas
│       ├── budget.js    # Budget model
│       └── financial-record.js  # Transaction model
```

## Features

### API Endpoints

#### Budgets

- Create new budgets
- Retrieve user budgets
- Update budget details
- Delete budgets
- Get budget statistics

#### Transactions

- Record new transactions
- Get transaction history
- Update transaction details
- Delete transactions
- Get transaction analytics

### Authentication

- JWT-based authentication
- Protected routes
- User data isolation

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Start the server:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

```






```
