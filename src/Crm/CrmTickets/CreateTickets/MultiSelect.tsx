import { useState } from "react";
import { Check } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/ui/popover";
import { Command } from "@/components/ui/command";
import { CommandInput } from "@/components/ui/command";
import { CommandList } from "@/components/ui/command";
import { CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

type Option = { label: string; value: string };

interface Props {
  options: Option[];
  value: Option[]; // seleccionados
  onChange: (v: Option[]) => void;
  placeholder?: string;
  disabled?: boolean; // NEW
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccione…",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggle = (opt: Option) =>
    value.some((v) => v.value === opt.value)
      ? onChange(value.filter((v) => v.value !== opt.value))
      : onChange([...value, opt]);

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`w-full rounded-md border px-3 py-2 text-left text-sm bg-background
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {value.length ? (
            value.map((v) => (
              <Badge
                key={v.value}
                className="mr-1 dark:bg-white dark:text-black"
              >
                {v.label}
              </Badge>
            ))
          ) : (
            <span className="opacity-50">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 max-w-xs">
        <Command>
          <CommandInput placeholder="Buscar…" />
          <CommandList className="max-h-60 overflow-auto">
            {options.map((opt) => {
              const selected = value.some((v) => v.value === opt.value);
              return (
                <CommandItem key={opt.value} onSelect={() => toggle(opt)}>
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {opt.label}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
