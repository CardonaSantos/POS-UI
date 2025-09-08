// reactSelect.styles.ts
import type { GroupBase, StylesConfig } from "react-select";
//AJUSTAR COLORES DE CHIPS, MENUS DROPDOW, ETC.
export const compactSelectStyles: StylesConfig<any, true, GroupBase<any>> = {
  control: (base, state) => ({
    ...base,
    minHeight: 30, // más bajito que el default (38)
    borderRadius: 8,
    boxShadow: "none",
    borderColor: state.isFocused ? "var(--ring)" : base.borderColor,
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 6px",
    gap: 4,
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    fontSize: 12,
  }),
  indicatorsContainer: (base) => ({ ...base, paddingTop: 2, paddingBottom: 2 }),
  clearIndicator: (b) => ({ ...b, padding: 4 }),
  dropdownIndicator: (b) => ({ ...b, padding: 4 }),
  multiValue: (base) => ({ ...base, borderRadius: 6 }),
  multiValueLabel: (base) => ({ ...base, fontSize: 12, padding: "0 6px" }),
  multiValueRemove: (base) => ({ ...base, padding: 2 }),
  option: (base, s) => ({
    ...base,
    fontSize: 12,
    padding: "6px 8px",
    backgroundColor: s.isFocused ? "var(--muted)" : "transparent",
    color: "black", // 👈 opciones del dropdown
  }),
  placeholder: (base) => ({ ...base, fontSize: 12 }),
  menu: (base) => ({ ...base, zIndex: 50 }),
  menuPortal: (base) => ({ ...base, zIndex: 60 }),
};
