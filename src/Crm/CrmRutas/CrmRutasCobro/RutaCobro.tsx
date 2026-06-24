"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Map,
  RefreshCw,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { AppStack } from "@/components/app/primitives/app-stack";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { formattShortFecha } from "@/utils/formattFechas";
import MapsMapa from "./ClientesRutaMap";
import { useRutaCobroPage } from "./_components/use-ruta-cobro-page";
import { RutaCobroClientPanel } from "./_components/ruta-cobro-client-panel";
import {
  RutaCobroConfirmPaymentDialog,
  RutaCobroPaymentDialog,
  RutaCobroPaymentSuccessDialog,
} from "./_components/ruta-cobro-payment-dialogs";

function RutaCobroSkeleton() {
  return (
    <PageTransitionCrm
      titleHeader="Ruta de cobro"
      subtitle="Cargando datos de la ruta..."
      variant="fade-pure"
    >
      <AppGrid cols={{ base: 1, xl: 12 }} gap="md">
        <AppStack gap="md" className="xl:col-span-5">
          <AppSkeleton className="h-24 w-full" />
          <AppSkeleton className="h-[520px] w-full" />
        </AppStack>

        <AppSkeleton className="h-[520px] w-full xl:col-span-7" />
      </AppGrid>
    </PageTransitionCrm>
  );
}

function RutaHeaderCard({
  nombreRuta,
  cobradorNombre,
  creadoEn,
  clientesCount,
}: {
  nombreRuta: string;
  cobradorNombre: string;
  creadoEn: string;
  clientesCount: number;
}) {
  return (
    <AppCard variant="outline" size="xs" radius="md" className="px-3 py-2">
      <AppInline align="start" justify="between" gap="sm">
        <AppStack gap="xs" className="min-w-0">
          <h2 className="truncate text-sm font-semibold leading-5 text-[hsl(var(--app-foreground,var(--foreground)))]">
            {nombreRuta}
          </h2>

          <AppInline gap="xs" align="center" className="min-w-0">
            <User
              size={13}
              className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            />
            <span className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Cobrador: {cobradorNombre}
            </span>
          </AppInline>

          <AppInline gap="xs" align="center" className="min-w-0">
            <Calendar
              size={13}
              className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            />
            <span className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Creado: {formattShortFecha(creadoEn)}
            </span>
          </AppInline>
        </AppStack>

        <span className="shrink-0 rounded-[var(--app-radius-full)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.35] px-2 py-1 text-xs font-medium text-[hsl(var(--app-foreground,var(--foreground)))]">
          {clientesCount} clientes
        </span>
      </AppInline>
    </AppCard>
  );
}

