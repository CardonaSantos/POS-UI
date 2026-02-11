"use client";

import { Settings2, RotateCcw } from "lucide-react";
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
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const hiddenCount = table
    .getAllLeafColumns()
    .filter((c) => !c.getIsVisible()).length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botón Responsivo: Icono siempre, texto solo en sm+ */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center justify-center gap-2 
          h-9 px-2 sm:px-3
          bg-white border rounded-md text-sm font-medium transition-all
          ${isOpen ? "border-gray-400 bg-gray-50 text-gray-900" : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
          focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200
        `}
        aria-label="Alternar columnas"
      >
        <Settings2 size={16} />
        <span className="hidden sm:inline">Vistas</span>
        {hiddenCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 sm:ml-auto">
            {hiddenCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* Lista de Columnas Scrollable */}
          <div className="p-1 max-h-[35vh] overflow-y-auto custom-scrollbar">
            {table.getAllLeafColumns().map((column) => {
              if (column.id === "select" || column.id === "actions")
                return null;

              return (
                <label
                  key={column.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer group select-none"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    className="
                      appearance-none h-4 w-4 rounded border border-gray-300 bg-white 
                      checked:bg-gray-800 checked:border-gray-800 focus:ring-0 focus:ring-offset-0 
                      transition-colors cursor-pointer
                      relative after:content-[''] after:hidden checked:after:block after:absolute after:left-[5px] after:top-[1px] after:w-[5px] after:h-[9px] after:border-r-2 after:border-b-2 after:border-white after:rotate-45
                    "
                  />
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 truncate font-medium">
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Footer Compacto */}
          <div className="border-t border-gray-100 p-1">
            <button
              onClick={() => table.resetColumnVisibility()}
              className="flex w-full items-center justify-center gap-2 rounded px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <RotateCcw size={12} />
              Restaurar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
