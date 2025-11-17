"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { type MultiValue } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";
import { useGetSectores } from "../CrmRutas/hooks/Sectores/useGetSectores";
import { useGetDepartamentos } from "../CrmRutas/hooks/Departamentos/useGetDepartamentos";
import { useGetMunicipios } from "../CrmRutas/hooks/Municipios/useGetMunicipios";
import { useGetCustomer } from "../CrmRutas/hooks/Client/useGetClient";
import { useGetServicios } from "../CrmRutas/hooks/Servicios/useGetServicios";
import { useGetServiciosWifi } from "../CrmRutas/hooks/ServiciosWfi/useGetServiciosWifi";
import { useGetZonasFacturacion } from "../CrmRutas/hooks/Zonas-facturacion/useGetZonasFacturacion";
import { UpdateCustomerDto } from "../features/update-customer/update-customer";
import { useUpdateCustomer } from "../CrmRutas/hooks/useUpdateCustomer/useUpdateCustomer";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { AdvancedDialogCRM } from "../_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { useDeleteCustomer } from "../CrmRutas/hooks/useDeleteCustomer/useDeleteCustomer";
import { OptionSelected } from "../features/OptionSelected/OptionSelected";
import { CustomerEditFormCard } from "./CustomerEditFormCard";
import { ReusableTabs } from "../Utils/Components/tabs/reusable-tabs";
import { PageHeaderCrm } from "../_Utils/components/PageHeader/PageHeaderCrm";
import ImagesCustomer from "../CrmCustomer/newCustomerPage/ImagesCustomer";
import { CustomerImage } from "../features/customer-galery/customer-galery.interfaces";

interface FormData {
  // Datos básicos
  nombre: string;
  coordenadas: string;
  ip: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  // Datos del servicio
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: Date | null;
  asesorId: string | null;
  servicioId: string | null;
  municipioId: string | null;
  departamentoId: string | null;
  empresaId: string;

  mascara: string;
  gateway: string;
  estado: EstadoCliente;
  enviarRecordatorio: boolean;
}

