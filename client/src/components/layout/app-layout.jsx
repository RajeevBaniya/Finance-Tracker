"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Sidebar, MobileMenuButton } from "./sidebar";
import { FinancialProvider } from "@/context/financial-context.jsx";
import { BudgetProvider } from "@/context/budget-context.jsx";
import { UserProvider } from "@/context/user-context.jsx";
import { clearTokenCache } from "@/lib/api/api-client";
import { useEffect, Suspense, memo, useState } from "react";
import {
  DollarSign,
  PiggyBank,
  TrendingUp,
  ChartBar,
  Globe,
  LineChart,
  Calculator,
  Clock,
  Calendar,
  CircleDollarSign,
  Sparkles,
} from "lucide-react";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Memoize the main content wrapper to prevent unnecessary re-renders
const MainContent = memo(function MainContent({ children }) {
  return (
    <main className="py-4 sm:py-6">
      <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
        <Suspense fallback={<PageLoadingSpinner />}>{children}</Suspense>
      </div>
    </main>
  );
});

export function AppLayout({ children }) {
  const { isSignedIn, isLoaded, user } = useUser();

  // Clear token cache when user changes or signs out
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearTokenCache();
    }
  }, [isSignedIn, isLoaded]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-finance-cardBg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!isSignedIn) {
    return <SignInPage />;
  }

  return (
    <UserProvider>
      <FinancialProvider>
        <BudgetProvider>
          <div className="min-h-screen bg-finance-cardBg">
            <Sidebar />

            {/* Main content area */}
            <div className="lg:pl-64">
              {/* Mobile header */}
              <div className="sticky top-0 z-40 flex h-14 sm:h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-finance-cardBg px-4 shadow-sm lg:hidden">
                <MobileMenuButton />
                <div className="flex-1"></div>
                <UserButton />
              </div>

              {/* Desktop header with user button */}
              <div className="hidden lg:flex lg:items-center lg:justify-end lg:px-6 lg:py-4">
                <UserButton />
              </div>

              {/* Main content with Suspense boundary */}
              <MainContent>{children}</MainContent>
            </div>
          </div>
        </BudgetProvider>
      </FinancialProvider>
    </UserProvider>
  );
}

