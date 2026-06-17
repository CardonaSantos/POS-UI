"use client";
import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { toast } from "sonner";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppDataTable } from "@/components/app/table/app-data-table";
import {
  normalizeAppPayload,
  useAppDisclosure,
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { handleOpenWhatsapp } from "@/Crm/_Utils/helpersText";
import { useGetSectores } from "../CrmHooks/hooks/Sectores/useGetSectores";
import { useGetMunicipios } from "../CrmHooks/hooks/Municipios/useGetMunicipios";
import { useGetDepartamentos } from "../CrmHooks/hooks/Departamentos/useGetDepartamentos";
import { useGetZonasFacturacion } from "../CrmHooks/hooks/Zonas-facturacion/useGetZonasFacturacion";
import { useGetUsersToSelect } from "../CrmHooks/hooks/useUsuarios/use-usuers";
import {
  GetCustomersQueryDto,
  useGetCustomersInTable,
} from "../CrmHooks/hooks/use-get-customers-table/useGetCustomerTable";
import {
  downloadFile,
  FiltersProps,
  useGenerateHistorialPagos,
  useGenerateInfoReport,
  useGenerateReportCobranza,
} from "../CrmHooks/hooks/use-reports/use-reports";

import type { ClienteTableDto } from "./CustomerTable";

import {
  CustomerReportsCobranzaDialog,
  ReportCobranzaFiltersState,
} from "./_components/customer-reports-cobranza-dialog";
import {
  AppOption,
  CUSTOMER_SORT_FIELD_MAP,
  INITIAL_CUSTOMER_COLUMN_VISIBILITY,
  PAGE_SIZE_OPTIONS,
} from "./customer-table.constants";
import {
  CustomerFiltersState,
  CustomerTableFilters,
} from "./_components/customer-table-filters";
import { createClienteTableColumns } from "./_components/customer-table.columns";
import { CustomerBulkActions } from "./_components/customer-bulk-actions";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

function toNumberOrUndefined(value: string | null) {
  if (!value) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toDateOrNull(value?: string | null) {
  if (!value) return null;

  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.toDate() : null;
}

function setParam(
  params: URLSearchParams,
  key: string,
  value: string | number | null | undefined,
) {
  if (value === null || value === undefined || value === "") {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

export default function ClientesTable() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo<CustomerFiltersState>(
    () => ({
      search: searchParams.get("q") ?? "",
      serverSearch: searchParams.get("q") ?? "",
      departamentoId: searchParams.get("dep") ?? "8",
      municipioId: searchParams.get("muni"),
      sectorId: searchParams.get("sec"),
      zonaFacturacionId: searchParams.get("zona"),
      estado: searchParams.get("est") ?? searchParams.get("estado"),
      estadoCobranza:
        searchParams.get("estCobranza") ?? searchParams.get("estadoCobranza"),
      sort: null,
    }),
    [],
  );

  const filters = useAppStateHandlers<CustomerFiltersState>(initialFilters);

  const table = useAppTableHandlers({
    initialPageIndex: Number(searchParams.get("p"))
      ? Number(searchParams.get("p")) - 1
      : 0,
    initialPageSize: Number(searchParams.get("l")) || 10,
    initialColumnVisibility: INITIAL_CUSTOMER_COLUMN_VISIBILITY,
    initialDensity: "xs",
  });

  const reportDialog = useAppDisclosure();

  const reportFilters = useAppStateHandlers<ReportCobranzaFiltersState>({
    paidRange: { start: null, end: null },
    generatedRange: { start: null, end: null },
    userId: null,
    estados: [],
  });

  const { data: departamentos = [] } = useGetDepartamentos();
  const { data: sectores = [] } = useGetSectores();
  const { data: zonasFacturacion = [] } = useGetZonasFacturacion();
  const { data: rawUsers = [] } = useGetUsersToSelect();

  const { data: municipios = [] } = useGetMunicipios(
    filters.state.departamentoId ? Number(filters.state.departamentoId) : 0,
  );

  const exportInfoMutation = useGenerateInfoReport();
  const exportPagosMutation = useGenerateHistorialPagos();
  const createReportCobranza = useGenerateReportCobranza();

  const optionsDepartamentos = useMemo<AppOption[]>(
    () =>
      departamentos.map((departamento) => ({
        value: String(departamento.id),
        label: departamento.nombre,
      })),
    [departamentos],
  );

  const optionsMunicipios = useMemo<AppOption[]>(
    () =>
      municipios.map((municipio) => ({
        value: String(municipio.id),
        label: municipio.nombre,
      })),
    [municipios],
  );

  const optionsSectores = useMemo<AppOption[]>(
    () =>
      sectores.map((sector) => ({
        value: String(sector.id),
        label: `${sector.nombre} (${sector.clientesCount ?? 0})`,
      })),
    [sectores],
  );

  const optionsZonasFacturacion = useMemo<AppOption[]>(
    () =>
      zonasFacturacion
        .slice()
        .sort((a, b) => {
          const first = Number(a.nombre.match(/\d+/)?.[0] ?? "0");
          const second = Number(b.nombre.match(/\d+/)?.[0] ?? "0");
          return first - second;
        })
        .map((zona) => ({
          value: String(zona.id),
          label: `${zona.nombre} (${zona.clientesCount})`,
        })),
    [zonasFacturacion],
  );

  const userOptions = useMemo<AppOption[]>(
    () =>
      rawUsers.map((user) => ({
        value: String(user.id),
        label: user.nombre,
      })),
    [rawUsers],
  );

  const queryDto: GetCustomersQueryDto = useMemo(
    () =>
      normalizeAppPayload(
        {
          page: table.pagination.pageIndex + 1,
          limite: table.pagination.pageSize,
          paramSearch: filters.state.serverSearch || undefined,
          depaSelected: toNumberOrUndefined(filters.state.departamentoId),
          muniSelected: toNumberOrUndefined(filters.state.municipioId),
          sectorSelected: toNumberOrUndefined(filters.state.sectorId),
          zonasFacturacionSelected: toNumberOrUndefined(
            filters.state.zonaFacturacionId,
          ),
          estadoSelected: filters.state.estado || undefined,
          estadoCobranzaSelected: filters.state.estadoCobranza || undefined,
        },
        {
          removeUndefined: true,
          emptyStringToUndefined: true,
        },
      ) as GetCustomersQueryDto,
    [
      table.pagination.pageIndex,
      table.pagination.pageSize,
      filters.state.serverSearch,
      filters.state.departamentoId,
      filters.state.municipioId,
      filters.state.sectorId,
      filters.state.zonaFacturacionId,
      filters.state.estado,
      filters.state.estadoCobranza,
    ],
  );

  const customersQuery = useGetCustomersInTable(queryDto);

  const responseTable = customersQuery.data;
  const clientes = responseTable?.data ?? [];
  const totalCount = responseTable?.totalCount ?? 0;

  const summary = responseTable?.summary ?? {
    activo: 0,
    atrasado: 0,
    moroso: 0,
    pendiente_activo: 0,
  };

  const selectedIds = useMemo(
    () => Object.keys(table.rowSelection),
    [table.rowSelection],
  );

  const isExportingSelected =
    exportInfoMutation.isPending || exportPagosMutation.isPending;

  const columns = useMemo(
    () =>
      createClienteTableColumns({
        onCopyPhone: async (telefono) => {
          await navigator.clipboard.writeText(telefono);
          toast.success("Teléfono copiado");
        },
        onOpenWhatsapp: (telefono) => {
          const url = handleOpenWhatsapp(telefono);
          window.open(url, "_blank", "noopener,noreferrer");
        },
        onCallPhone: (telefono) => {
          window.location.href = `tel:${telefono}`;
        },
        onEditCliente: (clienteId) => {
          navigate(`/crm/cliente-edicion/${clienteId}`);
        },
      }),
    [navigate],
  );

  useEffect(() => {
    const params = new URLSearchParams();

    setParam(params, "q", filters.state.serverSearch);
    setParam(params, "dep", filters.state.departamentoId);
    setParam(params, "muni", filters.state.municipioId);
    setParam(params, "sec", filters.state.sectorId);
    setParam(params, "zona", filters.state.zonaFacturacionId);
    setParam(params, "est", filters.state.estado);
    setParam(params, "estCobranza", filters.state.estadoCobranza);
    setParam(params, "p", table.pagination.pageIndex + 1);
    setParam(params, "l", table.pagination.pageSize);

    setSearchParams(params, { replace: true });
  }, [
    filters.state.serverSearch,
    filters.state.departamentoId,
    filters.state.municipioId,
    filters.state.sectorId,
    filters.state.zonaFacturacionId,
    filters.state.estado,
    filters.state.estadoCobranza,
    table.pagination.pageIndex,
    table.pagination.pageSize,
    setSearchParams,
  ]);

  const resetPageAndSelection = () => {
    table.resetPage();
    table.clearSelection();
  };

  const handleSearchDebouncedChange = (value: string) => {
    filters.setField("serverSearch", value);
    resetPageAndSelection();
  };

  const handleClearSearch = () => {
    filters.patch({
      search: "",
      serverSearch: "",
    });
    resetPageAndSelection();
  };

  const handleDepartamentoChange = (value: string | null) => {
    filters.patch({
      departamentoId: value,
      municipioId: null,
    });
    resetPageAndSelection();
  };

  const handleMunicipioChange = (value: string | null) => {
    filters.setField("municipioId", value);
    resetPageAndSelection();
  };

  const handleSectorChange = (value: string | null) => {
    filters.setField("sectorId", value);
    resetPageAndSelection();
  };

  const handleZonaFacturacionChange = (value: string | null) => {
    filters.setField("zonaFacturacionId", value);
    resetPageAndSelection();
  };

  const handleEstadoChange = (value: string | null) => {
    filters.setField("estado", value);
    resetPageAndSelection();
  };

  const handleEstadoCobranzaChange = (value: string | null) => {
    filters.setField("estadoCobranza", value);
    resetPageAndSelection();
  };

  const handleSortChange = (value: string | null) => {
    filters.setField("sort", value);

    if (!value) {
      table.setSorting([]);
      return;
    }

    const [key, direction] = value.split("-");
    const columnId = CUSTOMER_SORT_FIELD_MAP[key];

    if (!columnId) {
      table.setSorting([]);
      return;
    }

    table.setSorting([{ id: columnId, desc: direction === "desc" }]);
  };

  const handleClearFilters = () => {
    filters.patch({
      search: "",
      serverSearch: "",
      departamentoId: "8",
      municipioId: null,
      sectorId: null,
      zonaFacturacionId: null,
      estado: null,
      estadoCobranza: null,
      sort: null,
    });

    table.setSorting([]);
    resetPageAndSelection();
  };

  const handleExportInfoSelected = async () => {
    const ids = selectedIds.map(Number);

    try {
      const data = await exportInfoMutation.mutateAsync({ ids });
      downloadFile(data, `Reporte_Clientes_${Date.now()}.xlsx`);
      toast.success("Reporte de información descargado");
      table.clearSelection();
    } catch {
      toast.error("Error al generar el reporte de información");
    }
  };

  const handleExportPagosSelected = async () => {
    const ids = selectedIds.map(Number);

    try {
      const data = await exportPagosMutation.mutateAsync({ ids });
      downloadFile(data, `Historial_Pagos_${Date.now()}.xlsx`);
      toast.success("Historial de pagos descargado");
      table.clearSelection();
    } catch {
      toast.error("Error al generar el historial");
    }
  };

  const handleClearReportFilters = () => {
    reportFilters.patch({
      paidRange: { start: null, end: null },
      generatedRange: { start: null, end: null },
      userId: null,
      estados: [],
    });
  };

  const handleGenerateReportCobranza = async () => {
    const payload: FiltersProps = {
      startDate: toDateOrNull(reportFilters.state.paidRange.start) ?? undefined,
      endDate: toDateOrNull(reportFilters.state.paidRange.end),

      startDateG:
        toDateOrNull(reportFilters.state.generatedRange.start) ?? undefined,
      endDateG: toDateOrNull(reportFilters.state.generatedRange.end),

      userId: reportFilters.state.userId
        ? Number(reportFilters.state.userId)
        : null,

      estados: reportFilters.state.estados,
    };

    await toast.promise(createReportCobranza.mutateAsync(payload), {
      loading: "Generando reporte...",
      success: (data: any) => {
        downloadFile(data, `Reporte_Pagos_${Date.now()}.xlsx`);
        reportDialog.close();
        return "Reporte generado";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  return (
    <PageTransitionCrm titleHeader="Lista de clientes" variant="fade-pure">
      <AppContainer size="full" paddingY="none" paddingX="none">
        <AppStack gap="sm">
          <AppInline gap="xs" wrap>
            <AppBadge tone="success" appearance="soft">
              {summary.activo} activos
            </AppBadge>
            <AppBadge tone="warning" appearance="soft">
              {summary.atrasado} atrasados
            </AppBadge>
            <AppBadge tone="danger" appearance="soft">
              {summary.moroso} morosos
            </AppBadge>
            <AppBadge tone="info" appearance="soft">
              {summary.pendiente_activo} pendientes
            </AppBadge>
          </AppInline>

          <CustomerTableFilters
            filters={filters.state}
            options={{
              departamentos: optionsDepartamentos,
              municipios: optionsMunicipios,
              sectores: optionsSectores,
              zonasFacturacion: optionsZonasFacturacion,
            }}
            isSearching={customersQuery.isFetching}
            onSearchChange={(value) => filters.setField("search", value)}
            onSearchDebouncedChange={handleSearchDebouncedChange}
            onClearSearch={handleClearSearch}
            onDepartamentoChange={handleDepartamentoChange}
            onMunicipioChange={handleMunicipioChange}
            onSectorChange={handleSectorChange}
            onZonaFacturacionChange={handleZonaFacturacionChange}
            onEstadoChange={handleEstadoChange}
            onEstadoCobranzaChange={handleEstadoCobranzaChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            rightActions={
              <CustomerReportsCobranzaDialog
                open={reportDialog.isOpen}
                onOpenChange={reportDialog.setOpen}
                filters={reportFilters.state}
                userOptions={userOptions}
                isGenerating={createReportCobranza.isPending}
                onPaidRangeChange={(range) =>
                  reportFilters.setField("paidRange", range)
                }
                onGeneratedRangeChange={(range) =>
                  reportFilters.setField("generatedRange", range)
                }
                onUserChange={(userId) =>
                  reportFilters.setField("userId", userId)
                }
                onEstadosChange={(estados) =>
                  reportFilters.setField("estados", estados)
                }
                onClear={handleClearReportFilters}
                onGenerate={handleGenerateReportCobranza}
              />
            }
          />

          <AppCard variant="outline" size="xs" radius="md">
            <AppDataTable<ClienteTableDto>
              data={clientes}
              columns={columns}
              getRowId={(row) => String(row.id)}
              isLoading={customersQuery.isPending}
              isFetching={customersQuery.isFetching}
              error={customersQuery.error}
              onRetry={() => customersQuery.refetch()}
              paginationMode="server"
              pagination={table.getPaginationConfig({
                totalRows: totalCount,
                pageSizeOptions: PAGE_SIZE_OPTIONS,
              })}
              {...table.getDataTableStateProps()}
              enableRowSelection
              enableColumnVisibility
              enableColumnPinning
              enableVirtualization
              stickyHeader
              density={table.density}
              maxHeight="70vh"
              // rightToolbar={
              //   <AppTableDensityToggle
              //     value={table.density}
              //     onChange={table.setDensity}
              //   />
              // }
              bulkActions={
                <CustomerBulkActions
                  selectedCount={selectedIds.length}
                  isLoading={isExportingSelected}
                  onExportInfo={handleExportInfoSelected}
                  onExportPagos={handleExportPagosSelected}
                  onClearSelection={table.clearSelection}
                />
              }
            />
          </AppCard>
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
