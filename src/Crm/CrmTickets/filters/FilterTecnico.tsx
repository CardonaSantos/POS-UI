"use client";

import { User } from "lucide-react";
import ReactSelect from "react-select";
import { compactSelectStyles } from "./react-select-compact-styles";
// import { OptionSelected } from "../../ReactSelectComponent/OptionSelected";
import type { Tecnico } from "./ticket-filters.types";
import { OptionSelected } from "@/Crm/ReactSelectComponent/OptionSelected";

interface FilterTecnicoProps {
  tecnicos: Tecnico[];
  tecnicoSelected: string | null;
  handleSelectedTecnico: (optionSelect: OptionSelected | null) => void;
}

export function FilterTecnico({
  tecnicos,
  tecnicoSelected,
  handleSelectedTecnico,
}: FilterTecnicoProps) {
  const options = tecnicos.map((t) => ({
    value: String(t.id),
    label: t.nombre,
  }));

  const value = tecnicoSelected
    ? {
        value: tecnicoSelected,
        label:
          tecnicos.find((t) => String(t.id) === tecnicoSelected)?.nombre ?? "",
      }
    : null;

  return (
    <div className="w-36 shrink-0">
      <ReactSelect
        placeholder={
          <span className="flex items-center gap-1 text-gray-500">
            <User className="h-3 w-3" />
            <span className="text-[11px]">Técnico</span>
          </span>
        }
        options={options}
        isClearable
        styles={compactSelectStyles}
        value={value}
        onChange={handleSelectedTecnico}
        isMulti={false}
      />
    </div>
  );
}
