# FinanceTracker Client

A Next.js application for personal finance management with transaction tracking, budgeting, and financial insights.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
client/src/
├── app/                    # Next.js App Router pages
├── components/             # UI components organized by feature
├── context/               # React contexts for state management
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and API clients
└── config/                # Configuration files
```

## 🏗️ Key Concepts

### State Management Pattern

**Financial Context** (Main State)

- Manages month/year selection
- Handles currency filtering
- Provides calculated values

**Budget Context** (Dependent State)

- Depends on Financial Context
- Manages budget-specific state
- Provides budget analysis

### Data Filtering Strategy

All data is filtered in **two stages**:

1. **Context Level**: By currency + selected month/year
2. **Hook Level**: Calculations and analysis

```javascript
// Raw data → Currency filter → Month filter → Calculations
allRecords → currencyRecords → monthRecords → calculations
```

### Month-wise Features

The app automatically handles month transitions:

- **Default**: Shows current month data
- **Manual Selection**: User can pick any month
- **Auto Update**: Switches to new month at midnight

## 📂 File Responsibilities

### Contexts (`/context`)

**financial-context.jsx**

```javascript
// What it does:
✅ Month/year selection state
✅ Currency selection and persistence
✅ Filters records by month + currency
✅ Provides calculated totals

// How to use:
const { records, totalIncome, selectedMonth } = useFinancial();
```

**budget-context.jsx**

```javascript
// What it does:
✅ Budget category selection
✅ Budget vs actual comparisons
✅ Budget CRUD operations

// Dependencies:
❗ Requires Financial Context for transaction data

// How to use:
const { budgets, budgetComparison } = useBudget();
```

### Hooks (`/hooks`)

**use-financial-data.js**

```javascript
// Purpose: Raw data fetching and CRUD
// Returns: allRecords, loading, addRecord, updateRecord, deleteRecord
```

**use-financial-calculations.js**

```javascript
// Purpose: Calculate totals, insights, trends
// Input: filtered records + month/year
// Returns: totalAmount, totalIncome, categoryData, etc.
```

### Components (`/components`)

**Feature-based Organization:**

- `transactions/` - Transaction form and list
- `budgets/` - Budget management components
- `charts/` - Data visualization components
- `ui/` - Reusable UI components

## 🔧 Common Tasks

### Adding a New Financial Feature

1. **Add data logic** in `use-financial-calculations.js`
2. **Update context** in `financial-context.jsx` if needed
3. **Create component** in appropriate feature folder
4. **Use the data** via `useFinancial()` hook

### Adding a New Budget Feature

1. **Add logic** in `use-budget-calculations.js`
2. **Update context** in `budget-context.jsx` if needed
3. **Create component** in `budgets/` folder
4. **Use the data** via `useBudget()` hook
