import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-finance-light placeholder:text-finance-secondary selection:bg-finance-primary selection:text-finance-light border-finance-border flex h-9 w-full min-w-0 rounded-md border bg-finance-dark px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-finance-light",
        "focus-visible:border-finance-primary focus-visible:ring-2 focus-visible:ring-finance-primary/20",
        "aria-invalid:ring-finance-danger/20 aria-invalid:border-finance-danger",
        className
      )}
      {...props}
    />
  );
}

export { Input };
