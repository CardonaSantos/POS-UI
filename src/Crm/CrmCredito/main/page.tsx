"use client";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
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
    <PageTransitionCrm
      titleHeader="Créditos"
      subtitle={`Créditos registrados ${creditos.length}`}
      variant="fade-pure"
    >
      <div className="">
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
    </PageTransitionCrm>
  );
}
