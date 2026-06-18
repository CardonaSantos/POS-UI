import { DollarSign, MapPin, Users } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppSingleSelect } from "@/components/app/primitives/app-single-select";
import { AppStack } from "@/components/app/primitives/app-stack";
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
    <div className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-[hsl(var(--app-border))] bg-[hsl(var(--app-background))] px-3">
      <AppInline gap="xs" align="center" wrap={false}>
        <span className="text-[hsl(var(--app-muted-foreground))]">{icon}</span>

        <span className="text-xs text-[hsl(var(--app-muted-foreground))]">
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
      size="sm"
      radius="md"
      className="overflow-visible p-2"
    >
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="sm" wrap>
          <AppInline gap="xs" align="center">
            <MapPin size={16} />
            <div className="min-w-0">
              <h2 className="text-sm font-semibold leading-none">
                Datos de la ruta
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--app-muted-foreground))]">
                Define la ruta, cobrador y clientes a cobrar.
              </p>
            </div>
          </AppInline>
        </AppInline>

        <AppGrid cols={{ base: 1, md: 2, xl: 12 }} gap="sm">
          <AppField
            label="Nombre de la ruta"
            required
            className="xl:col-span-3"
          >
            <AppInput
              value={form.nombreRuta}
              onChange={(event) =>
                onFieldChange("nombreRuta", event.target.value)
              }
              placeholder="Nombre de ruta"
              size="sm"
              fieldWidth="full"
              clearable
              onClear={() => onFieldChange("nombreRuta", "")}
            />
          </AppField>

          <AppField label="Cobrador asignado" className="xl:col-span-3">
            <AppSingleSelect<string>
              value={form.cobradorId}
              options={cobradorOptions}
              onChange={(value) => onFieldChange("cobradorId", value)}
              placeholder="Seleccionar cobrador..."
              size="sm"
              fieldWidth="full"
              isClearable
            />
          </AppField>

          <AppField label="Clientes" className="xl:col-span-2">
            <RutaMetricBox icon={<Users size={14} />} label="Seleccionados">
              <AppBadge tone="info" appearance="soft" size="xs" radius="full">
                {selectedCount}
              </AppBadge>
            </RutaMetricBox>
          </AppField>

          <AppField label="Total a cobrar" className="xl:col-span-2">
            <RutaMetricBox icon={<DollarSign size={14} />} label="Total">
              <span className="text-xs font-semibold">
                {formattMonedaGT(totalACobrar)}
              </span>
            </RutaMetricBox>
          </AppField>

          <AppField label="Acción" className="xl:col-span-2">
            <AppButton
              type="button"
              size="sm"
              variant="primary"
              width="full"
              loading={isSubmitting}
              loadingText="Creando..."
              disabled={!canCreate || isSubmitting}
              onClick={onOpenConfirm}
              className="h-9"
            >
              Crear ruta
            </AppButton>
          </AppField>

          <AppField
            label="Observaciones"
            className="md:col-span-2 xl:col-span-12"
          >
            <AppTextarea
              value={form.observaciones}
              onChange={(event) =>
                onFieldChange("observaciones", event.target.value)
              }
              placeholder="Comentarios..."
              rows={2}
              size="sm"
              fieldWidth="full"
              className="min-h-[56px]"
            />
          </AppField>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}
