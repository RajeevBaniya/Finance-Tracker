"use client";

import { Sidebar, MobileMenuButton } from "./sidebar";
import { FinancialProvider } from "@/context/financial-context.jsx";
import { BudgetProvider } from "@/context/budget-context.jsx";

export function AppLayout({ children }) {
  return (
    <FinancialProvider>
      <BudgetProvider>
        <div className="min-h-screen bg-finance-cardBg">
          <Sidebar />

          {/* Main content area */}
          <div className="lg:pl-64">
            {/* Mobile header */}
            <div className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-finance-cardBg px-4 shadow-sm lg:hidden">
              <MobileMenuButton />
              <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
                Finance Tracker
              </div>
            </div>

            {/* Main content */}
            <main className="py-4 sm:py-6">
              <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </BudgetProvider>
    </FinancialProvider>
  );
}
