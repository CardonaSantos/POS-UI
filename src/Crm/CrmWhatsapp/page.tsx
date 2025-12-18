import { useMemo } from "react";
import { useSearchParams } from "react-router-dom"; // 👈 Importante
import type { FindClientesQuery } from "../features/bot-server/whatsapp-messages/query";
import { useGetClientes } from "../CrmHooks/hooks/bot-server/use-whatsapp-server/useWhatsappServer";
import { ClientesTableWhatsapp } from "./_components/table/table";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

export default function WhatsappChats() {
  // leer/escribir en la URL
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const take = Number(searchParams.get("limit")) || 10;
  const nombre = searchParams.get("q") || "";

  // Calcular 'skip' derivado de la página actual
  // Si estamos en pag 1: (1-1)*10 = 0. Si pag 2: (2-1)*10 = 10.
  const skip = (page - 1) * take;

  // params para el Query (Memoizado)
  const params: FindClientesQuery = useMemo(
    () => ({
      take,
      skip,
      nombre: nombre.trim() ? nombre.trim() : undefined,
    }),
    [take, skip, nombre]
  );

  const q = useGetClientes(params);

  const rows = q.data?.data ?? [];
  const meta = q.data?.meta ?? {
    total: 0,
    take,
    skip,
    page: page, // ppage de la URL
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const updateParams = (
    newParams: Record<string, string | number | undefined>
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === 0) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  };
  console.log("clientes: ", rows);

  return (
    <PageTransitionCrm
      titleHeader="Nuvia - Mensajería"
      subtitle={`${meta.total} Chats`}
      variant="fade-pure"
    >
      <ClientesTableWhatsapp
        data={rows}
        meta={meta}
        isLoading={q.isLoading}
        isFetching={q.isFetching}
        // --- FILTROS ---
        nombre={nombre}
        onNombreChange={(v) => {
          updateParams({
            q: v,
            page: 1,
          });
        }}
        // --- PAGINACIÓN ---
        onPageChange={(pageIndex) => {
          updateParams({ page: pageIndex + 1 });
        }}
        onPageSizeChange={(pageSize) => {
          updateParams({
            limit: pageSize,
            page: 1,
          });
        }}
      />
    </PageTransitionCrm>
  );
}
