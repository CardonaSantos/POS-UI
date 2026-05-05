"use client";

import { Tag } from "lucide-react";
import ReactSelect, { MultiValue } from "react-select";
import { compactSelectStyles } from "./react-select-compact-styles";
import type { Etiqueta } from "./ticket-filters.types";

interface FilterEtiquetasProps {
  etiquetas: Etiqueta[];
  etiquetasSelecteds: number[];
  onChange: (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => void;
}

export function FilterEtiquetas({
  etiquetas,
  etiquetasSelecteds,
  onChange,
}: FilterEtiquetasProps) {
  const options = etiquetas.map((e) => ({
    value: String(e.id),
    label: e.nombre,
  }));

  const value = options.filter((opt) =>
    etiquetasSelecteds.includes(Number(opt.value))
  );

  return (
    <div className="w-40 shrink-0">
      <ReactSelect
        placeholder={
          <span className="flex items-center gap-1 text-gray-500">
            <Tag className="h-3 w-3" />
            <span className="text-[11px]">Etiquetas</span>
          </span>
        }
        options={options}
        isClearable
        isMulti
        styles={compactSelectStyles}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
