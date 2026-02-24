"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

import { PersonalInfoSection } from "./personal-info-section";
import { NetworkConfigSection } from "./network-config-section";
import { ServiceInfoSection } from "./service-info-section";
import { LocationSection } from "./location-section";
import { StatusBillingSection } from "./status-billing-section";
// import { ContractSection } from "./contract-section";
import { ObservationsSection } from "./observations-section";
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
import type { Dispatch, SetStateAction } from "react";
import {
  EstadoCliente,
  Sector,
} from "../features/cliente-interfaces/cliente-types";
import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
import { MikrotikSection } from "./mikrotik-section";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";

// ========= Props del componente principal =========
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
  // formDataContrato,

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
  handleEnviarRecordatorioChange,
  handleSelectMk,
  // handleChangeDataContrato,
  // setFormDataContrato,
  onClickDelete,
  onClickOpenConfirm,
  setOpenUpdNet,
  setOpenAuth,
  isInstalation,
}: CustomerEditFormCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* SECCIÓN 1: DATOS PRINCIPALES */}
          <section
            aria-labelledby="section-datos-principales"
            className="space-y-4"
          >
            <div id="section-datos-principales" className="sr-only">
              Datos personales, servicio y ubicación
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </section>

          {/* SECCIÓN 2: ESTADO + WHATSAPP + FACTURACIÓN */}
          <StatusBillingSection
            formData={formData}
            fechaInstalacion={fechaInstalacion}
            zonasFacturacionSelected={zonasFacturacionSelected}
            optionsZonasFacturacion={optionsZonasFacturacion}
            secureZonasFacturacion={secureZonasFacturacion}
            onSelectEstadoCliente={onSelectEstadoCliente}
            onEnviarRecordatorioChange={handleEnviarRecordatorioChange}
            onSelectZonaFacturacion={onSelectZonaFacturacion}
            onChangeFechaInstalacion={onChangeFechaInstalacion}
          />

          {/* SECCIÓN 3: CONFIGURACIÓN DE RED (IP + MK) - CRÍTICO */}
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

          <MikrotikSection
            // isInstalation={isInstalation}
            // setOpenAuth={setOpenAuth}
            // setOpenUpdNet={setOpenUpdNet}
            // formData={formData}
            mkSelected={mkSelected}
            mikrotiks={mikrotiks}
            optionsMikrotiks={optionsMikrotiks}
            // onChangeForm={onChangeForm}
            onSelectMk={handleSelectMk}
          />

          {/* SECCIÓN 4: CONTRATO */}
          {/* <ContractSection
            formDataContrato={formDataContrato}
            onChangeContrato={handleChangeDataContrato}
            setFormDataContrato={setFormDataContrato}
          /> */}

          {/* SECCIÓN 5: OBSERVACIONES */}
          <ObservationsSection
            observaciones={formData.observaciones}
            onChangeForm={onChangeForm}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button type="button" variant="destructive" onClick={onClickDelete}>
          <X className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
        <Button
          type="button"
          onClick={onClickOpenConfirm}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </CardFooter>
    </Card>
  );
}
