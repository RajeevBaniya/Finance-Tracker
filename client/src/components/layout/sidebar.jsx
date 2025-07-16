"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FEATURES } from "@/config/stages";
import {
  Home,
  Receipt,
  Target,
  Menu,
  X,
  Banknote,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useState } from "react";

// Memoize navigation items to prevent unnecessary re-renders
const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    enabled: FEATURES.transactions,
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
    enabled: FEATURES.budgeting,
  },
];

// Optimized navigation link component
function NavLink({ href, icon: Icon, title, isActive, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 hover:scale-105",
        isActive
          ? "bg-gradient-blue-purple text-finance-lightText"
          : "text-finance-secondaryText hover:text-finance-lightText hover:bg-gradient-blue-purple"
      )}
      prefetch={true}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors",
          isActive
            ? "text-finance-lightText"
            : "text-finance-secondaryText group-hover:text-finance-lightText"
        )}
      />
      {title}
    </Link>
  );
}

// Desktop Sidebar Component
function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-finance-surface border-r border-finance-border px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-2">
          <LineChart className="h-5 w-5 xl:h-6 xl:w-6 text-blue-400" />
          <h1 className="text-lg xl:text-xl font-semibold bg-gradient-blue-purple bg-clip-text text-transparent">
            FinTrack
          </h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2">
            {navigationItems
              .filter((item) => item.enabled)
              .map((item) => (
                <li key={item.title}>
                  <NavLink
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    isActive={pathname === item.href}
                  />
                </li>
              ))}
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
          <SheetDescription className="sr-only">
            Navigation menu for FinanceTracker application
          </SheetDescription>
        </SheetHeader>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-finance-surface px-6 pb-4">
          <div className="flex h-14 sm:h-16 shrink-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              <h1 className="text-lg sm:text-xl font-semibold bg-gradient-blue-purple bg-clip-text text-transparent">
                FinTrack
              </h1>
            </div>
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
                            ? "bg-gradient-blue-purple text-finance-lightText"
                            : "text-finance-secondaryText hover:text-finance-lightText hover:bg-gradient-blue-purple"
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
