import { DollarSign, MapPin, Users } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppTextarea } from "@/components/app/primitives/app-textarea";
import { formattMonedaGT } from "@/Crm/Utils/formattMonedaGT";
import { AppOption } from "@/Crm/CrmCustomers/customer-table.constants";

export type RutaCreateFormState = {
  nombreRuta: string;
  cobradorId: string | null;
  observaciones: string;
};

interface Props {
  form: RutaCreateFormState;
  cobradorOptions: AppOption[];
  selectedCount: number;
  totalACobrar: number;
  isSubmitting?: boolean;
  canCreate: boolean;

  onFieldChange: <K extends keyof RutaCreateFormState>(
    field: K,
    value: RutaCreateFormState[K],
  ) => void;
  onOpenConfirm: () => void;
}

function RutaMetricBox({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-8 w-full items-center justify-between gap-2 rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))/0.24] px-2.5">
      <AppInline gap="xs" align="center" wrap={false} className="min-w-0">
        <span className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {icon}
        </span>

        <span className="truncate text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {label}
        </span>
      </AppInline>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function RutasCreateFormCard({
  form,
  cobradorOptions,
  selectedCount,
  totalACobrar,
  isSubmitting,
  canCreate,
  onFieldChange,
  onOpenConfirm,
}: Props) {
  return (
    <AppCard
      variant="outline"
      size="xs"
      radius="md"
      className="overflow-visible px-2 py-2"
    >
      <AppGrid cols={{ base: 1, md: 12 }} gap="xs" className="items-end">
        <div className="md:col-span-12">
          <AppInline align="center" gap="xs" className="pb-1">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
              <MapPin size={13} />
            </span>

            <div className="min-w-0">
              <h2 className="truncate text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]">
                Datos de la ruta
              </h2>
              <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Define el nombre, cobrador y resumen de clientes seleccionados.
              </p>
            </div>
          </AppInline>
        </div>

        <div className="md:col-span-3">
          <AppField label="Nombre de la ruta" required>
            <AppInput
              value={form.nombreRuta}
              onChange={(event) =>
                onFieldChange("nombreRuta", event.target.value)
              }
              placeholder="Nombre de ruta"
              size="xs"
              fieldWidth="full"
              clearable
              onClear={() => onFieldChange("nombreRuta", "")}
              disabled={isSubmitting}
            />
          </AppField>
        </div>

        <div className="md:col-span-3">
          <AppField label="Cobrador asignado">
            <AppSingleSelect<string>
              value={form.cobradorId}
              options={cobradorOptions}
              onChange={(value) => onFieldChange("cobradorId", value ?? null)}
              placeholder="Seleccionar cobrador..."
              size="xs"
              density="compact"
              fieldWidth="full"
              isClearable
              isDisabled={isSubmitting}
              portalToBody
              menuPosition="fixed"
              menuPlacement="auto"
              menuShouldScrollIntoView={false}
            />
          </AppField>
        </div>

        <div className="md:col-span-2">
          <AppField label="Clientes">
            <RutaMetricBox icon={<Users size={13} />} label="Seleccionados">
              <AppBadge tone="info" appearance="soft" size="xs" radius="full">
                {selectedCount}
              </AppBadge>
            </RutaMetricBox>
          </AppField>
        </div>

        <div className="md:col-span-2">
          <AppField label="Total a cobrar">
            <RutaMetricBox icon={<DollarSign size={13} />} label="Total">
              <span className="text-[11px] font-semibold tabular-nums text-[hsl(var(--app-foreground,var(--foreground)))]">
                {formattMonedaGT(totalACobrar)}
              </span>
            </RutaMetricBox>
          </AppField>
        </div>

        <div className="md:col-span-2">
          <AppField label="Acción">
            <AppButton
              type="button"
              size="xs"
              variant="primary"
              width="full"
              loading={isSubmitting}
              loadingText="Creando..."
              disabled={!canCreate || isSubmitting}
              onClick={onOpenConfirm}
              className="h-8"
            >
              Crear ruta
            </AppButton>
          </AppField>
        </div>

        <div className="md:col-span-12">
          <AppField label="Observaciones">
            <AppTextarea
              value={form.observaciones}
              onChange={(event) =>
                onFieldChange("observaciones", event.target.value)
              }
              placeholder="Comentarios u observaciones de la ruta..."
              rows={2}
              size="xs"
              fieldWidth="full"
              disabled={isSubmitting}
              className="min-h-[52px] resize-y"
            />
          </AppField>
        </div>
      </AppGrid>
    </AppCard>
  );
}
