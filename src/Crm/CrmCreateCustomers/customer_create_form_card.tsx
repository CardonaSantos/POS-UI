"use client";

import * as React from "react";
import {
  Cable,
  ClipboardList,
  HardHat,
  MapPinned,
  Network,
  Router,
  Save,
  UserRound,
  Wifi,
} from "lucide-react";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppField } from "@/components/app/primitives/app-field";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSwitch } from "@/components/app/primitives/app-switch";
import {
  useAppAsyncAction,
  useAppStateHandlers,
} from "@/components/app/handlers";

import {
  EstadoCliente,
  Sector,
  ServiciosInternet,
} from "../features/cliente-interfaces/cliente-types";
import {
  FormChangeHandler,
  FormData,
  LocationSection,
  MultiSelectHandler,
  NetworkConfigSection,
  ObservationsSection,
  PersonalInfoSection,
  SelectHandler,
  ServiceInfoSection,
  StatusBillingSection,
} from "../CrmNewCustomerEdition";
import type { OptionSelected } from "../CrmNewCustomerEdition/customer-form-types";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";
import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
import { MikrotikSection } from "../CrmNewCustomerEdition/mikrotik-section";

interface ContratoId {
  clienteId: number;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

interface CustomerCreateFormCardProps {
  formData: FormData;
  formDataContrato: ContratoId;
  fechaInstalacion: Date | null;

  depaSelected: number | null;
  muniSelected: number | null;
  sectorSelected: number | null;
  serviceSelected: number[];
  serviceWifiSelected: number | null;
  zonasFacturacionSelected: number | null;

  optionsDepartamentos: OptionSelected[];
  optionsMunis: OptionSelected[];
  optionsServices: OptionSelected[];
  optionsServicesWifi: OptionSelected[];
  optionsZonasFacturacion: OptionSelected[];
  optionsSectores: OptionSelected[];

  onChangeForm: FormChangeHandler;
  onChangeContrato: FormChangeHandler;

  onSelectDepartamento: SelectHandler<OptionSelected>;
  onSelectMunicipio: SelectHandler<OptionSelected>;
  onSelectSector: SelectHandler<OptionSelected>;
  onSelectService: MultiSelectHandler<OptionSelected>;
  onSelectServiceWifi: SelectHandler<OptionSelected>;
  onSelectZonaFacturacion: SelectHandler<OptionSelected>;

  onChangeFechaInstalacion: (date: Date | null) => void;
  onSelectEstadoCliente: (estado: EstadoCliente) => void;

  onSubmit: () => void | Promise<void>;
  isSubmitting: boolean;

  secureDepartamentos: Departamentos[];
  secureMunicipios: Municipios[];
  secureSectores: Sector[];
  secureServiciosWifi: ServiciosInternet[];
  secureZonasFacturacion: FacturacionZona[];

  mikrotiks: any[];
  mkSelected: number | null;
  handleSelectMk: (selectedOption: OptionSelected | null) => void;
  optionsMikrotiks: OptionSelected[];

  handleChangeSwitch: (value: boolean) => void;
}

type CustomerCreateTab = "cliente" | "red" | "instalacion";

const CUSTOMER_CREATE_TABS: Array<{
  value: CustomerCreateTab;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "cliente",
    label: "Cliente",
    description: "Datos, servicio, ubicación y facturación",
    icon: <UserRound size={14} />,
  },
  {
    value: "red",
    label: "Red",
    description: "IP, MikroTik y observaciones",
    icon: <Network size={14} />,
  },
  {
    value: "instalacion",
    label: "Instalación",
    description: "Técnico, ONU, óptico y evidencias",
    icon: <HardHat size={14} />,
  },
];

function CustomerCreateTabButton({
  tab,
  active,
  onClick,
}: {
  tab: (typeof CUSTOMER_CREATE_TABS)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-[42px] min-w-0 items-center gap-2 rounded-[var(--app-radius-md)] border px-3 py-2 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--app-ring,var(--ring)))]",
        active
          ? "border-[hsl(var(--app-primary))] bg-[hsl(var(--app-primary)/0.1)] text-[hsl(var(--app-primary))]"
          : "border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-background,var(--background)))] text-[hsl(var(--app-foreground,var(--foreground)))] hover:bg-[hsl(var(--app-muted,var(--muted))/0.45)]",
      ].join(" ")}
    >
      <span className="shrink-0">{tab.icon}</span>

      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold leading-4">
          {tab.label}
        </span>
        <span className="block truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {tab.description}
        </span>
      </span>
    </button>
  );
}

function CustomerFormSectionTitle({
  icon,
  title,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <AppInline
      align="center"
      justify="between"
      gap="sm"
      className="border-b border-[hsl(var(--app-border,var(--border)))] pb-2"
    >
      <AppInline align="center" gap="xs" className="min-w-0">
        <span className="text-[hsl(var(--app-primary))]">{icon}</span>
        <h3 className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          {title}
        </h3>
      </AppInline>

      {badge}
    </AppInline>
  );
}

