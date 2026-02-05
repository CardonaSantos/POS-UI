"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type MultiValue } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";
import { useGetSectores } from "../CrmHooks/hooks/Sectores/useGetSectores";
import { useGetDepartamentos } from "../CrmHooks/hooks/Departamentos/useGetDepartamentos";
import { useGetMunicipios } from "../CrmHooks/hooks/Municipios/useGetMunicipios";
import { useGetCustomer } from "../CrmHooks/hooks/Client/useGetClient";
import { useGetServicios } from "../CrmHooks/hooks/Servicios/useGetServicios";
import { useGetServiciosWifi } from "../CrmHooks/hooks/ServiciosWfi/useGetServiciosWifi";
import { useGetZonasFacturacion } from "../CrmHooks/hooks/Zonas-facturacion/useGetZonasFacturacion";
import { UpdateCustomerDto } from "../features/update-customer/update-customer";
import { useUpdateCustomer } from "../CrmHooks/hooks/useUpdateCustomer/useUpdateCustomer";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { AdvancedDialogCRM } from "../_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { useDeleteCustomer } from "../CrmHooks/hooks/useDeleteCustomer/useDeleteCustomer";
import { OptionSelected } from "../features/OptionSelected/OptionSelected";
import { ReusableTabs } from "../Utils/Components/tabs/reusable-tabs";
import ImagesCustomer from "../CrmCustomer/newCustomerPage/ImagesCustomer";
import { CustomerImage } from "../features/customer-galery/customer-galery.interfaces";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useTabChangeWithUrl } from "../Utils/Components/handleTabChangeWithParamURL";
import { useGetMikroTiks } from "../CrmHooks/hooks/Mikrotik/useGetMikroTik";
import { CustomerEditFormCard } from "../CrmNewCustomerEdition";
import {
  UpdateCustomerIpAndNetworkDto,
  useMakeAutorization,
  useUpdateNetworkCustomer,
} from "../CrmHooks/hooks/newtwork-update/use-network-settings";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { Input } from "@/components/ui/input";

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
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [password, setPassword] = useState<string>("");

  const [openUpdateNetwork, setOpenUpdateNetwork] = useState<boolean>(false);

  const [openAuthorization, setOpenAuthorization] = useState<boolean>(false);

  const [fechaInstalacion, setFechaInstalacion] = useState<Date | null>(
    new Date(),
  );
  const [activeTab, setActiveTab] = useState<string>("general");

  const [depaSelected, setDepaSelected] = useState<number | null>(null);
  const [muniSelected, setMuniSelected] = useState<number | null>(null);
  const [serviceSelected, setServiceSelected] = useState<number[]>([]);
  const [mkSelected, setMkSelected] = useState<number | null>(null);

  const [serviceWifiSelected, setServiceWifiSelected] = useState<number | null>(
    null,
  );
  const [zonasFacturacionSelected, setZonasFacturacionSelected] = useState<
    number | null
  >(null);
  const [sectorSelected, setSectorSelected] = useState<number | null>(null);
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

  const handleTabChange = useTabChangeWithUrl({
    activeTab,
    setActiveTab,
    searchParams,
    setSearchParams,
  });

  const { data: customer } = useGetCustomer(id);
  const { data: mikrotiksResponse } = useGetMikroTiks();

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
  const secureMikroTiks = mikrotiksResponse ? mikrotiksResponse : [];
  const secureServiciosWifi = serviciosWifi ? serviciosWifi : [];
  const secureZonasFacturacion = zonasFacturacion ? zonasFacturacion : [];

  const isInstalation = customer?.estado === EstadoCliente.EN_INSTALACION;

  const setOpenUpdNet = () => setOpenUpdateNetwork(!openUpdateNetwork);

  const setOpenAuth = () => setOpenAuthorization(!openAuthorization);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

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

  const optionsMikrotiks: OptionSelected[] = secureMikroTiks.map((mk) => ({
    value: mk.id,
    label: mk.nombre,
  }));

  const optionsDepartamentos: OptionSelected[] = secureDepartamentos.map(
    (depa) => ({
      value: depa.id,
      label: depa.nombre,
    }),
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
    }),
  );

  const optionsZonasFacturacion: OptionSelected[] = secureZonasFacturacion.map(
    (zona) => ({
      value: zona.id,
      label: `${zona.nombre} Clientes: (${zona.clientesCount}) Facturas:(${zona.facturasCount})`,
    }),
  );

  const optionsSectores: OptionSelected[] = secureSectores.map((sector) => ({
    value: sector.id,
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
    selectedOption: MultiValue<OptionSelected> | null,
  ) => {
    setServiceSelected(
      selectedOption
        ? selectedOption.map((option) => Number(option.value))
        : [],
    );
  };

  const handleSelectMk = (selectedOption: OptionSelected | null) => {
    setMkSelected(selectedOption ? Number(selectedOption.value) : null);
  };

  const handleSelectServiceWifi = (selectedOption: OptionSelected | null) => {
    setServiceWifiSelected(
      selectedOption ? Number(selectedOption.value) : null,
    );
  };

  const handleSelectSector = (selectedOption: OptionSelected | null) => {
    setSectorSelected(selectedOption ? Number(selectedOption.value) : null);
  };

  const handleSelectZonaFacturacion = (
    selectedOption: OptionSelected | null,
  ) => {
    setZonasFacturacionSelected(
      selectedOption ? Number(selectedOption.value) : null,
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeDataContrato = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      estado: formData.estado as EstadoCliente,
      enviarRecordatorio: formData.enviarRecordatorio,
      mikrotikRouterId: mkSelected ?? null,
    };
    console.log("El payload es: ", payload);

    toast.promise(updateCustomer.mutateAsync(payload), {
      loading: "Cargando...",
      success: () => {
        setOpenConfirm(false);
        return "Cliente actualizado";
      },
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
        : prev,
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
      estado: customer.estado as EstadoCliente,
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
    setMkSelected(customer.mikrotik?.id ?? null);
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
      value: "general",
      label: "General",
      content: (
        <CustomerEditFormCard
          isInstalation={isInstalation}
          setOpenAuth={setOpenAuth}
          setOpenUpdNet={setOpenUpdNet}
          mkSelected={mkSelected}
          handleSelectMk={handleSelectMk}
          optionsMikrotiks={optionsMikrotiks}
          mikrotiks={secureMikroTiks}
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
      value: "media",
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

  const updateNetworkConfig = useUpdateNetworkCustomer();
  const authorize = useMakeAutorization(id);

  const onSubmitAuthorization = () => {
    try {
      if (!formData.ip) {
        toast.warning("IP no válida");
        return;
      }

      toast.promise(authorize.mutateAsync(), {
        success: () => {
          setOpenAuthorization(false);
          return "IP Autorizada";
        },
        loading: "Autorizando...",
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const dto: UpdateCustomerIpAndNetworkDto = {
    clienteId: id,
    direccionIp: formData.ip,
    gateway: formData.gateway,
    mascara: formData.mascara,
    userId: userId,
    password: password,
    // id: formData.ip,
  };
  const onSubmitUpdateConfigNetwork = () => {
    try {
      toast.promise(updateNetworkConfig.mutateAsync(dto), {
        success: () => {
          setPassword("");
          return "Actualizado";
        },
        error: (error) => getApiErrorMessageAxios(error),
        loading: "Actualizando...",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PageTransitionCrm
      titleHeader="Edición del cliente"
      subtitle={`Configuración de facturación, notificaciones, credenciales, etc.`}
      variant="fade-pure"
    >
      <ReusableTabs
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        tabs={tabs}
        variant="compact"
        defaultValue="general"
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

      <AdvancedDialogCRM
        open={openUpdateNetwork}
        onOpenChange={setOpenUpdateNetwork}
        title="Actualización de configuración de red"
        description="Los cambios propuestos modificarán la red del usuario"
        confirmButton={{
          label: "Confirmar",
          onClick: onSubmitUpdateConfigNetwork,
          disabled: updateNetworkConfig.isPending,
          loading: updateNetworkConfig.isPending,
          loadingText: "Actualizando...",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: updateNetworkConfig.isPending,
          onClick: setOpenUpdNet,
        }}
        children={
          <div>
            <Input
              placeholder="Ingrese su contraseña"
              type="password"
              value={password}
              onChange={changePassword}
            />
          </div>
        }
      />

      <AdvancedDialogCRM
        open={openAuthorization}
        onOpenChange={setOpenAuthorization}
        title="Autorización"
        description={`Se procederá a autorizar al siguiente IP ${formData?.ip ?? "N/A"}`}
        confirmButton={{
          label: "Confirmar",
          onClick: onSubmitAuthorization,
          disabled: authorize.isPending,
          loading: authorize.isPending,
          loadingText: "Autorizando...",
        }}
        cancelButton={{
          label: "Cancelar",
          disabled: authorize.isPending,
          onClick: setOpenAuth,
        }}
        children={
          <div>
            <Input
              placeholder="Ingrese su contraseña"
              type="password"
              value={password}
              onChange={changePassword}
            />
          </div>
        }
      />
    </PageTransitionCrm>
  );
}

export default EditCustomers;
