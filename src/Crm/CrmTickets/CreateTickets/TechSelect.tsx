// components/TechSelect.tsx
import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";

type Option = { label: string; value: string };

interface Props {
  options: Option[];
  value: Option | null;
  onChange: (v: Option | null) => void;
  placeholder?: string;
}

export function TechSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccione un técnico",
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt: Option) => {
    if (value && value.value === opt.value) {
      onChange(null); // clear si hace clic otra vez
    } else {
      onChange(opt);
      setOpen(false); // cerrar popover al elegir
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full rounded-md border px-3 py-2 text-left text-sm bg-background"
        >
          {value ? (
            <span className="flex items-center gap-1">
              {value.label}
              <X
                className="ml-auto h-4 w-4 shrink-0 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null); // clear con el ícono
                }}
              />
            </span>
          ) : (
            <span className="opacity-50">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder="Buscar técnico…" />
          <CommandList className="max-h-60 overflow-auto">
            {options.map((opt) => {
              const selected = value?.value === opt.value;
              return (
                <CommandItem key={opt.value} onSelect={() => handleSelect(opt)}>
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
