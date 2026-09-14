import { CalendarDays, DollarSign, MapPinned, Save, Users } from "lucide-react";

import { useFormContext } from "react-hook-form";

import {
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/components/app/form";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid, AppGridItem } from "@/components/app/primitives/app-grid";

import type { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";

import type { RutaEditDetail } from "@/Crm/features/rutas/ruta-edit.types";
import { EstadoRuta } from "@/Crm/features/rutas/rutas.interfaces";

import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { formattShortFecha } from "@/utils/formattFechas";

import {
  RUTA_EDIT_ESTADO_LABELS,
  RUTA_EDIT_ESTADO_OPTIONS,
} from "./rutas-edit.constants";
import { RutaEditFormValues } from "../../schemas/rutas-edit.schema";

interface RutasEditFormCardProps {
  ruta: RutaEditDetail;

  cobradorOptions: AppOption[];

  selectedCount: number;
  totalACobrar: number;

  isSaving?: boolean;

  onCancel: () => void;
}

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function getEstadoRutaTone(estado: EstadoRuta): AppBadgeTone {
  switch (estado) {
    case EstadoRuta.ACTIVO:
    case EstadoRuta.COMPLETADO:
      return "success";

    case EstadoRuta.ASIGNADA:
      return "info";

    case EstadoRuta.EN_CURSO:
      return "primary";

    case EstadoRuta.PENDIENTE:
      return "warning";

    case EstadoRuta.CERRADO:
    case EstadoRuta.INACTIVO:
    default:
      return "neutral";
  }
}

function RutaMetric({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-2 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.22] px-2.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {icon}
        </span>

        <span className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function RutasEditFormCard({
  ruta,
  cobradorOptions,
  selectedCount,
  totalACobrar,
  isSaving = false,
  onCancel,
}: RutasEditFormCardProps) {
  const {
    watch,
    formState: { isDirty, isSubmitting },
  } = useFormContext<RutaEditFormValues>();

  const estadoRuta = watch("estadoRuta");

  /*
   * isSubmitting pertenece a RHF.
   * NO debemos usarlo para disabled de campos registrados,
   * porque RHF puede excluir campos disabled del payload.
   */
  const isBusy = isSubmitting || isSaving;

  /*
   * Los campos solo se bloquean cuando la mutation ya está
   * ejecutándose. Para entonces RHF ya construyó `values`.
   */
  const areFieldsDisabled = isSaving;

  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      title={`Editar ruta #${ruta.id}`}
      description="Actualiza los datos generales de la ruta."
      icon={<MapPinned size={15} />}
      action={
        <AppBadge
          tone={getEstadoRutaTone(estadoRuta)}
          appearance="soft"
          size="xs"
          radius="full"
        >
          {RUTA_EDIT_ESTADO_LABELS[estadoRuta] ?? estadoRuta}
        </AppBadge>
      }
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AppButton
            type="button"
            variant="ghost"
            size="xs"
            disabled={isBusy}
            onClick={onCancel}
          >
            Cancelar
          </AppButton>

          <AppFormSubmit<RutaEditFormValues>
            variant="primary"
            size="xs"
            leftIcon={<Save size={13} />}
            loadingText="Guardando..."
            disableWhenInvalid
            disabled={isSaving || !isDirty || selectedCount === 0}
          >
            Guardar cambios
          </AppFormSubmit>
        </div>
      }
      footerDivider
    >
      <AppGrid cols={{ base: 1, md: 12 }} gap="xs">
        <AppGridItem span={{ base: "full", md: 4 }}>
          <AppFormInput<RutaEditFormValues>
            name="nombreRuta"
            label="Nombre de la ruta"
            placeholder="Nombre de ruta"
            size="xs"
            fieldWidth="full"
            required
            disabled={areFieldsDisabled}
          />
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 4 }}>
          <AppFormSingleSelect<RutaEditFormValues, string>
            name="cobradorId"
            label="Cobrador asignado"
            options={cobradorOptions}
            placeholder="Seleccionar cobrador..."
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable
            isDisabled={areFieldsDisabled}
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 4 }}>
          <AppFormSingleSelect<RutaEditFormValues, EstadoRuta>
            name="estadoRuta"
            label="Estado de la ruta"
            options={RUTA_EDIT_ESTADO_OPTIONS}
            placeholder="Seleccionar estado..."
            size="xs"
            density="compact"
            fieldWidth="full"
            isClearable={false}
            isDisabled={areFieldsDisabled}
            portalToBody
            menuPosition="fixed"
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
          />
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 3 }}>
          <AppField label="Clientes">
            <RutaMetric icon={<Users size={13} />} label="Seleccionados">
              <AppBadge tone="info" appearance="soft" size="xs" radius="full">
                {selectedCount}
              </AppBadge>
            </RutaMetric>
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 3 }}>
          <AppField label="Total estimado">
            <RutaMetric icon={<DollarSign size={13} />} label="A cobrar">
              <span className="text-[11px] font-semibold tabular-nums">
                {formattMonedaGT(totalACobrar)}
              </span>
            </RutaMetric>
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 3 }}>
          <AppField label="Creada">
            <RutaMetric icon={<CalendarDays size={13} />} label="Fecha">
              <span className="text-[10px] font-medium">
                {formattShortFecha(ruta.fechaCreacion)}
              </span>
            </RutaMetric>
          </AppField>
        </AppGridItem>

        <AppGridItem span={{ base: "full", md: 3 }}>
          <AppField label="Actualizada">
            <RutaMetric icon={<CalendarDays size={13} />} label="Fecha">
              <span className="text-[10px] font-medium">
                {formattShortFecha(ruta.fechaActualizacion)}
              </span>
            </RutaMetric>
          </AppField>
        </AppGridItem>

        <AppGridItem span="full">
          <AppFormTextarea<RutaEditFormValues>
            name="observaciones"
            label="Observaciones"
            placeholder="Comentarios u observaciones de la ruta..."
            rows={3}
            size="xs"
            fieldWidth="full"
            disabled={areFieldsDisabled}
            className="min-h-[70px] resize-y"
          />
        </AppGridItem>
      </AppGrid>
    </AppCard>
  );
}
