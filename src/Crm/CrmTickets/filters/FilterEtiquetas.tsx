"use client";

import { Tag } from "lucide-react";
import ReactSelect, { type MultiValue } from "react-select";

import { compactSelectStyles } from "./react-select-compact-styles";
import type { Etiqueta } from "./ticket-filters.types";

type SelectOption = {
  value: string;
  label: string;
};

interface FilterEtiquetasProps {
  etiquetas: Etiqueta[];
  etiquetasSelecteds: number[];
  onChange: (selectedOptions: MultiValue<SelectOption>) => void;
}

export function FilterEtiquetas({
  etiquetas,
  etiquetasSelecteds,
  onChange,
}: FilterEtiquetasProps) {
  const options: SelectOption[] = etiquetas.map((etiqueta) => ({
    value: String(etiqueta.id),
    label: etiqueta.nombre,
  }));

  const value: MultiValue<SelectOption> = options.filter((option) =>
    etiquetasSelecteds.includes(Number(option.value)),
  );

  return (
    <div className="w-40 shrink-0">
      <ReactSelect<SelectOption, true>
        placeholder={
          <span className="flex items-center gap-1 text-gray-500">
            <Tag className="h-3 w-3" />
            <span className="text-[11px]">Etiquetas</span>
          </span>
        }
        options={options}
        value={value}
        isMulti
        isClearable
        styles={compactSelectStyles}
        onChange={(selectedOptions) => {
          onChange(selectedOptions);
        }}
      />
    </div>
  );
}
