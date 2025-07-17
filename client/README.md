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

## 🔄 Understanding the Data Flow

### How Data Moves Through the App

```
1. Server API → 2. API Client → 3. Data Hook → 4. Context → 5. Components
```

### Financial Data Example

```javascript
// 1. Server returns raw data
GET /financial-records → [{date, amount, category, ...}]

// 2. API client handles the HTTP call
financial-api.js → getAll()

// 3. Data hook manages CRUD operations
use-financial-data.js → {allRecords, loading, addRecord, ...}

// 4. Context filters and calculates
financial-context.jsx → {records (filtered), totalIncome, ...}

// 5. Components display the data
transaction-list.jsx → Shows filtered transactions
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

### Debugging Data Issues

**Check these in order:**

1. **Server API** - Is data being returned?
2. **API Client** - Check network tab for API calls
3. **Data Hook** - Check `allRecords` in React DevTools
4. **Context** - Check filtered `records` and calculations
5. **Component** - Check what data the component receives

### Adding Month/Currency Filtering

Use the centralized filters in `/lib/filters.js`:

```javascript
import { filterRecords, filterBudgets } from "@/lib/filters";

// Filter financial records
const filteredRecords = filterRecords(allRecords, currency, month, year);

// Filter budgets
const filteredBudgets = filterBudgets(allBudgets, currency, month, year);
```

## 🎯 Best Practices

### Do ✅

- Use existing contexts via hooks (`useFinancial`, `useBudget`)
- Add filtering logic to `/lib/filters.js`
- Follow the established data flow pattern
- Add documentation for complex logic

### Don't ❌

- Fetch data directly in components
- Duplicate filtering logic across files
- Mix UI logic with business logic
- Create new contexts without clear need

## 🐛 Troubleshooting

### Data Not Updating

1. Check if month/currency filters are applied correctly
2. Verify the context provides the expected data structure
3. Check React DevTools for context values

### Performance Issues

1. Check for unnecessary re-renders in React DevTools
2. Verify memoization is working in contexts
3. Look for expensive calculations in render loops

### Month Filtering Not Working

1. Verify `selectedMonth` and `selectedYear` in Financial Context
2. Check if component is using month-filtered `records`
3. Ensure date comparisons use consistent formats (0-11 for months)

## 📚 Related Files

- **Architecture Overview**: `/ARCHITECTURE.md`
- **Server Documentation**: `/server/README.md`
- **API Documentation**: Check individual API files in `/lib/api/`

## 🔗 Key Dependencies

- **Next.js 14** - React framework with App Router
- **Clerk** - Authentication and user management
- **Recharts** - Data visualization components
- **Tailwind CSS** - Utility-first styling

---

**Need help?** Check the architecture documentation or review the inline comments in major files.
