"use client";

import type { Dispatch, SetStateAction } from "react";
import { Save, Trash2, X } from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppStack } from "@/components/app/primitives/app-stack";

import { PersonalInfoSection } from "./personal-info-section";
import { NetworkConfigSection } from "./network-config-section";
import { ServiceInfoSection } from "./service-info-section";
import { LocationSection } from "./location-section";
import { StatusBillingSection } from "./status-billing-section";
import { ObservationsSection } from "./observations-section";
import { MikrotikSection } from "./mikrotik-section";

import type {
  FormData,
  ContratoID,
  OptionSelected,
  ServiciosInternet,
  MikrotikRoutersResponse,
  FormChangeHandler,
  SelectHandler,
  MultiSelectHandler,
} from "./customer-form-types";

import {
  EstadoCliente,
  EstadoCobranzaCliente,
  Sector,
} from "../features/cliente-interfaces/cliente-types";
import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";

export interface CustomerEditFormCardProps {
  formData: FormData;
  formDataContrato: ContratoID;
  fechaInstalacion: Date | null;

  depaSelected: number | null;
  muniSelected: number | null;
  sectorSelected: number | null;
  serviceSelected: number[];
  serviceWifiSelected: number | null;
  zonasFacturacionSelected: number | null;
  mkSelected: number | null;

  optionsDepartamentos: OptionSelected[];
  optionsMunis: OptionSelected[];
  optionsServices: OptionSelected[];
  optionsServicesWifi: OptionSelected[];
  optionsZonasFacturacion: OptionSelected[];
  optionsSectores: OptionSelected[];
  optionsMikrotiks: OptionSelected[];

  secureDepartamentos: Departamentos[];
  secureMunicipios: Municipios[];
  secureSectores: Sector[];
  secureServiciosWifi: ServiciosInternet[];
  secureZonasFacturacion: FacturacionZona[];
  mikrotiks: MikrotikRoutersResponse[];

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

  onSelectEstadoCobranza: (value: EstadoCobranzaCliente) => void;

  handleEnviarRecordatorioChange: (checked: boolean) => void;
  handleSelectMk: SelectHandler<OptionSelected>;
  handleChangeDataContrato: FormChangeHandler;
  setFormDataContrato: Dispatch<SetStateAction<ContratoID>>;

  onClickDelete: () => void;
  onClickOpenConfirm: () => void;
  setOpenUpdNet: () => void;
  setOpenAuth: () => void;
  isInstalation: boolean;
}

export function CustomerEditFormCard({
  formData,
  fechaInstalacion,
  depaSelected,
  muniSelected,
  sectorSelected,
  serviceSelected,
  serviceWifiSelected,
  zonasFacturacionSelected,
  mkSelected,
  optionsDepartamentos,
  optionsMunis,
  optionsServices,
  optionsServicesWifi,
  optionsZonasFacturacion,
  optionsSectores,
  optionsMikrotiks,
  secureDepartamentos,
  secureMunicipios,
  secureSectores,
  secureServiciosWifi,
  secureZonasFacturacion,
  mikrotiks,
  onChangeForm,
  onSelectDepartamento,
  onSelectMunicipio,
  onSelectSector,
  onSelectService,
  onSelectServiceWifi,
  onSelectZonaFacturacion,
  onChangeFechaInstalacion,
  onSelectEstadoCliente,
  onSelectEstadoCobranza,
  handleEnviarRecordatorioChange,
  handleSelectMk,
  onClickDelete,
  onClickOpenConfirm,
  setOpenUpdNet,
  setOpenAuth,
  isInstalation,
}: CustomerEditFormCardProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onClickOpenConfirm();
      }}
    >
      <AppCard
        variant="outline"
        size="xs"
        radius="md"
        className="overflow-visible p-2"
      >
        <AppStack gap="md">
          <section
            aria-labelledby="customer-edit-main-section"
            className="min-w-0"
          >
            <h2 id="customer-edit-main-section" className="sr-only">
              Datos personales, servicio y ubicación
            </h2>

            <AppGrid cols={{ base: 1, xl: 12 }} gap="sm">
              <div className="min-w-0 xl:col-span-4">
                <PersonalInfoSection
                  formData={formData}
                  onChangeForm={onChangeForm}
                />
              </div>

              <div className="min-w-0 xl:col-span-4">
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
              </div>

              <div className="min-w-0 xl:col-span-4">
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
              </div>
            </AppGrid>
          </section>

          <StatusBillingSection
            formData={formData}
            fechaInstalacion={fechaInstalacion}
            zonasFacturacionSelected={zonasFacturacionSelected}
            optionsZonasFacturacion={optionsZonasFacturacion}
            secureZonasFacturacion={secureZonasFacturacion}
            onSelectEstadoCliente={onSelectEstadoCliente}
            onSelectEstadoCobranza={onSelectEstadoCobranza}
            onEnviarRecordatorioChange={handleEnviarRecordatorioChange}
            onSelectZonaFacturacion={onSelectZonaFacturacion}
            onChangeFechaInstalacion={onChangeFechaInstalacion}
          />

          <AppGrid cols={{ base: 1, xl: 12 }} gap="sm">
            <div className="min-w-0 xl:col-span-7">
              <NetworkConfigSection
                isInstalation={isInstalation}
                setOpenAuth={setOpenAuth}
                setOpenUpdNet={setOpenUpdNet}
                formData={formData}
                mkSelected={mkSelected}
                mikrotiks={mikrotiks}
                optionsMikrotiks={optionsMikrotiks}
                onChangeForm={onChangeForm}
                onSelectMk={handleSelectMk}
                isCreation={false}
              />
            </div>

            <div className="min-w-0 xl:col-span-5">
              <MikrotikSection
                mkSelected={mkSelected}
                mikrotiks={mikrotiks}
                optionsMikrotiks={optionsMikrotiks}
                onSelectMk={handleSelectMk}
              />
            </div>
          </AppGrid>

          <ObservationsSection
            observaciones={formData.observaciones}
            onChangeForm={onChangeForm}
          />

          <AppSeparator spacing="xs" />

          <AppInline align="center" justify="between" gap="xs" wrap>
            <AppButton
              type="button"
              variant="danger"
              size="xs"
              width="auto"
              leftIcon={<Trash2 size={13} />}
              onClick={onClickDelete}
            >
              Eliminar
            </AppButton>

            <AppInline align="center" justify="end" gap="xs" wrap>
              <AppButton
                type="button"
                variant="secondary"
                size="xs"
                width="auto"
                leftIcon={<X size={13} />}
                onClick={() => window.history.back()}
              >
                Cancelar
              </AppButton>

              <AppButton
                type="submit"
                variant="primary"
                size="xs"
                width="auto"
                leftIcon={<Save size={13} />}
              >
                Guardar cambios
              </AppButton>
            </AppInline>
          </AppInline>
        </AppStack>
      </AppCard>
    </form>
  );
}
