"use client";

import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, size = "default" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    default: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-b-transparent border-finance-primary",
        sizeClasses[size],
        className
      )}
    />
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-[400px] w-full flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function InlineLoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size="default" text={text} />
    </div>
  );
}
