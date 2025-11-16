// SelectZonaFacturacion.tsx
"use client";

import * as React from "react";
import ReactSelectComponent from "react-select";
import { compactSelectStyles } from "@/utils/_components/react_select_component_styles.ts/selectStyles";
import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
import { OptionSelected } from "../ReactSelectComponent/OptionSelected";

interface SelectZonaFacturacionProps {
  zonas: FacturacionZona[];
  value: string[];
  onChange: (options: OptionSelected[]) => void;
}

export function SelectZonaFacturacion({
  zonas,
  value,
  onChange,
}: SelectZonaFacturacionProps) {
  const options: OptionSelected[] = zonas.map((z) => ({
    value: String(z.id),
    label: `${z.nombreRuta} (${z.clientes} clientes)`,
  }));

  const [portal, setPortal] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setPortal(document.body), []);

  return (
    <ReactSelectComponent
      className="w-full text-xs text-black dark:text-black"
      classNamePrefix="rs"
      styles={compactSelectStyles}
      options={options}
      isMulti
      isClearable
      closeMenuOnSelect={false}
      // 👇 deja que el menú Oculte lo ya seleccionado (default = true)
      hideSelectedOptions
      placeholder="Filtrar por zona..."
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
