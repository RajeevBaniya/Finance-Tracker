"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/config/stages";
import { useFinancial } from "@/context/financial-context.jsx";

export function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useFinancial();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-white">Currency:</span>
      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((currency) => (
            <SelectItem key={currency.value} value={currency.value}>
              <span className="flex items-center gap-2">
                <span>{currency.symbol}</span>
                <span>{currency.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
