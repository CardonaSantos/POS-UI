"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Check, X, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;
import { MultiValue } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { CustomerCreateFormCard } from "./customer_create_form_card";
import type { FormData } from "../CrmNewCustomerEdition/customer-form-types";
import type { OptionSelected } from "../CrmNewCustomerEdition/customer-form-types";
import { FacturacionZona } from "../features/zonas-facturacion/FacturacionZonaTypes";
import {
  Departamentos,
  Municipios,
} from "../features/locations-interfaces/municipios_departamentos.interfaces";
import {
  EstadoCliente,
  Sector,
} from "../features/cliente-interfaces/cliente-types";
import { ServiciosInternet } from "../CrmNewCustomerEdition/customer-form-types";

interface Servicios {
  id: number;
  nombre: string;
}

interface contradoID {
  clienteId: number;
  idContrato: string; //UNIQUE EL CAMPO
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

function CreateCustomers() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [departamentos, setDepartamentos] = useState<Departamentos[]>([]);
  const [municipios, setMunicipios] = useState<Municipios[]>([]);
  const [servicios, setServicios] = useState<Servicios[]>([]);
  const [zonasFacturacion, setZonasFacturacion] = useState<FacturacionZona[]>(
    [],
  );
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [serviciosWifi, setServiciosWifi] = useState<ServiciosInternet[]>([]);
  const [fechaInstalacion, setFechaInstalacion] = useState<Date | null>(
    new Date(),
  );
  const [depaSelected, setDepaSelected] = useState<number | null>(null);
  const [muniSelected, setMuniSelected] = useState<number | null>(null);
  const [serviceSelected, setSeriviceSelected] = useState<number[]>([]);
  const [serviceWifiSelected, setSeriviceWifiSelected] = useState<
    number | null
  >(null);
  const [zonasFacturacionSelected, setZonasFacturacionSelected] = useState<
    number | null
  >(null);
  const [sectorSelected, setSectorSelected] = useState<number | null>(null);

