# FinanceTracker

FinanceTracker is a full-stack web application for managing personal finances, tracking transactions, and analyzing budgets. It provides users with intuitive tools to monitor spending, set budgets, and gain insights into their financial habits.

## Features

- Add, edit, and delete financial transactions
- Create and manage budgets
- Visualize spending by category and over time
- Responsive, modern UI with error handling
- Insights and comparisons for better financial planning

## Tech Stack

- **Frontend:** Next.js, React, TailwindCSS, shadcn/ui, Recharts, JavaScript
- **Backend:** Node.js, Express, MongoDB

## Project Structure

```
FinanceTracker/
  client/    # Frontend (Next.js)
  server/    # Backend (Express, MongoDB)
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### Setup

#### 1. Clone the repository

```bash
git clone <repo-url>
cd FinanceTracker
```

#### 2. Install dependencies

- For the frontend:
  ```bash
  cd client
  npm install
  ```
- For the backend:
  ```bash
  cd ../server
  npm install
  ```

#### 3. Configure Environment Variables

- Set up your MongoDB connection string in the backend (see `server/README.md`).

#### 4. Run the Application

- Start the backend:
  ```bash
  cd server
  npm start
  ```
- Start the frontend:
  ```bash
  cd ../client
  npm run dev
  ```

The frontend will be available at `http://localhost:3000` by default.

## License

MIT
