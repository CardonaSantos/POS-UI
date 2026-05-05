import type { StylesConfig } from "react-select";

// Shared compact styles for react-select instances at h-7 height
export const compactSelectStyles: StylesConfig<
  { value: string; label: string },
  boolean
> = {
  control: (base) => ({
    ...base,
    minHeight: "28px",
    height: "28px",
    fontSize: "12px",
    borderRadius: "4px",
    borderColor: "#e5e7eb",
    boxShadow: "none",
    backgroundColor: "transparent",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    height: "26px",
    padding: "0 6px",
    flexWrap: "nowrap",
  }),
  input: (base) => ({
    ...base,
    margin: "0px",
    padding: "0px",
    fontSize: "12px",
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#111827",
  }),
  multiValue: (base) => ({
    ...base,
    fontSize: "11px",
    height: "18px",
    alignItems: "center",
    borderRadius: "3px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    fontSize: "11px",
    padding: "0 4px",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    color: "#9ca3af",
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    color: "#9ca3af",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "26px",
  }),
  menu: (base) => ({
    ...base,
    fontSize: "12px",
    zIndex: 50,
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "12px",
    padding: "5px 10px",
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
    color: "#111827",
    cursor: "pointer",
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: "12px",
    color: "#6b7280",
  }),
};
