"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/config/stages";
import { Home, Receipt, Target, Menu, X, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState } from "react";

// Navigation items with stage-based visibility
const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    enabled: FEATURES.transactions, // Always enabled in Stage 1+
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: Banknote,
    enabled: FEATURES.transactions,
  },
  {
    title: "Budgets",
    href: "/budgets",
    icon: Target,
    enabled: FEATURES.budgeting, // Enabled in Stage 3+
  },
];

// Desktop Sidebar Component
function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-finance-surface border-r border-finance-border px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-lg xl:text-xl font-semibold text-finance-light text-center">
            Finance Tracker
          </h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navigationItems
              .filter((item) => item.enabled)
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors hover:scale-105",
                        isActive
                          ? "bg-finance-accentBlue text-finance-lightText"
                          : "text-finance-secondaryText hover:text-finance-lightText hover:bg-finance-card"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive
                            ? "text-finance-lightText"
                            : "text-finance-secondaryText group-hover:text-finance-lightText"
                        )}
                      />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

// Mobile Menu Button (extracted for header use)
export function MobileMenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-finance-surface px-6 pb-4">
          <div className="flex h-14 sm:h-16 shrink-0 items-center justify-between">
            <h1 className="text-lg sm:text-xl font-semibold text-finance-light">
              Finance Tracker
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigationItems
                .filter((item) => item.enabled)
                .map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-colors active:scale-95",
                          isActive
                            ? "bg-finance-accentBlue text-finance-lightText"
                            : "text-finance-secondaryText hover:text-finance-lightText hover:bg-finance-card"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            isActive
                              ? "text-finance-lightText"
                              : "text-finance-secondaryText group-hover:text-finance-lightText"
                          )}
                        />
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mobile Sidebar Component (now simplified)
function MobileSidebar() {
  return null; // Mobile functionality moved to MobileMenuButton
}

// Main Layout Component
export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
