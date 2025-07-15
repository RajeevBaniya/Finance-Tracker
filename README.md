# FinanceTracker

A full-stack personal finance management application that helps users track their expenses, manage budgets, and gain insights into their spending patterns.

## Features

- 📊 Budget Management

  - Create and manage monthly budgets
  - Track spending against budget limits
  - Visual budget comparison charts
  - Spending insights and analytics

- 💰 Transaction Tracking

  - Record income and expenses
  - Categorize transactions
  - View transaction history
  - Monthly spending analysis

- 📈 Data Visualization

  - Monthly spending bar charts
  - Category-wise expense breakdown
  - Budget vs actual comparison charts

- 🔐 User Authentication
  - Secure sign-up and sign-in
  - Protected routes and API endpoints

## Project Structure

- `client/` - Next.js frontend application
- `server/` - Node.js backend API

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database

## Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/FinanceTracker.git
   cd FinanceTracker
   ```

2. Set up the backend:

   ```bash
   cd server
   npm install
   # Create .env file with required environment variables
   npm run dev
   ```

3. Set up the frontend:

   ```bash
   cd client
   npm install
   # Create .env file with required environment variables
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
