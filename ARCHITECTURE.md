# FinanceTracker Architecture Documentation

## 📊 Data Flow Overview

### Financial Data Flow

```
Server (financial-records.js)
  ↓ HTTP API calls
API Client (financial-api.js) - Handles authentication & HTTP requests
  ↓ Raw financial records
Hook (use-financial-data.js) - Fetches & manages CRUD operations
  ↓ All records array
Context (financial-context.jsx) - Filters by currency + month + state management
  ↓ Filtered records + calculations
Hook (use-financial-calculations.js) - Computes totals, insights, trends
  ↓ Calculated values
Components (transaction-form, transaction-list, dashboard) - Display & interaction
```

### Budget Data Flow

```
Server (budgets.js)
  ↓ HTTP API calls
API Client (budget-api.js) - Handles authentication & HTTP requests
  ↓ Raw budget records
Hook (use-budget-data.js) - Fetches & manages CRUD operations
  ↓ All budgets array
Context (budget-context.jsx) - Filters by currency + month, depends on financial context
  ↓ Filtered budgets + comparisons
Hook (use-budget-calculations.js) - Computes budget vs actual, insights
  ↓ Budget analysis data
Components (budget-form, budget-list, budget-comparison-chart) - Display & interaction
```

## 🏗️ Current Architecture

### Server Side (`/server`)

```
server/
├── src/
│   ├── index.js              # Express server setup
│   ├── middleware/
│   │   └── auth.js           # Clerk authentication middleware
│   ├── routes/
│   │   ├── financial-records.js  # CRUD endpoints for transactions
│   │   └── budgets.js            # CRUD endpoints for budgets
│   └── schema/
│       ├── financial-record.js   # MongoDB schema for transactions
│       └── budget.js             # MongoDB schema for budgets
```

### Client Side (`/client`)

```
client/src/
├── app/                      # Next.js app router pages
│   ├── page.jsx             # Dashboard page
│   ├── transactions/page.jsx # Transactions page
│   ├── budgets/page.jsx     # Budgets page
│   └── layout.jsx           # Root layout with providers
├── components/              # UI components
│   ├── budgets/            # Budget-specific components
│   ├── charts/             # Chart components
│   ├── layout/             # Layout components (sidebar, etc.)
│   ├── transactions/       # Transaction-specific components
│   └── ui/                 # Reusable UI components
├── context/                # React contexts for state management
│   ├── financial-context.jsx  # Main financial state management
│   ├── budget-context.jsx     # Budget state management
│   └── user-context.jsx       # User authentication state
├── hooks/                  # Custom React hooks
│   ├── use-financial-data.js        # Financial CRUD operations
│   ├── use-financial-calculations.js # Financial computations
│   ├── use-budget-data.js           # Budget CRUD operations
│   └── use-budget-calculations.js   # Budget computations
├── lib/                    # Utility libraries
│   ├── api/               # API client functions
│   ├── data-utils.js      # Data transformation utilities
│   └── utils.js           # General utilities
└── config/
    └── stages.js          # Configuration constants
```

## 🔄 State Management Flow

### Financial Context Responsibilities

- **Month/Year Selection**: Manages selectedMonth, selectedYear state
- **Currency Selection**: Manages selectedCurrency state
- **Data Filtering**: Filters records by currency + month + year
- **Auto Month Transition**: Automatically updates to current month
- **Manual Selection Tracking**: Tracks user manual month changes
- **Calculation Coordination**: Passes filtered data to calculation hooks

### Budget Context Responsibilities

- **Category Selection**: Manages selectedCategory for budget analysis
- **Budget Filtering**: Filters budgets by currency + month + year
- **Financial Dependency**: Consumes financial context for transaction data
- **Budget Analysis**: Coordinates budget vs actual calculations

## 🗃️ Database Schema

### Financial Records

```javascript
{
  _id: ObjectId,
  userId: String,        # Clerk user ID
  date: Date,           # Transaction date
  description: String,   # Transaction description
  amount: Number,       # Positive for income, negative for expenses
  category: String,     # Transaction category
  paymentMethod: String, # Payment method used
  currency: String,     # Currency code (USD, EUR, etc.)
  fromAccount: String,  # Source account (optional)
  toAccount: String,    # Destination account (optional)
  createdAt: Date,
  updatedAt: Date
}
```

### Budgets

```javascript
{
  _id: ObjectId,
  userId: String,       # Clerk user ID
  category: String,     # Budget category
  amount: Number,       # Budget amount (always positive)
  month: Number,        # Month (1-12)
  year: Number,         # Year (2024, 2025, etc.)
  currency: String,     # Currency code
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Financial Records API

- `GET /financial-records` - Get all user's financial records
- `POST /financial-records` - Create new financial record
- `PUT /financial-records/:id` - Update financial record
- `DELETE /financial-records/:id` - Delete financial record

### Budgets API

- `GET /budgets` - Get all user's budgets
- `POST /budgets` - Create new budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget

## 🎯 Key Features

### Month-wise Data Filtering

- All data is filtered by selected month/year on client side
- Automatic month transition on date change
- Manual month selection with 24h reset for auto-updates

### Currency Support

- Multi-currency transactions and budgets
- Currency-specific filtering and calculations
- Global currency selector

### Budget Management

- Monthly budgets per category
- Budget vs actual spending comparison
- Available funds validation for budget creation
- Budget insights and spending analysis

## 🔧 Current Pain Points

### Complex Data Flow

- Data passes through 4-5 layers (Server → API → Hook → Context → Component)
- Hard to trace where data comes from and how it's transformed

### Mixed Responsibilities

- Contexts handle multiple concerns (state, filtering, calculations, API coordination)
- Hooks sometimes duplicate logic between financial and budget calculations

### Scattered Logic

- Month filtering logic exists in multiple places
- Business rules spread across contexts, hooks, and utilities
- Similar calculations in different files

### Implicit Dependencies

- Budget context depends on financial context
- Components don't clearly declare their data dependencies
- Hard to understand what triggers re-renders

## 🚀 Improvement Opportunities

### 1. Extract Pure Functions

Move data transformations to utility functions for better testability

### 2. Simplify Context Responsibilities

Split large contexts into focused, single-responsibility contexts

### 3. Create Facade Hooks

Provide simplified, component-friendly APIs that hide complexity

### 4. Add Type Safety

Define clear interfaces for data structures and API responses

### 5. Improve File Organization

Group related files by feature rather than technical layer
