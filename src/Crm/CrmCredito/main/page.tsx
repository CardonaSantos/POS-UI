"use client";

import { CreditosDataTable } from "@/Crm/CrmCredito/main/components/creditos-data-table";
import { CreditosFilters } from "@/Crm/CrmCredito/main/components/creditos-filters";
import { CreditosSummary } from "@/Crm/CrmCredito/main/components/creditos-summary";
import { GetCreditosQueryDto } from "@/Crm/CrmHooks/hooks/use-credito/query";
import { useGetCreditos } from "@/Crm/CrmHooks/hooks/use-credito/use-credito";
import { useState } from "react";

export function CreditosMainPage() {
  const [filters, setFilters] = useState<GetCreditosQueryDto>({
    page: 1,
    limit: 10,
  });

  // Descomenta y usa tu hook real:
  const { data: creditosRaw, isLoading } = useGetCreditos(filters);
  const creditos = creditosRaw?.data ?? [];
  const meta = creditosRaw?.meta ?? { total: 0, page: 1, lastPage: 1 };

  const handleFiltersChange = (newFilters: GetCreditosQueryDto) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header con título */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Créditos</h1>
          <p className="text-xs text-muted-foreground">
            Gestión y seguimiento de créditos registrados
          </p>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <CreditosSummary creditos={creditos} />

      {/* Filtros de búsqueda */}
      <CreditosFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Tabla de créditos */}
      <CreditosDataTable
        data={creditos}
        meta={meta}
        currentPage={filters.page ?? 1}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
}
