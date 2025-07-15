import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-blue-purple text-white shadow-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus-visible:ring-blue-500 transition-colors duration-200",
        destructive:
          "bg-finance-danger text-finance-light shadow-sm hover:bg-red-600 focus-visible:ring-finance-danger",
        outline:
          "border border-gray-300 bg-white text-black shadow-sm hover:bg-gray-50 hover:text-black focus-visible:ring-blue-500",
        secondary:
          "bg-finance-surface text-finance-light shadow-sm hover:bg-finance-border focus-visible:ring-finance-primary",
        ghost:
          "hover:bg-finance-surface hover:text-finance-light focus-visible:ring-finance-primary",
        link: "text-finance-primary underline-offset-4 hover:underline focus-visible:ring-finance-primary",
        gradient:
          "bg-gradient-blue-purple text-white shadow-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 focus-visible:ring-blue-500 transition-colors duration-200",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