  const getDepartamentos = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/location/get-all-departamentos`,
      );

      if (response.status === 200) {
        setDepartamentos(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMunicipios = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/location/get-municipio/${Number(depaSelected)}`,
      );

      if (response.status === 200) {
        setMunicipios(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getServicios = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/servicio/get-servicios-to-customer`,
      );

      if (response.status === 200) {
        setServicios(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al conseguir servicios");
    }
  };

  const getServiciosWifi = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/servicio-internet/get-services-to-customer`,
      );

      if (response.status === 200) {
        setServiciosWifi(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al conseguir servicios wifi");
    }
  };

  const getFacturacionZona = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/facturacion-zona/get-zonas-facturacion-to-customer`,
      );

      if (response.status === 200) {
        setZonasFacturacion(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.info("Error al conseguir servicios wifi");
    }
  };

  const getSectores = async () => {
    try {
      const response = await axios.get(
        `${VITE_CRM_API_URL}/sector/sectores-to-select`,
      );

      if (response.status === 200) {
        setSectores(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDepartamentos();
    getServicios();
    getServiciosWifi();
    getFacturacionZona();
    getSectores();
  }, []);

  useEffect(() => {
    if (depaSelected) {
      getMunicipios();
    } else {
      setMunicipios([]);
      setMuniSelected(null);
    }
  }, [depaSelected]);

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

  const optionsZonasFacturacion: OptionSelected[] = zonasFacturacion
    .sort((a, b) => {
      const numA = parseInt(a.nombre.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.nombre.match(/\d+/)?.[0] || "0");
      return numA - numB;
    })
    .map((zona) => ({
      value: zona.id,
      label: `${zona.nombre} Clientes: (${zona.clientesCount}) Facturas:(${zona.facturasCount})`,
    }));

  // Manejar el cambio en el select de departamento
  const handleSelectDepartamento = (selectedOption: OptionSelected | null) => {
    setDepaSelected(selectedOption ? selectedOption.value : null);
  };

  // Manejar el cambio en el select de municipio
  const handleSelectMunicipio = (selectedOption: OptionSelected | null) => {
    setMuniSelected(selectedOption ? selectedOption.value : null);
  };

  const handleSelectSector = (selectedOption: OptionSelected | null) => {
    setSectorSelected(selectedOption ? selectedOption.value : null);
  };
  //manejar cambio en el select de mis servicios
  const handleSelectService = (
    selectedOption: MultiValue<OptionSelected> | null,
  ) => {
    setSeriviceSelected(
      selectedOption ? selectedOption.map((option) => option.value) : [],
    );
  };

  const handleSelectServiceWifi = (selectedOption: OptionSelected | null) => {
    setSeriviceWifiSelected(selectedOption ? selectedOption.value : null);
  };

  const handleSelectZonaFacturacion = (
    selectedOption: OptionSelected | null,
  ) => {
    setZonasFacturacionSelected(selectedOption ? selectedOption.value : null);
  };

  const [formData, setFormData] = useState<FormData>({
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
    fechaInstalacion: null as Date | null,
    asesorId: "",
    servicioId: "",
    municipioId: "",
    departamentoId: "",
    empresaId: "",
    estado: EstadoCliente.ACTIVO,
    enviarRecordatorio: true,
  });

  const [formDataContrado, setFormDataContrato] = useState<contradoID>({
    archivoContrato: "",
    clienteId: 0,
    fechaFirma: new Date(),
    idContrato: "".trim(),
    observaciones: "".trim(),
  });

  const handleChangeDataContrato = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormDataContrato((previaData) => ({
      ...previaData,
      [name]: value,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = {
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
      fechaInstalacion: fechaInstalacion,
      municipioId: Number(muniSelected) || null, // Convertir a número
      departamentoId: Number(depaSelected) || null, // Convertir a número
      sectorId: Number(sectorSelected) || null, // Convertir a número
      empresaId: 1,
      coordenadas:
        formData.coordenadas && formData.coordenadas !== ""
          ? formData.coordenadas.split(",").map((item) => item.trim())
          : [],

      servicesIds: serviceSelected.map((id) => Number(id)),
      servicioWifiId: Number(serviceWifiSelected),
      zonaFacturacionId: Number(zonasFacturacionSelected),
      //
      idContrato: formDataContrado.idContrato,
      fechaFirma: formDataContrado.fechaFirma,
      archivoContrato: formDataContrado.archivoContrato,
      observacionesContrato: formDataContrado.observaciones,
    };

    // Validar si municipio y departamento están seleccionados
    if (!formDataToSend.municipioId) {
      toast.info("Seleccione un municipio");
      return;
    }

    if (!formDataToSend.departamentoId) {
      toast.info("Seleccione un departamento");
      return;
    }

    if (!formDataToSend.zonaFacturacionId) {
      toast.warning("Debe agregar una zona de facturación");
      return;
    }

    if (!formDataToSend.servicioWifiId) {
      toast.warning("No puede crear un cliente sin asignarle un servicio");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${VITE_CRM_API_URL}/internet-customer/create-new-customer`,
        formDataToSend,
      );

      if (response.status === 201) {
        toast.success("Cliente creado");
        resetFormData();
        setOpenConfirm(false);
        setIsSubmitting(false);
      }

      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.info("Revise sus datos enviados");
      setIsSubmitting(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      nombre: "",
      coordenadas: "",
      ip: "",
      apellidos: "",
      telefono: "",
      direccion: "",
      dpi: "",
      observaciones: "",
      contactoReferenciaNombre: "",
      contactoReferenciaTelefono: "",
      contrasenaWifi: "",
      ssidRouter: "",
      fechaInstalacion: null,
      asesorId: "",
      servicioId: "",
      municipioId: "",
      departamentoId: "",
      empresaId: "",
      gateway: "",
      mascara: "",
      estado: EstadoCliente.ACTIVO,
      enviarRecordatorio: true,
    });

    // Resetear formDataContrato
    setFormDataContrato({
      archivoContrato: "",
      clienteId: 0,
      fechaFirma: new Date(),
      idContrato: "",
      observaciones: "",
    });
    // Resetear los selects
    setDepaSelected(null);
    setMuniSelected(null);
    setSectorSelected(null);
    setSeriviceSelected([]);
    setSeriviceWifiSelected(null);
    setZonasFacturacionSelected(null);
    setFechaInstalacion(new Date());
  };

  const handleSelectEstadoCliente = (value: EstadoCliente) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            estado: value,
          }
        : prev,
    );
  };

  return (
    <PageTransitionCrm
      titleHeader="Añadir nuevo cliente"
      subtitle={``}
      variant="fade-pure"
    >
      <CustomerCreateFormCard
        formData={formData}
        formDataContrato={formDataContrado}
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
        optionsMikrotiks={[]}
        secureDepartamentos={departamentos}
        secureMunicipios={municipios}
        secureSectores={sectores}
        secureServiciosWifi={serviciosWifi}
        secureZonasFacturacion={zonasFacturacion}
        mikrotiks={[]}
      />

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-xl border-0 shadow-xl">
          {/* Warning icon */}
          <div className="flex justify-center mt-6">
            <div className="rounded-full p-3 shadow-lg border-4 border-white">
              <div className="bg-amber-100 p-3 rounded-full animate-pulse">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Header */}
          <DialogHeader className="pt-8 px-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-center text-gray-800 dark:text-gray-400">
              Confirmación de Cliente
            </DialogTitle>
            <p className="text-center text-gray-600 text-sm mt-1 dark:text-gray-400">
              Por favor revise los datos antes de continuar
            </p>
          </DialogHeader>

          <div className="px-6 py-4">
            {/* Question card */}
            <div className="border border-gray-200 rounded-lg p-5 mb-5 bg-gray-50 shadow-inner dark:bg-stone-950">
              <h3 className="font-medium mb-2 text-gray-800 text-center dark:text-gray-400">
                ¿Estás seguro de que deseas crear este cliente con los datos
                proporcionados?
              </h3>
              <p className="text-sm text-gray-600 text-center dark:text-gray-400">
                Por favor, revisa cuidadosamente los datos antes de proceder.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-5"></div>

            {/* Action buttons */}
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