export default function RutaCobro() {
  const navigate = useNavigate();
  const vm = useRutaCobroPage();

  const ruta = vm.ruta;

  if (vm.rutaQuery.isFetching && !ruta) {
    return <RutaCobroSkeleton />;
  }

  if (vm.rutaQuery.isError) {
    return (
      <PageTransitionCrm
        titleHeader={`Ruta de cobro #${vm.rutaId ?? ""}`}
        subtitle="No se pudo cargar la ruta"
        variant="fade-pure"
      >
        <AppStack gap="md">
          <AppAlert
            tone="danger"
            size="sm"
            icon={<AlertCircle size={15} />}
            title="Error al cargar la ruta"
            description={getApiErrorMessageAxios(vm.rutaQuery.error)}
          />

          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<ArrowLeft size={13} />}
            onClick={() => navigate(-1)}
          >
            Volver
          </AppButton>
        </AppStack>
      </PageTransitionCrm>
    );
  }

  if (!ruta) {
    return (
      <PageTransitionCrm
        titleHeader={`Ruta de cobro #${vm.rutaId ?? ""}`}
        subtitle="Ruta no encontrada"
        variant="fade-pure"
      >
        <AppEmptyState
          preset="empty"
          variant="dashed"
          size="sm"
          align="center"
          icon={<Map size={34} strokeWidth={1.5} />}
          title="Ruta no encontrada"
          description="No se pudo encontrar la información de esta ruta de cobro."
          action={
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<ArrowLeft size={13} />}
              onClick={() => navigate(-1)}
            >
              Volver
            </AppButton>
          }
        />
      </PageTransitionCrm>
    );
  }

  return (
    <PageTransitionCrm
      titleHeader={`Ruta de cobro #${vm.rutaId}`}
      subtitle={`${ruta.clientes.length} clientes asignados · ${vm.facturasPorCobrar} facturas por cobrar`}
      variant="fade-pure"
    >
      <AppStack gap="md">
        <AppInline align="center" justify="between" gap="sm" wrap>
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<ArrowLeft size={13} />}
            onClick={() => navigate(-1)}
          >
            Volver
          </AppButton>

          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<RefreshCw size={13} />}
            loading={vm.rutaQuery.isFetching}
            loadingText="Actualizando..."
            onClick={() => vm.rutaQuery.refetch()}
          >
            Refrescar
          </AppButton>
        </AppInline>

        <AppGrid
          cols={{ base: 1, xl: 12 }}
          gap="md"
          className="xl:h-[calc(100dvh-180px)] xl:min-h-[560px]"
        >
          <AppStack gap="md" className="min-h-0 xl:col-span-5 xl:h-full">
            <RutaHeaderCard
              nombreRuta={ruta.nombreRuta}
              cobradorNombre={ruta.cobrador?.nombre ?? "Sin cobrador"}
              creadoEn={ruta.creadoEn}
              clientesCount={ruta.clientes.length}
            />

            <RutaCobroClientPanel
              clientes={ruta.clientes}
              selectedClientId={vm.ui.selectedClientId}
              onSelectClient={vm.setSelectedClient}
              onOpenPayment={vm.openPaymentForFactura}
            />
          </AppStack>

          <AppCard
            variant="outline"
            size="xs"
            radius="md"
            className="h-[430px] overflow-hidden xl:col-span-7 xl:h-[calc(100dvh-205px)]"
          >
            <div className="flex h-full flex-col">
              <AppInline
                align="center"
                justify="between"
                gap="sm"
                className="border-b border-[hsl(var(--app-border,var(--border)))] px-3 py-2"
              >
                <AppInline align="center" gap="xs">
                  <Map size={14} />
                  <h2 className="text-xs font-semibold">
                    Mapa de clientes en ruta
                  </h2>
                </AppInline>

                <span className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                  {vm.clientesToMap.length} ubicaciones válidas
                </span>
              </AppInline>

              <div className="min-h-0 flex-1">
                <MapsMapa clientes={vm.clientesToMap} />
              </div>
            </div>
          </AppCard>
        </AppGrid>
      </AppStack>

      <RutaCobroPaymentDialog
        open={vm.paymentDialog.isOpen}
        onOpenChange={vm.paymentDialog.setOpen}
        form={vm.ui.pagoForm}
        isSubmitting={vm.isSubmittingPayment}
        onPatch={vm.patchPagoForm}
        onContinue={vm.openConfirmPayment}
      />

      <RutaCobroConfirmPaymentDialog
        open={vm.confirmPaymentDialog.isOpen}
        onOpenChange={vm.confirmPaymentDialog.setOpen}
        isSubmitting={vm.isSubmittingPayment}
        onConfirm={vm.submitPayment}
        onCancel={() => {
          vm.confirmPaymentDialog.close();
          vm.paymentDialog.open();
        }}
      />

      <RutaCobroPaymentSuccessDialog
        open={vm.successPaymentDialog.isOpen}
        onOpenChange={vm.successPaymentDialog.setOpen}
        facturaId={vm.ui.facturaSelectedId}
      />
    </PageTransitionCrm>
  );
}