interface ContratoID {
  clienteId: number;
  idContrato: string; //UNIQUE EL CAMPO
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

function EditCustomers() {
  const { customerId } = useParams();
  const id = customerId ? parseInt(customerId) : 0;
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [fechaInstalacion, setFechaInstalacion] = useState<Date | null>(
    new Date()
  );

  const [depaSelected, setDepaSelected] = useState<number | null>(null);
  const [muniSelected, setMuniSelected] = useState<number | null>(null);
  const [serviceSelected, setServiceSelected] = useState<number[]>([]);
  const [serviceWifiSelected, setServiceWifiSelected] = useState<number | null>(
    null
  );
  const [zonasFacturacionSelected, setZonasFacturacionSelected] = useState<
    number | null
  >(null);
  const [sectorSelected, setSectorSelected] = useState<number | null>(null);
  // Estados para los campos del formulario
  const [formData, setFormData] = useState<FormData>({
    // Datos básicos
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

  const [formDataContrato, setFormDataContrato] = useState<ContratoID>({
    archivoContrato: "",
    clienteId: 0,
    fechaFirma: new Date(),
    idContrato: "",
    observaciones: "",
  });

  const { data: customer } = useGetCustomer(id);

  const { data: zonasFacturacion } = useGetZonasFacturacion();
  const { data: serviciosWifi } = useGetServiciosWifi();
  const { data: servicios } = useGetServicios();
  const { data: sectores } = useGetSectores();
  const { data: departamentos } = useGetDepartamentos();
  const { data: municipios } = useGetMunicipios(depaSelected);
  const updateCustomer = useUpdateCustomer(id);
  const deleteCustomer = useDeleteCustomer(id);

  //datos seguros
  const secureSectores = sectores ? sectores : [];
  const secureDepartamentos = departamentos ? departamentos : [];
  const secureMunicipios = municipios ? municipios : [];
  const secureServicios = servicios ? servicios : [];

  const secureServiciosWifi = serviciosWifi ? serviciosWifi : [];
  const secureZonasFacturacion = zonasFacturacion ? zonasFacturacion : [];

  const secureImages: CustomerImage[] = Array.isArray(customer?.imagenes)
    ? customer!.imagenes.map((img) => ({
        id: img.id,
        categoria: img.categoria,
        cdnUrl: img.cdnUrl,
        descripcion: img.descripcion,
        estado: img.estado,
        titulo: img.titulo,
        etiqueta: img.etiqueta,
        customerId: img.customerId,
      }))
    : [];

  const optionsDepartamentos: OptionSelected[] = secureDepartamentos.map(
    (depa) => ({
      value: depa.id,
      label: depa.nombre,
    })
  );

  const optionsMunis: OptionSelected[] = secureMunicipios.map((muni) => ({
    value: muni.id,
    label: muni.nombre,
  }));

  const optionsServices: OptionSelected[] = secureServicios.map((service) => ({
    value: service.id,
    label: service.nombre,
  }));

  const optionsServicesWifi: OptionSelected[] = secureServiciosWifi.map(
    (service) => ({
      value: service.id,
      label: service.nombre,
    })
  );

  const optionsZonasFacturacion: OptionSelected[] = secureZonasFacturacion.map(
    (zona) => ({
      value: zona.id, // 👈 number directo
      label: `${zona.nombre} Clientes: (${zona.clientesCount}) Facturas:(${zona.facturasCount})`,
    })
  );

  const optionsSectores: OptionSelected[] = secureSectores.map((sector) => ({
    value: sector.id, // 👈 number directo
    label: sector.nombre,
  }));

  const handleSelectDepartamento = (selectedOption: OptionSelected | null) => {
    setDepaSelected(selectedOption ? Number(selectedOption.value) : null);
  };

  const handleSelectMunicipio = (selectedOption: OptionSelected | null) => {
    setMuniSelected(selectedOption ? Number(selectedOption.value) : null);
  };

  const handleEnviarRecordatorioChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      enviarRecordatorio: checked,
    }));
  };

  const handleSelectService = (
    selectedOption: MultiValue<OptionSelected> | null
  ) => {
    setServiceSelected(
      selectedOption ? selectedOption.map((option) => Number(option.value)) : []
    );
  };

  const handleSelectServiceWifi = (selectedOption: OptionSelected | null) => {
    setServiceWifiSelected(
      selectedOption ? Number(selectedOption.value) : null
    );
  };

  const handleSelectSector = (selectedOption: OptionSelected | null) => {
    setSectorSelected(selectedOption ? Number(selectedOption.value) : null);
  };

  const handleSelectZonaFacturacion = (
    selectedOption: OptionSelected | null
  ) => {
    setZonasFacturacionSelected(
      selectedOption ? Number(selectedOption.value) : null
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDataContrato = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDataContrato((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const payload: UpdateCustomerDto = {
      id: Number(customerId),
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      ip: formData.ip.trim(),
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
      dpi: formData.dpi.trim(),
      observaciones: formData.observaciones.trim(),
      contactoReferenciaNombre: formData.contactoReferenciaNombre.trim(),
      contactoReferenciaTelefono: formData.contactoReferenciaTelefono.trim(),
      contrasenaWifi: formData.contrasenaWifi.trim(),
      ssidRouter: formData.ssidRouter.trim(),
      fechaInstalacion,
      municipioId: muniSelected ?? null,
      departamentoId: depaSelected ?? null,
      sectorId: sectorSelected ?? null,
      empresaId: 1,
      coordenadas:
        formData.coordenadas && formData.coordenadas !== ""
          ? formData.coordenadas.split(",").map((item) => item.trim())
          : [],
      servicesIds: serviceSelected,
      servicioWifiId: serviceWifiSelected ?? null,
      zonaFacturacionId: zonasFacturacionSelected ?? null,
      gateway: formData.gateway.trim(),
      mascara: formData.mascara.trim(),
      idContrato: formDataContrato.idContrato,
      fechaFirma: formDataContrato.fechaFirma,
      archivoContrato: formDataContrato.archivoContrato,
      observacionesContrato: formDataContrato.observaciones,
      estado: formData.estado,
      enviarRecordatorio: formData.enviarRecordatorio,
    };

    toast.promise(updateCustomer.mutateAsync(payload), {
      loading: "Cargando...",
      success: "Cliente actualizado",
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const handleDeleteCustomer = () => {
    if (!id) {
      toast.warning("ID de cliente no válido");
      return;
    }

    toast.promise(deleteCustomer.mutateAsync(), {
      loading: "Eliminando cliente....",
      success: "Cliente eliminado",
      error: (error) => getApiErrorMessageAxios(error),
    });
    setTimeout(() => {
      navigate("/crm-clientes");
    }, 1000);
  };

  const handleSelectEstadoCliente = (value: EstadoCliente) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            estado: value,
          }
        : prev
    );
  };

  useEffect(() => {
    if (!customer) return;

    setFormData({
      nombre: customer.nombre || "",
      apellidos: customer.apellidos || "",
      telefono: customer.telefono || "",
      direccion: customer.direccion || "",
      dpi: customer.dpi || "",
      observaciones: customer.observaciones || "",
      contactoReferenciaNombre: customer.contactoReferenciaNombre || "",
      contactoReferenciaTelefono: customer.contactoReferenciaTelefono || "",
      coordenadas: customer.coordenadas ? customer.coordenadas.join(", ") : "",
      ip: customer.ip || "",
      gateway: customer.gateway || "",
      mascara: customer.mascara || "",
      contrasenaWifi: customer.contrasenaWifi || "",
      ssidRouter: customer.ssidRouter || "",
      fechaInstalacion: customer.fechaInstalacion
        ? new Date(customer.fechaInstalacion)
        : null,
      asesorId: "",
      servicioId: "",
      municipioId: customer.municipio?.id?.toString() || "",
      departamentoId: customer.departamento?.id?.toString() || "",
      empresaId: "1",
      estado: customer.estado,
      enviarRecordatorio: customer.enviarRecordatorio,
    });

    if (customer.fechaInstalacion) {
      setFechaInstalacion(new Date(customer.fechaInstalacion));
    }

    setDepaSelected(customer.departamento?.id ?? null);
    setMuniSelected(customer.municipio?.id ?? null);
    setSectorSelected(customer.sector?.id ?? null);

    setServiceSelected(customer.servicios?.map((s) => s.id) ?? []);

    setServiceWifiSelected(customer.servicioWifi?.id ?? null);
    setZonasFacturacionSelected(customer.zonaFacturacion?.id ?? null);

    if (customer.contrato) {
      setFormDataContrato({
        clienteId: customer.id,
        idContrato: customer.contrato.idContrato || "",
        fechaFirma: customer.contrato.fechaFirma
          ? new Date(customer.contrato.fechaFirma)
          : new Date(),
        archivoContrato: customer.contrato.archivoContrato || "",
        observaciones: customer.contrato.observaciones || "",
      });
    }
  }, [customer]);

  const tabs = [
    {
      value: "General",
      label: "General",
      content: (
        <CustomerEditFormCard
          handleEnviarRecordatorioChange={handleEnviarRecordatorioChange}
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
          secureDepartamentos={secureDepartamentos}
          secureMunicipios={secureMunicipios}
          secureSectores={secureSectores}
          secureServiciosWifi={secureServiciosWifi}
          secureZonasFacturacion={secureZonasFacturacion}
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
          onClickDelete={() => setOpenDelete(true)}
          onClickOpenConfirm={() => setOpenConfirm(true)}
          handleChangeDataContrato={handleChangeDataContrato}
          setFormDataContrato={setFormDataContrato}
        />
      ),
    },
    {
      value: "Imágenes",
      label: "Imágenes",
      content: (
        <ImagesCustomer
          clienteId={id}
          empresaId={1}
          imagenesCliente={secureImages || []}
        />
      ),
    },
  ];
  console.log("La data del cliente: ", customer);
  console.log("La formData del cliente: ", formData);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full px-2"
    >
      <PageHeaderCrm title="Edición de cliente" fallbackBackTo="/" />
      <ReusableTabs
        className=""
        tabs={tabs}
        variant="compact"
        defaultValue="General"
      />

      {/* Tus dialogs se quedan en el padre */}
      <AdvancedDialogCRM
        type="info"
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Confirmación de actualización"
        description="¿Estás seguro de que deseas actualizar este cliente con los datos proporcionados?"
        confirmButton={{
          label: "Si, actualizar cliente",
          disabled: updateCustomer.isPending,
          loading: updateCustomer.isPending,
          onClick: handleSubmit,
          loadingText: "Actualizando cliente...",
          variant: "destructive",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: updateCustomer.isPending,
          onClick: () => setOpenConfirm(false),
        }}
      />

      <AdvancedDialogCRM
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Confirmación de eliminación"
        description="Por favor, revisa cuidadosamente los datos antes de proceder. Los datos relacionados a este cliente podrían perderse"
        confirmButton={{
          label: "Sí, eliminar cliente",
          disabled: deleteCustomer.isPending,
          loading: deleteCustomer.isPending,
          onClick: handleDeleteCustomer,
          loadingText: "Eliminando cliente...",
          variant: "destructive",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: deleteCustomer.isPending,
          onClick: () => setOpenDelete(false),
        }}
      />
    </motion.div>
  );
}

export default EditCustomers;
