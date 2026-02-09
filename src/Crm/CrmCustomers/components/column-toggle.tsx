"use client";

import { Settings2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Table } from "@tanstack/react-table";

interface Props<TData> {
  table: Table<TData>;
}

export function ColumnToggle<TData>({ table }: Props<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Settings2 size={16} />
        Columnas
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded z-50 max-h-80 overflow-y-auto">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Mostrar / Ocultar
            </div>
          </div>

          <div className="py-1">
            {table.getAllLeafColumns().map((column) => {
              if (column.id === "select" || column.id === "actions")
                return null;

              return (
                <label
                  key={column.id}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-gray-700 text-sm">
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="border-t border-gray-100 px-3 py-2">
            <button
              onClick={() => table.resetColumnVisibility()}
              className="w-full text-left text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Restaurar todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
