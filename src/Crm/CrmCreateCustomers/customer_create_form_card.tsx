"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

import {
  EstadoCliente,
  Sector,
  ServiciosInternet,
} from "../features/cliente-interfaces/cliente-types";
import {
  ContractSection,
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
// import type { FormData } from "../CrmNewCustomerEdition/customer-form-types";
import type { OptionSelected } from "../CrmNewCustomerEdition/customer-form-types";
// import {
//   Departamentos,
//   Municipios,
// } from "../features/locations-interfaces/municipios_departamentos.interfaces";
// import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";
import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
// import { NuevaFacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
interface contradoID {
  clienteId: number;
  idContrato: string; //UNIQUE EL CAMPO
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

interface CustomerCreateFormCardProps {
  formData: FormData;
  formDataContrato: contradoID;
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

  onSubmit: () => void;
  isSubmitting: boolean;

  secureDepartamentos: Departamentos[];
  secureMunicipios: Municipios[];
  secureSectores: Sector[];
  secureServiciosWifi: ServiciosInternet[];
  secureZonasFacturacion: FacturacionZona[];
  mikrotiks: any[]; // O el tipo MikrotikRoutersResponse[]
  optionsMikrotiks: OptionSelected[]; // Aunque vaya vacío
}

export function CustomerCreateFormCard({
  formData,
  formDataContrato,
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
  onChangeContrato,
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
  //
  secureDepartamentos,
  secureMunicipios,
  secureSectores,
  secureServiciosWifi,
  secureZonasFacturacion,
  //   mikrotiks,
  //   optionsMikrotiks,
}: CustomerCreateFormCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* SECCIÓN 1 */}
          <section className="space-y-4">
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
                // CORRECCIÓN: Pasa la prop que recibes
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

          {/* SECCIÓN 2 */}
          <StatusBillingSection
            formData={formData}
            fechaInstalacion={fechaInstalacion}
            zonasFacturacionSelected={
              zonasFacturacionSelected ? Number(zonasFacturacionSelected) : null
            }
            optionsZonasFacturacion={optionsZonasFacturacion}
            // secureZonasFacturacion={secureZonasFacturacion}
            onSelectEstadoCliente={onSelectEstadoCliente}
            onEnviarRecordatorioChange={() => {}}
            onSelectZonaFacturacion={onSelectZonaFacturacion}
            onChangeFechaInstalacion={onChangeFechaInstalacion}
            secureZonasFacturacion={secureZonasFacturacion}
          />

          {/* SECCIÓN 3 */}
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
          />

          {/* SECCIÓN 4 */}
          <ContractSection
            formDataContrato={formDataContrato}
            onChangeContrato={onChangeContrato}
            setFormDataContrato={() => {}}
          />

          {/* SECCIÓN 5 */}
          <ObservationsSection
            observaciones={formData.observaciones}
            onChangeForm={onChangeForm}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Creando..." : "Crear Cliente"}
        </Button>
      </CardFooter>
    </Card>
  );
}
