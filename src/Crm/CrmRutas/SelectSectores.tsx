// SelectSectoresMulti.tsx
"use client";

import * as React from "react";
import ReactSelectComponent from "react-select";
import type { OptionSelected, Sector } from "./rutas-types";
import { compactSelectStyles } from "@/utils/_components/react_select_component_styles.ts/selectStyles";

interface Props {
  sectores: Sector[];
  value: string[];
  onChange: (options: OptionSelected[]) => void;
}

export function SelectSectoresMulti({ sectores, value, onChange }: Props) {
  const options: OptionSelected[] = sectores.map((s) => ({
    value: String(s.id),
    label: `${s.nombre} (${s.clientes ?? s.clientesCount ?? 0})`,
  }));

  const [portal, setPortal] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setPortal(document.body), []);

  return (
    <ReactSelectComponent
      className="w-full text-xs text-black"
      classNamePrefix="rs"
      styles={compactSelectStyles}
      options={options}
      isMulti
      isClearable
      closeMenuOnSelect={false}
      hideSelectedOptions // 👈 importante
      placeholder="Filtrar por sector..."
      value={options.filter((opt) => value.includes(opt.value))}
      onChange={(selected) =>
        onChange(selected ? (selected as OptionSelected[]) : [])
      }
      components={{ IndicatorSeparator: null }}
      menuPortalTarget={portal ?? undefined}
      maxMenuHeight={260}
    />
  );
}
