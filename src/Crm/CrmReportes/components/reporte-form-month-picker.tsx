import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { useController, useFormContext } from "react-hook-form";

import { AppField } from "@/components/app/primitives/app-field";
import { AppMonthPicker } from "@/components/app/primitives/app-month-picker";

interface ReporteFormMonthPickerProps<TFieldValues extends FieldValues> {
  name: FieldPathByValue<TFieldValues, string>;

  control?: Control<TFieldValues>;

  label?: string;

  description?: string;

  hint?: string;

  required?: boolean;

  placeholder?: string;

  minYear?: number;

  maxYear?: number;

  size?: "xs" | "sm" | "md" | "lg";
}

export function ReporteFormMonthPicker<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  description,
  hint,
  required = false,
  placeholder = "Seleccione mes y año",
  minYear,
  maxYear,
  size = "sm",
}: ReporteFormMonthPickerProps<TFieldValues>) {
  const form = useFormContext<TFieldValues>();

  const { field, fieldState } = useController({
    name,
    control: control ?? form.control,
  });

  return (
    <AppField
      label={label}
      description={description}
      hint={hint}
      required={required}
      invalid={fieldState.invalid}
      error={fieldState.error?.message}
    >
      <AppMonthPicker
        value={(field.value ?? "") as string}
        onChange={(value) => {
          field.onChange(value ?? "");
        }}
        placeholder={placeholder}
        minYear={minYear}
        maxYear={maxYear}
        size={size}
      />
    </AppField>
  );
}
