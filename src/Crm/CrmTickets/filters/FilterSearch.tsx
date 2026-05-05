"use client";

import { Search } from "lucide-react";

interface FilterSearchProps {
  onChange: (value: string) => void;
}

export function FilterSearch({ onChange }: FilterSearchProps) {
  return (
    <div className="relative shrink-0">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar ticket..."
        onChange={(e) => onChange(e.target.value)}
        className="h-7 pl-6 pr-2 w-40 text-xs border border-gray-200 rounded bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
      />
    </div>
  );
}
