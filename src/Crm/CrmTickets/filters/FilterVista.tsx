"use client";

import { Filter } from "lucide-react";

interface FilterVistaProps {
  onChange: (value: string) => void;
}

const VISTA_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "assignedToMe", label: "Asignados a mí" },
  { value: "createdByMe", label: "Creados por mí" },
] as const;

export function FilterVista({ onChange }: FilterVistaProps) {
  return (
    <div className="relative shrink-0">
      <Filter className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
      <select
        onChange={(e) => onChange(e.target.value)}
        className="h-7 pl-6 pr-6 text-[11px] border border-gray-200 rounded bg-white text-gray-700 focus:outline-none focus:border-gray-400 appearance-none cursor-pointer transition-colors"
        defaultValue=""
      >
        <option value="" disabled>
          Vista
        </option>
        {VISTA_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
