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

```
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

```
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

## 🔗 Key Dependencies

- **Next.js 14** - React framework with App Router
- **Clerk** - Authentication and user management
- **Recharts** - Data visualization components
- **Tailwind CSS** - Utility-first styling

---

**Need help?** Check the architecture documentation or review the inline comments in major files.