function MikrotikActivationPanel({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-[var(--app-radius-md)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-3 py-2">
      <AppInline align="center" justify="between" gap="sm">
        <AppInline align="center" gap="xs" className="min-w-0">
          <Router
            size={15}
            className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
              Activar IP MikroTik
            </p>
            <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Crea o sincroniza la IP del cliente en el router seleccionado.
            </p>
          </div>
        </AppInline>

        <AppSwitch
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          size="sm"
          aria-label="Activar IP MikroTik"
        />
      </AppInline>
    </div>
  );
}

function InstallationPlaceholder() {
  return (
    <AppStack gap="md">
      <CustomerFormSectionTitle
        icon={<Cable size={15} />}
        title="Instalación"
        badge={
          <AppBadge tone="info" appearance="soft" size="xs">
            Próximamente
          </AppBadge>
        }
      />

      <AppAlert
        tone="info"
        title="Apartado preparado para instalación"
        description="Aquí se agregará la asignación de técnico, datos de ONU, potencia óptica, evidencias, autorización OLT y checklist de instalación."
        size="sm"
      />

      <AppGrid cols={{ base: 1, md: 3 }} gap="sm">
        <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-3">
          <p className="text-xs font-semibold">Técnico</p>
          <p className="mt-1 text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Asignación y agenda.
          </p>
        </div>

        <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-3">
          <p className="text-xs font-semibold">ONU / OLT</p>
          <p className="mt-1 text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            SN, autorización y estado óptico.
          </p>
        </div>

        <div className="rounded-[var(--app-radius-md)] border border-dashed border-[hsl(var(--app-border,var(--border)))] p-3">
          <p className="text-xs font-semibold">Evidencias</p>
          <p className="mt-1 text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Fotos, firma y notas técnicas.
          </p>
        </div>
      </AppGrid>
    </AppStack>
  );
}

export function CustomerCreateFormCard({
  formData,
  fechaInstalacion,
  depaSelected,
  muniSelected,
  sectorSelected,
  serviceSelected,
  serviceWifiSelected,
  zonasFacturacionSelected,
  optionsDepartamentos,
  optionsMunis,
  optionsServices,
  optionsServicesWifi,
  optionsZonasFacturacion,
  optionsSectores,
  onChangeForm,
  onSelectDepartamento,
  onSelectMunicipio,
  onSelectSector,
  onSelectService,
  onSelectServiceWifi,
  onSelectZonaFacturacion,
  onChangeFechaInstalacion,
  onSelectEstadoCliente,
  onSubmit,
  isSubmitting,
  secureDepartamentos,
  secureMunicipios,
  secureSectores,
  secureServiciosWifi,
  secureZonasFacturacion,
  mikrotiks,
  optionsMikrotiks,
  mkSelected,
  handleSelectMk,
  handleChangeSwitch,
}: CustomerCreateFormCardProps) {
  const ui = useAppStateHandlers({
    activeTab: "cliente" as CustomerCreateTab,
  });

  const submitAction = useAppAsyncAction(
    async () => {
      await onSubmit();
    },
    {
      preventConcurrent: true,
    },
  );

  const isBusy = isSubmitting || submitAction.isLoading;

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void submitAction.run();
    },
    [submitAction],
  );

  return (
    <AppCard
      variant="outline"
      size="sm"
      title="Crear cliente"
      description="Registro principal del cliente. La instalación queda preparada como apartado independiente."
      action={
        <AppBadge tone="primary" appearance="soft" size="xs">
          Nuevo registro
        </AppBadge>
      }
      className="overflow-hidden"
    >
      <form onSubmit={handleSubmit}>
        <AppStack gap="md">
          <AppGrid cols={{ base: 1, md: 3 }} gap="xs">
            {CUSTOMER_CREATE_TABS.map((tab) => (
              <CustomerCreateTabButton
                key={tab.value}
                tab={tab}
                active={ui.state.activeTab === tab.value}
                onClick={() => ui.setField("activeTab", tab.value)}
              />
            ))}
          </AppGrid>

          {ui.state.activeTab === "cliente" ? (
            <AppStack gap="lg">
              <section aria-labelledby="customer-basic-data">
                <CustomerFormSectionTitle
                  icon={<ClipboardList size={15} />}
                  title="Datos del cliente"
                />

                <div className="mt-4">
                  <AppGrid cols={{ base: 1, xl: 3 }} gap="md">
                    <PersonalInfoSection
                      formData={formData}
                      onChangeForm={onChangeForm}
                    />

                    <ServiceInfoSection
                      formData={formData}
                      serviceSelected={serviceSelected}
                      serviceWifiSelected={serviceWifiSelected}
                      optionsServices={optionsServices}
                      optionsServicesWifi={optionsServicesWifi}
                      secureServiciosWifi={secureServiciosWifi}
                      onChangeForm={onChangeForm}
                      onSelectService={onSelectService}
                      onSelectServiceWifi={onSelectServiceWifi}
                    />

                    <LocationSection
                      formData={formData}
                      depaSelected={depaSelected}
                      muniSelected={muniSelected}
                      sectorSelected={sectorSelected}
                      optionsDepartamentos={optionsDepartamentos}
                      optionsMunis={optionsMunis}
                      optionsSectores={optionsSectores}
                      secureDepartamentos={secureDepartamentos}
                      secureMunicipios={secureMunicipios}
                      secureSectores={secureSectores}
                      onChangeForm={onChangeForm}
                      onSelectDepartamento={onSelectDepartamento}
                      onSelectMunicipio={onSelectMunicipio}
                      onSelectSector={onSelectSector}
                    />
                  </AppGrid>
                </div>
              </section>

              <section aria-labelledby="customer-billing-data">
                <CustomerFormSectionTitle
                  icon={<MapPinned size={15} />}
                  title="Estado, fecha y facturación"
                />

                <div className="mt-4">
                  <StatusBillingSection
                    formData={formData}
                    fechaInstalacion={fechaInstalacion}
                    zonasFacturacionSelected={
                      zonasFacturacionSelected
                        ? Number(zonasFacturacionSelected)
                        : null
                    }
                    optionsZonasFacturacion={optionsZonasFacturacion}
                    onSelectEstadoCliente={onSelectEstadoCliente}
                    onEnviarRecordatorioChange={() => {}}
                    onSelectZonaFacturacion={onSelectZonaFacturacion}
                    onChangeFechaInstalacion={onChangeFechaInstalacion}
                    secureZonasFacturacion={secureZonasFacturacion}
                  />
                </div>
              </section>
            </AppStack>
          ) : null}

          {ui.state.activeTab === "red" ? (
            <AppStack gap="lg">
              <section aria-labelledby="customer-network-data">
                <CustomerFormSectionTitle
                  icon={<Network size={15} />}
                  title="Configuración de red"
                />

                <div className="mt-4">
                  <NetworkConfigSection
                    isInstalation={false}
                    setOpenAuth={() => {}}
                    setOpenUpdNet={() => {}}
                    formData={formData}
                    mkSelected={null}
                    mikrotiks={[]}
                    optionsMikrotiks={[]}
                    onChangeForm={onChangeForm}
                    onSelectMk={() => {}}
                    isCreation
                  />
                </div>
              </section>

              <section aria-labelledby="customer-mikrotik-data">
                <CustomerFormSectionTitle
                  icon={<Wifi size={15} />}
                  title="Router y sincronización"
                />

                <div className="mt-4">
                  <AppGrid cols={{ base: 1, lg: 2 }} gap="md">
                    <MikrotikSection
                      mikrotiks={mikrotiks}
                      optionsMikrotiks={optionsMikrotiks}
                      mkSelected={mkSelected}
                      onSelectMk={handleSelectMk}
                    />

                    <AppStack gap="sm">
                      <AppField
                        label="Sincronización MikroTik"
                        description="Activa la integración para registrar la IP del cliente en el router seleccionado."
                      >
                        <MikrotikActivationPanel
                          checked={Boolean(formData.activateOnMk)}
                          disabled={!mkSelected || isBusy}
                          onChange={handleChangeSwitch}
                        />
                      </AppField>

                      {!mkSelected ? (
                        <AppAlert
                          tone="warning"
                          size="sm"
                          title="Router no seleccionado"
                          description="Seleccione un MikroTik antes de activar la sincronización de IP."
                        />
                      ) : null}
                    </AppStack>
                  </AppGrid>
                </div>
              </section>

              <ObservationsSection
                observaciones={formData.observaciones}
                onChangeForm={onChangeForm}
              />
            </AppStack>
          ) : null}

          {ui.state.activeTab === "instalacion" ? (
            <InstallationPlaceholder />
          ) : null}

          <div className="-mx-4 -mb-4 border-t border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted))/0.18)] px-4 py-3">
            <AppInline align="center" justify="between" gap="sm" wrap>
              <p className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Complete los datos obligatorios antes de crear el cliente.
              </p>

              <AppButton
                type="submit"
                variant="primary"
                size="sm"
                width="auto"
                leftIcon={<Save size={15} />}
                loading={isBusy}
                loadingText="Creando..."
                disabled={isBusy}
              >
                Crear cliente
              </AppButton>
            </AppInline>
          </div>
        </AppStack>
      </form>
    </AppCard>
  );
}