// Extract sign-in page to separate component for better code organization
const SignInPage = memo(function SignInPage() {
  const [showMobileSignIn, setShowMobileSignIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-finance-dark via-finance-surface to-finance-card flex flex-col relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-finance-dark opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyQTNCNTIiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6TTAgNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        </div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-finance-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 -right-20 w-80 h-80 bg-finance-success/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "8s" }}
        ></div>
        <div
          className="absolute -bottom-40 left-1/3 w-96 h-96 bg-finance-warning/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "10s" }}
        ></div>
      </div>

      {/* Header - Improved responsiveness */}
      <header className="relative z-10 w-full flex justify-between items-center p-4 sm:p-6 lg:p-8">
        <div className="flex items-center">
          <LineChart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mr-2 sm:mr-3" />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-blue-purple bg-clip-text text-transparent">
            FinTrack
          </span>
        </div>

        {/* Sign In button - Only visible on mobile and tablet */}
        <SignInButton mode="modal">
          <button className="lg:hidden bg-gradient-blue-purple hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base">
            Sign In
          </button>
        </SignInButton>
      </header>

      {/* Mobile Sign In Modal */}
      {showMobileSignIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-finance-dark/80 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl space-y-6 border border-gray-200 relative animate-fadeIn">
            <button
              onClick={() => setShowMobileSignIn(false)}
              className="absolute top-4 right-4 text-finance-secondary hover:text-finance-light"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center space-y-3">
              <div className="flex justify-center mb-2">
                <Sparkles className="h-8 w-8 text-finance-primary" />
              </div>
              <h2 className="text-3xl font-bold text-black">Welcome Back</h2>
              <p className="text-gray-600">
                Sign in to continue managing your finances
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <SignInButton mode="modal">
                <button className="w-full bg-gradient-blue-purple hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                  Sign In
                </button>
              </SignInButton>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-finance-border/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-600">
                    New to FinTrack?
                  </span>
                </div>
              </div>

              <SignInButton mode="modal">
                <button className="w-full bg-finance-surface hover:bg-finance-surface/80 text-finance-light font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-finance-border/30 hover:border-finance-border/50">
                  Create Account
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      )}

      {/* Main content - Full width with centered content */}
      <main className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-5 gap-10 items-center">
          {/* Left side - Hero content (3/5 width) */}
          <div className="lg:col-span-3 space-y-8 text-finance-lightText p-4 lg:p-8">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-finance-primary to-finance-success bg-clip-text text-transparent">
                Track Your Finances
              </h1>
              <p className="text-finance-secondary text-xl lg:text-2xl max-w-2xl">
                Your all-in-one solution for personal finance management
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-finance-surface/50 backdrop-blur-sm p-3 rounded-xl border border-finance-border/30 transform transition-all hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-finance-primary/20 p-2 rounded-lg flex-shrink-0">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-finance-primary" />
                  </div>
                  <h3 className="font-semibold text-finance-light text-sm sm:text-base">
                    Smart Budgeting
                  </h3>
                </div>
                <p className="text-finance-secondary text-xs sm:text-sm">
                  Set and track budgets across multiple categories
                </p>
              </div>

              <div className="bg-finance-surface/50 backdrop-blur-sm p-3 rounded-xl border border-finance-border/30 transform transition-all hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-finance-success/20 p-2 rounded-lg flex-shrink-0">
                    <ChartBar className="h-4 w-4 sm:h-5 sm:w-5 text-finance-success" />
                  </div>
                  <h3 className="font-semibold text-finance-light text-sm sm:text-base">
                    Expense Analytics
                  </h3>
                </div>
                <p className="text-finance-secondary text-xs sm:text-sm">
                  Visualize your spending patterns with interactive charts
                </p>
              </div>

              <div className="bg-finance-surface/50 backdrop-blur-sm p-3 rounded-xl border border-finance-border/30 transform transition-all hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-finance-warning/20 p-2 rounded-lg flex-shrink-0">
                    <PiggyBank className="h-4 w-4 sm:h-5 sm:w-5 text-finance-warning" />
                  </div>
                  <h3 className="font-semibold text-finance-light text-sm sm:text-base">
                    Savings Goals
                  </h3>
                </div>
                <p className="text-finance-secondary text-xs sm:text-sm">
                  Track and achieve your financial milestones
                </p>
              </div>

              <div className="bg-finance-surface/50 backdrop-blur-sm p-3 rounded-xl border border-finance-border/30 transform transition-all hover:scale-105">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-finance-primary/20 p-2 rounded-lg flex-shrink-0">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-finance-primary" />
                  </div>
                  <h3 className="font-semibold text-finance-light text-sm sm:text-base">
                    Multi-Currency
                  </h3>
                </div>
                <p className="text-finance-secondary text-xs sm:text-sm">
                  Support for global currencies and exchange rates
                </p>
              </div>
            </div>

            {/* Inspirational Quote */}
            <div className="mt-12 pt-8 border-t border-finance-border/20 max-w-xl">
              <blockquote className="text-finance-secondary italic text-lg">
                "A budget is telling your money where to go instead of wondering
                where it went."
              </blockquote>
            </div>
          </div>

          {/* Right side - Sign In (2/5 width) - Only visible on desktop */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-200 backdrop-blur-lg relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-finance-primary/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-finance-success/10 rounded-full"></div>

              <div className="text-center space-y-3">
                <div className="flex justify-center mb-2">
                  <Sparkles className="h-8 w-8 text-finance-primary" />
                </div>
                <h2 className="text-3xl font-bold text-black">Welcome Back</h2>
                <p className="text-gray-600">
                  Sign in to continue managing your finances
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <SignInButton mode="modal">
                  <button className="w-full bg-gradient-blue-purple hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                    Sign In
                  </button>
                </SignInButton>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-finance-border/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-600">
                      New to FinTrack?
                    </span>
                  </div>
                </div>

                <SignInButton mode="modal">
                  <button className="w-full bg-finance-surface hover:bg-finance-surface/80 text-finance-light font-semibold py-3 px-6 rounded-lg transition-colors duration-200 border border-finance-border/30 hover:border-finance-border/50">
                    Create Account
                  </button>
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});
