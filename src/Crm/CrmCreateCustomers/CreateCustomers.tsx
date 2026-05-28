"use client";

import type React from "react";
import { useState } from "react";
import type { MultiValue } from "react-select";
import "react-datepicker/dist/react-datepicker.css";

import { AlertCircle, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import { CustomerCreateFormCard } from "./customer_create_form_card";

import type {
  FormData,
  OptionSelected,
} from "../CrmNewCustomerEdition/customer-form-types";

import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";

import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";

import { useCreateCustomer } from "../CrmHooks/hooks/Client/useGetClient";
import { useGetDepartamentos } from "../CrmHooks/hooks/Departamentos/useGetDepartamentos";
import { useGetMikroTiks } from "../CrmHooks/hooks/Mikrotik/useGetMikroTik";
import { useGetMunicipios } from "../CrmHooks/hooks/Municipios/useGetMunicipios";
import { useGetSectores } from "../CrmHooks/hooks/Sectores/useGetSectores";
import { useGetServicios } from "../CrmHooks/hooks/Servicios/useGetServicios";
import { useGetServiciosWifi } from "../CrmHooks/hooks/ServiciosWfi/useGetServiciosWifi";
import { useGetZonasFacturacion } from "../CrmHooks/hooks/use-zonas-facturacion/use-zonas-facturacion";

interface ContratoFormData {
  clienteId: number;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

const INITIAL_FORM_DATA: FormData = {
  nombre: "",
  coordenadas: "",
  ip: "",
  gateway: "",
  mascara: "",
  apellidos: "",
  telefono: "",
  direccion: "",
  dpi: "",
  observaciones: "",
  contactoReferenciaNombre: "",
  contactoReferenciaTelefono: "",

  // Datos del servicio
  contrasenaWifi: "",
  ssidRouter: "",
  fechaInstalacion: null,
  asesorId: "",
  servicioId: "",
  municipioId: "",
  departamentoId: "",
  empresaId: "",
  estado: EstadoCliente.ACTIVO,
  enviarRecordatorio: true,
  activateOnMk: false,
};

const INITIAL_CONTRATO_FORM_DATA: ContratoFormData = {
  archivoContrato: "",
  clienteId: 0,
  fechaFirma: new Date(),
  idContrato: "",
  observaciones: "",
};

function CreateCustomers() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const createCustomer = useCreateCustomer();
  const isSubmitting = createCustomer.isPending;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [fechaInstalacion, setFechaInstalacion] = useState<Date | null>(
    new Date(),
  );

  const [depaSelected, setDepaSelected] = useState<number | null>(null);
  const [muniSelected, setMuniSelected] = useState<number | null>(null);
  const [sectorSelected, setSectorSelected] = useState<number | null>(null);
  const [serviceSelected, setServiceSelected] = useState<number[]>([]);
  const [serviceWifiSelected, setServiceWifiSelected] = useState<number | null>(
    null,
  );

  const [zonasFacturacionSelected, setZonasFacturacionSelected] = useState<
    number | null
  >(null);
  const [mkSelected, setMkSelected] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [formDataContrato, setFormDataContrato] = useState<ContratoFormData>(
    INITIAL_CONTRATO_FORM_DATA,
  );
  // Queries
  const { data: mikrotiks = [] } = useGetMikroTiks();
  const { data: departamentos = [] } = useGetDepartamentos();
  const { data: municipios = [] } = useGetMunicipios(depaSelected);
  const { data: sectores = [] } = useGetSectores();
  const { data: serviciosWifi = [] } = useGetServiciosWifi();
  const { data: zonasFacturacion = [] } = useGetZonasFacturacion();
  const { data: servicios = [] } = useGetServicios();
  // Select options
  const optionsDepartamentos: OptionSelected[] = departamentos.map((depa) => ({
    value: depa.id,
    label: depa.nombre,
  }));

  const optionsMunis: OptionSelected[] = municipios.map((muni) => ({
    value: muni.id,
    label: muni.nombre,
  }));

  const optionsServices: OptionSelected[] = servicios.map((service) => ({
    value: service.id,
    label: service.nombre,
  }));

  const optionsMikrotiks: OptionSelected[] = mikrotiks.map((mk) => ({
    value: mk.id,
    label: mk.nombre,
  }));

  const optionsServicesWifi: OptionSelected[] = serviciosWifi.map(
    (service) => ({
      value: service.id,
      label: service.nombre,
    }),
  );

  const optionsSectores: OptionSelected[] = sectores.map((sector) => ({
    value: sector.id,
    label: sector.nombre,
  }));

  const optionsZonasFacturacion: OptionSelected[] = [...zonasFacturacion]
    .sort((a, b) => {
      const numA = Number.parseInt(a.nombre.match(/\d+/)?.[0] || "0");
      const numB = Number.parseInt(b.nombre.match(/\d+/)?.[0] || "0");

      return numA - numB;
    })
    .map((zona) => ({
      value: zona.id,
      label: `${zona.nombre} Clientes: (${zona.clientesCount}) Facturas:(${zona.facturasCount})`,
    }));
  // General form handlers

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeSwitch = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      activateOnMk: value,
    }));
  };

  const handleSelectEstadoCliente = (value: EstadoCliente) => {
    setFormData((prev) => ({
      ...prev,
      estado: value,
    }));
  };
  // Contrato handlers
  const handleChangeDataContrato = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormDataContrato((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectDepartamento = (selectedOption: OptionSelected | null) => {
    const departamentoId = selectedOption ? selectedOption.value : null;

    setDepaSelected(departamentoId);
    setMuniSelected(null);
  };

  const handleSelectMunicipio = (selectedOption: OptionSelected | null) => {
    setMuniSelected(selectedOption ? selectedOption.value : null);
  };

  const handleSelectSector = (selectedOption: OptionSelected | null) => {
    setSectorSelected(selectedOption ? selectedOption.value : null);
  };

  const handleSelectService = (
    selectedOptions: MultiValue<OptionSelected> | null,
  ) => {
    setServiceSelected(
      selectedOptions ? selectedOptions.map((option) => option.value) : [],
    );
  };

  const handleSelectServiceWifi = (selectedOption: OptionSelected | null) => {
    setServiceWifiSelected(selectedOption ? selectedOption.value : null);
  };

  const handleSelectZonaFacturacion = (
    selectedOption: OptionSelected | null,
  ) => {
    setZonasFacturacionSelected(selectedOption ? selectedOption.value : null);
  };

  const handleSelectMk = (selectedOption: OptionSelected | null) => {
    setMkSelected(selectedOption ? Number(selectedOption.value) : null);
  };
  // Helpers
  const resetFormData = () => {
    setFormData(INITIAL_FORM_DATA);

    setFormDataContrato({
      ...INITIAL_CONTRATO_FORM_DATA,
      fechaFirma: new Date(),
    });

    setDepaSelected(null);
    setMuniSelected(null);
    setSectorSelected(null);
    setServiceSelected([]);
    setServiceWifiSelected(null);
    setZonasFacturacionSelected(null);
    setMkSelected(null);
    setFechaInstalacion(new Date());
  };

  const buildCustomerPayload = () => {
    return {
      userId,

      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      ip: formData.ip.trim(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
      dpi: formData.dpi.trim(),
      observaciones: formData.observaciones.trim(),
      estado: formData.estado,

      contactoReferenciaNombre: formData.contactoReferenciaNombre.trim(),
      contactoReferenciaTelefono: formData.contactoReferenciaTelefono.trim(),

      contrasenaWifi: formData.contrasenaWifi.trim(),
      ssidRouter: formData.ssidRouter.trim(),

      fechaInstalacion,

      municipioId: Number(muniSelected) || null,
      departamentoId: Number(depaSelected) || null,
      sectorId: Number(sectorSelected) || null,

      empresaId: 1,

      coordenadas:
        formData.coordenadas && formData.coordenadas !== ""
          ? formData.coordenadas.split(",").map((item) => item.trim())
          : [],

      servicesIds: serviceSelected.map((id) => Number(id)),
      servicioWifiId: Number(serviceWifiSelected) || null,
      zonaFacturacionId: Number(zonasFacturacionSelected) || null,

      idContrato: formDataContrato.idContrato,
      fechaFirma: formDataContrato.fechaFirma,
      archivoContrato: formDataContrato.archivoContrato,
      observacionesContrato: formDataContrato.observaciones,

      mkSelected,
      activateOnMk: formData.activateOnMk,
    };
  };

  const validateCustomerPayload = (
    payload: ReturnType<typeof buildCustomerPayload>,
  ) => {
    if (!payload.departamentoId) {
      toast.info("Seleccione un departamento");
      return false;
    }

    if (!payload.municipioId) {
      toast.info("Seleccione un municipio");
      return false;
    }

    if (!payload.zonaFacturacionId) {
      toast.warning("Debe agregar una zona de facturación");
      return false;
    }

    if (!payload.servicioWifiId) {
      toast.warning("No puede crear un cliente sin asignarle un servicio");
      return false;
    }

    return true;
  };
  // Submit

  const handleSubmit = async () => {
    const formDataToSend = buildCustomerPayload();

    const isValid = validateCustomerPayload(formDataToSend);

    if (!isValid) return;

    try {
      await toast.promise(createCustomer.mutateAsync(formDataToSend), {
        loading: "Registrando usuario...",
        success: () => {
          resetFormData();
          setOpenConfirm(false);
          return "Cliente creado correctamente";
        },
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  return (
    <PageTransitionCrm
      titleHeader="Añadir nuevo cliente"
      subtitle=""
      variant="fade-pure"
    >
      <CustomerCreateFormCard
        formData={formData}
        formDataContrato={formDataContrato}
        fechaInstalacion={fechaInstalacion}
        depaSelected={depaSelected}
        muniSelected={muniSelected}
        sectorSelected={sectorSelected}
        serviceSelected={serviceSelected}
        serviceWifiSelected={serviceWifiSelected}
        zonasFacturacionSelected={zonasFacturacionSelected}
        optionsDepartamentos={optionsDepartamentos}
        optionsMunis={optionsMunis}
        optionsServices={optionsServices}
        optionsServicesWifi={optionsServicesWifi}
        optionsZonasFacturacion={optionsZonasFacturacion}
        optionsSectores={optionsSectores}
        optionsMikrotiks={optionsMikrotiks}
        secureDepartamentos={departamentos}
        secureMunicipios={municipios}
        secureSectores={sectores}
        secureServiciosWifi={serviciosWifi}
        secureZonasFacturacion={zonasFacturacion}
        mikrotiks={mikrotiks}
        mkSelected={mkSelected}
        onChangeForm={handleChange}
        onChangeContrato={handleChangeDataContrato}
        onSelectDepartamento={handleSelectDepartamento}
        onSelectMunicipio={handleSelectMunicipio}
        onSelectSector={handleSelectSector}
        onSelectService={handleSelectService}
        onSelectServiceWifi={handleSelectServiceWifi}
        onSelectZonaFacturacion={handleSelectZonaFacturacion}
        onChangeFechaInstalacion={setFechaInstalacion}
        onSelectEstadoCliente={handleSelectEstadoCliente}
        onSubmit={() => setOpenConfirm(true)}
        isSubmitting={isSubmitting}
        handleSelectMk={handleSelectMk}
        handleChangeSwitch={handleChangeSwitch}
      />

      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl">
          <div className="flex justify-center mt-6">
            <div className="rounded-full p-3 shadow-lg border-4 border-white">
              <div className="bg-amber-100 p-3 rounded-full animate-pulse">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </div>

          <DialogHeader className="pt-8 px-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-400">
              Confirmación de Cliente
            </DialogTitle>

            <p className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400">
              Por favor revise los datos antes de continuar
            </p>
          </DialogHeader>

          <div className="px-6 py-4">
            <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner dark:bg-stone-950">
              <h3 className="font-medium mb-2 text-gray-800 text-center dark:text-gray-400">
                ¿Estás seguro de que deseas crear este cliente con los datos
                proporcionados?
              </h3>

              <p className="text-sm text-gray-600 text-center dark:text-gray-400">
                Por favor, revisa cuidadosamente los datos antes de proceder.
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5" />

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 pb-2">
              <Button
                variant="outline"
                onClick={() => setOpenConfirm(false)}
                className="border border-gray-200 w-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg py-2.5 transition-all duration-200"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2.5 shadow-sm transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Crear Cliente
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageTransitionCrm>
  );
}

export default CreateCustomers;
