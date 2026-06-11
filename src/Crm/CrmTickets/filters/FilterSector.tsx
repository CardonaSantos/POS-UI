"use client";

import { MapPin } from "lucide-react";
import ReactSelect, { SingleValue } from "react-select";
import { compactSelectStyles } from "./react-select-compact-styles";
import { Sector } from "@/Crm/features/cliente-interfaces/cliente-types";

interface FilterSectorProps {
  sector: Sector[];
  sectorSelected: number | undefined;
  onChange: (sectorId: number | undefined) => void;
}

type SectorOption = {
  value: string;
  label: string;
};

export function FilterSector({
  sector,
  onChange,
  sectorSelected,
}: FilterSectorProps) {
  const options: SectorOption[] = sector.map((s) => ({
    value: String(s.id),
    label: s.nombre,
  }));

  const value =
    options.find((opt) => Number(opt.value) === sectorSelected) ?? null;

  const handleChange = (option: SingleValue<SectorOption>) => {
    onChange(option ? Number(option.value) : undefined);
  };

  return (
    <div className="w-40 shrink-0">
      <ReactSelect<SectorOption, false>
        placeholder={
          <span className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="text-[11px]">Sector</span>
          </span>
        }
        options={options}
        isClearable
        isMulti={false}
        styles={compactSelectStyles}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}
