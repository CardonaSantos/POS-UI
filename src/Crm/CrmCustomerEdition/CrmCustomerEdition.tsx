"use client";
import * as React from "react";
import type { MultiValue } from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { Images, KeyRound, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import {
  useAppDisclosure,
  useAppStateHandlers,
} from "@/components/app/handlers";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";
import { OptionSelected } from "../features/OptionSelected/OptionSelected";
import { UpdateCustomerDto } from "../features/update-customer/update-customer";
import { CustomerImage } from "../features/customer-galery/customer-galery.interfaces";

import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { useTabChangeWithUrl } from "../Utils/Components/handleTabChangeWithParamURL";

import { useGetCustomer } from "../CrmHooks/hooks/Client/useGetClient";
import { useGetSectores } from "../CrmHooks/hooks/Sectores/useGetSectores";
import { useGetDepartamentos } from "../CrmHooks/hooks/Departamentos/useGetDepartamentos";
import { useGetMunicipios } from "../CrmHooks/hooks/Municipios/useGetMunicipios";
import { useGetServicios } from "../CrmHooks/hooks/Servicios/useGetServicios";
import { useGetServiciosWifi } from "../CrmHooks/hooks/ServiciosWfi/useGetServiciosWifi";
import { useGetZonasFacturacion } from "../CrmHooks/hooks/Zonas-facturacion/useGetZonasFacturacion";
import { useGetMikroTiks } from "../CrmHooks/hooks/Mikrotik/useGetMikroTik";
import { useUpdateCustomer } from "../CrmHooks/hooks/useUpdateCustomer/useUpdateCustomer";
import { useDeleteCustomer } from "../CrmHooks/hooks/useDeleteCustomer/useDeleteCustomer";
import {
  UpdateCustomerIpAndNetworkDto,
  useMakeAutorization,
  useUpdateNetworkCustomer,
} from "../CrmHooks/hooks/newtwork-update/use-network-settings";

import ImagesCustomer from "../CrmCustomer/newCustomerPage/_components/images-customer";
import { CustomerEditFormCard } from "../CrmNewCustomerEdition";

interface FormData {
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
  sectorId?: number | null;
}

interface ContratoID {
  clienteId: number;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observaciones: string;
}

type CustomerEditTab = "general" | "media";

type EditCustomerViewState = {
  activeTab: CustomerEditTab;
  password: string;

  fechaInstalacion: Date | null;

  depaSelected: number | null;
  muniSelected: number | null;
  serviceSelected: number[];
  mkSelected: number | null;
  serviceWifiSelected: number | null;
  zonasFacturacionSelected: number | null;
  sectorSelected: number | null;

  formData: FormData;
  formDataContrato: ContratoID;
};

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
};

const INITIAL_CONTRATO_FORM_DATA: ContratoID = {
  archivoContrato: "",
  clienteId: 0,
  fechaFirma: new Date(),
  idContrato: "",
  observaciones: "",
};

const EDIT_TABS: Array<{
  value: CustomerEditTab;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "general",
    label: "General",
    description: "Datos, servicio, contrato y red",
    icon: <UserRound size={13} />,
  },
  {
    value: "media",
    label: "Imágenes",
    description: "Galería y evidencias del cliente",
    icon: <Images size={13} />,
  },
];

function CustomerEditTabs({
  activeTab,
  onChange,
}: {
  activeTab: CustomerEditTab;
  onChange: (tab: CustomerEditTab) => void;
}) {
  return (
    <AppCard variant="outline" size="xs" className="overflow-visible p-1">
      <div
        role="tablist"
        aria-label="Secciones de edición del cliente"
        className="grid grid-cols-1 gap-1 sm:grid-cols-2"
      >
        {EDIT_TABS.map((tab) => {
          const active = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`customer-edit-panel-${tab.value}`}
              id={`customer-edit-tab-${tab.value}`}
              onClick={() => onChange(tab.value)}
              className={[
                "flex min-w-0 items-center gap-2 rounded-[var(--app-radius-md)] px-3 py-2 text-left transition-colors",
                active
                  ? "bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]"
                  : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] hover:bg-[hsl(var(--app-muted,var(--muted)))/0.45]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--app-radius-md)]",
                  active
                    ? "bg-[hsl(var(--app-primary)/0.16)] text-[hsl(var(--app-primary))]"
                    : "bg-[hsl(var(--app-muted,var(--muted)))] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                ].join(" ")}
              >
                {tab.icon}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold leading-4">
                  {tab.label}
                </span>
                <span className="block truncate text-[10px] leading-3 opacity-80">
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </AppCard>
  );
}

function PasswordActionDialog({
  open,
  title,
  description,
  password,
  isLoading,
  confirmText,
  loadingText,
  onOpenChange,
  onPasswordChange,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  password: string;
  isLoading?: boolean;
  confirmText: string;
  loadingText: string;
  onOpenChange: (open: boolean) => void;
  onPasswordChange: (value: string) => void;
  onConfirm: () => void | Promise<void>;
}) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[520px]">
        <AppDialogHeader>
          <AppDialogTitle>
            <AppInline align="center" gap="xs">
              <KeyRound size={16} />
              <span>{title}</span>
            </AppInline>
          </AppDialogTitle>

          <AppDialogDescription>{description}</AppDialogDescription>
        </AppDialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void onConfirm();
          }}
        >
          <AppStack gap="md">
            <AppField
              label="Contraseña"
              description="Ingrese su contraseña para confirmar esta operación."
            >
              {(field) => (
                <AppInput
                  id={field.id}
                  type="password"
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="Ingrese su contraseña"
                  size="xs"
                  fieldWidth="full"
                  leftIcon={<KeyRound size={13} />}
                  disabled={isLoading}
                  aria-invalid={field.invalid}
                  aria-describedby={field.describedBy}
                  autoComplete="current-password"
                />
              )}
            </AppField>

            <AppInline align="center" justify="end" gap="xs">
              <AppButton
                type="button"
                variant="secondary"
                size="xs"
                width="auto"
                disabled={isLoading}
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </AppButton>

              <AppButton
                type="submit"
                variant="primary"
                size="xs"
                width="auto"
                loading={isLoading}
                loadingText={loadingText}
                disabled={isLoading}
              >
                {confirmText}
              </AppButton>
            </AppInline>
          </AppStack>
        </form>
      </AppDialogContent>
    </AppDialog>
  );
}

function EditCustomers() {
  const { customerId } = useParams();
  const id = customerId ? Number.parseInt(customerId) : 0;

  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const updateDialog = useAppDisclosure();
  const deleteDialog = useAppDisclosure();
  const updateNetworkDialog = useAppDisclosure();
  const authorizationDialog = useAppDisclosure();

  const view = useAppStateHandlers<EditCustomerViewState>({
    activeTab: "general",
    password: "",

    fechaInstalacion: new Date(),

    depaSelected: null,
    muniSelected: null,
    serviceSelected: [],
    mkSelected: null,
    serviceWifiSelected: null,
    zonasFacturacionSelected: null,
    sectorSelected: null,

    formData: INITIAL_FORM_DATA,
    formDataContrato: INITIAL_CONTRATO_FORM_DATA,
  });

  const activeTabSetter = React.useCallback<
    React.Dispatch<React.SetStateAction<string>>
  >(
    (next) => {
      const value =
        typeof next === "function" ? next(view.state.activeTab) : next;

      view.setField("activeTab", value as CustomerEditTab);
    },
    [view],
  );

  const handleTabChange = useTabChangeWithUrl({
    activeTab: view.state.activeTab,
    setActiveTab: activeTabSetter,
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
  const { data: municipios } = useGetMunicipios(view.state.depaSelected);

  const updateCustomer = useUpdateCustomer(id);
  const deleteCustomer = useDeleteCustomer(id);
  const updateNetworkConfig = useUpdateNetworkCustomer();
  const authorize = useMakeAutorization(id);

  const secureSectores = sectores ?? [];
  const secureDepartamentos = departamentos ?? [];
  const secureMunicipios = municipios ?? [];
  const secureServicios = servicios ?? [];
  const secureMikroTiks = mikrotiksResponse ?? [];
  const secureServiciosWifi = serviciosWifi ?? [];
  const secureZonasFacturacion = zonasFacturacion ?? [];

  const formData = view.state.formData;
  const formDataContrato = view.state.formDataContrato;

  const isInstalation = customer?.estado === EstadoCliente.EN_INSTALACION;

  const secureImages: CustomerImage[] = React.useMemo(() => {
    if (!Array.isArray(customer?.imagenes)) return [];

    return customer.imagenes.map((img) => ({
      id: img.id,
      categoria: img.categoria,
      cdnUrl: img.cdnUrl,
      descripcion: img.descripcion,
      estado: img.estado,
      titulo: img.titulo,
      etiqueta: img.etiqueta,
      customerId: img.customerId,
    }));
  }, [customer?.imagenes]);

  const optionsMikrotiks: OptionSelected[] = React.useMemo(
    () =>
      secureMikroTiks.map((mk) => ({
        value: mk.id,
        label: mk.nombre,
      })),
    [secureMikroTiks],
  );

  const optionsDepartamentos: OptionSelected[] = React.useMemo(
    () =>
      secureDepartamentos.map((depa) => ({
        value: depa.id,
        label: depa.nombre,
      })),
    [secureDepartamentos],
  );

  const optionsMunis: OptionSelected[] = React.useMemo(
    () =>
      secureMunicipios.map((muni) => ({
        value: muni.id,
        label: muni.nombre,
      })),
    [secureMunicipios],
  );

  const optionsServices: OptionSelected[] = React.useMemo(
    () =>
      secureServicios.map((service) => ({
        value: service.id,
        label: service.nombre,
      })),
    [secureServicios],
  );

  const optionsServicesWifi: OptionSelected[] = React.useMemo(
    () =>
      secureServiciosWifi.map((service) => ({
        value: service.id,
        label: service.nombre,
      })),
    [secureServiciosWifi],
  );

  const optionsZonasFacturacion: OptionSelected[] = React.useMemo(
    () =>
      secureZonasFacturacion.map((zona) => ({
        value: zona.id,
        label: `${zona.nombre} Clientes: (${zona.clientesCount}) Facturas:(${zona.facturasCount})`,
      })),
    [secureZonasFacturacion],
  );

  const optionsSectores: OptionSelected[] = React.useMemo(
    () =>
      secureSectores.map((sector) => ({
        value: sector.id,
        label: sector.nombre,
      })),
    [secureSectores],
  );

  const patchFormData = React.useCallback(
    (patch: Partial<FormData>) => {
      view.setField("formData", {
        ...view.state.formData,
        ...patch,
      });
    },
    [view],
  );

  const patchContrato = React.useCallback(
    (patch: Partial<ContratoID>) => {
      view.setField("formDataContrato", {
        ...view.state.formDataContrato,
        ...patch,
      });
    },
    [view],
  );

  const setFormDataContrato = React.useCallback<
    React.Dispatch<React.SetStateAction<ContratoID>>
  >(
    (next) => {
      const value =
        typeof next === "function" ? next(view.state.formDataContrato) : next;

      view.setField("formDataContrato", value);
    },
    [view],
  );

  const handleSelectDepartamento = (selectedOption: OptionSelected | null) => {
    view.patch({
      depaSelected: selectedOption ? Number(selectedOption.value) : null,
      muniSelected: null,
    });
  };

  const handleSelectMunicipio = (selectedOption: OptionSelected | null) => {
    view.setField(
      "muniSelected",
      selectedOption ? Number(selectedOption.value) : null,
    );
  };

  const handleEnviarRecordatorioChange = (checked: boolean) => {
    patchFormData({ enviarRecordatorio: checked });
  };

  const handleSelectService = (
    selectedOption: MultiValue<OptionSelected> | null,
  ) => {
    view.setField(
      "serviceSelected",
      selectedOption
        ? selectedOption.map((option) => Number(option.value))
        : [],
    );
  };

  const handleSelectMk = (selectedOption: OptionSelected | null) => {
    view.setField(
      "mkSelected",
      selectedOption ? Number(selectedOption.value) : null,
    );
  };

  const handleSelectServiceWifi = (selectedOption: OptionSelected | null) => {
    view.setField(
      "serviceWifiSelected",
      selectedOption ? Number(selectedOption.value) : null,
    );
  };

  const handleSelectSector = (selectedOption: OptionSelected | null) => {
    view.setField(
      "sectorSelected",
      selectedOption ? Number(selectedOption.value) : null,
    );
  };

  const handleSelectZonaFacturacion = (
    selectedOption: OptionSelected | null,
  ) => {
    view.setField(
      "zonasFacturacionSelected",
      selectedOption ? Number(selectedOption.value) : null,
    );
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    patchFormData({ [name]: value } as Partial<FormData>);
  };

  const handleChangeDataContrato = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    patchContrato({ [name]: value } as Partial<ContratoID>);
  };

  const handleSelectEstadoCliente = (value: EstadoCliente) => {
    patchFormData({ estado: value });
  };

  const buildUpdatePayload = React.useCallback((): UpdateCustomerDto => {
    return {
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
      fechaInstalacion: view.state.fechaInstalacion,
      municipioId: view.state.muniSelected ?? null,
      departamentoId: view.state.depaSelected ?? null,
      sectorId: view.state.sectorSelected ?? null,
      empresaId: 1,
      coordenadas:
        formData.coordenadas && formData.coordenadas !== ""
          ? formData.coordenadas.split(",").map((item) => item.trim())
          : [],
      servicesIds: view.state.serviceSelected,
      servicioWifiId: view.state.serviceWifiSelected ?? null,
      zonaFacturacionId: view.state.zonasFacturacionSelected ?? null,
      gateway: formData.gateway.trim(),
      mascara: formData.mascara.trim(),
      idContrato: formDataContrato.idContrato,
      fechaFirma: formDataContrato.fechaFirma,
      archivoContrato: formDataContrato.archivoContrato,
      observacionesContrato: formDataContrato.observaciones,
      estado: formData.estado as EstadoCliente,
      enviarRecordatorio: formData.enviarRecordatorio,
      mikrotikRouterId: view.state.mkSelected ?? null,
    };
  }, [customerId, formData, formDataContrato, view.state]);

  const handleSubmit = async (): Promise<void> => {
    const payload = buildUpdatePayload();

    await toast.promise(updateCustomer.mutateAsync(payload), {
      loading: "Actualizando cliente...",
      success: () => {
        updateDialog.close();
        return "Cliente actualizado";
      },
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const handleDeleteCustomer = async (): Promise<void> => {
    if (!id) {
      toast.warning("ID de cliente no válido");
      return;
    }

    await toast.promise(deleteCustomer.mutateAsync(), {
      loading: "Eliminando cliente...",
      success: "Cliente eliminado",
      error: (error) => getApiErrorMessageAxios(error),
    });

    deleteDialog.close();
    navigate("/crm-clientes");
  };

  const onSubmitAuthorization = async (): Promise<void> => {
    if (!formData.ip) {
      toast.warning("IP no válida");
      return;
    }

    await toast.promise(authorize.mutateAsync(), {
      success: () => {
        authorizationDialog.close();
        view.setField("password", "");
        return "IP autorizada";
      },
      loading: "Autorizando...",
      error: (error) => getApiErrorMessageAxios(error),
    });
  };

  const onSubmitUpdateConfigNetwork = async (): Promise<void> => {
    const dto: UpdateCustomerIpAndNetworkDto = {
      clienteId: id,
      direccionIp: formData.ip,
      gateway: formData.gateway,
      mascara: formData.mascara,
      userId,
      password: view.state.password,
    };

    await toast.promise(updateNetworkConfig.mutateAsync(dto), {
      success: () => {
        updateNetworkDialog.close();
        view.setField("password", "");
        return "Configuración actualizada";
      },
      error: (error) => getApiErrorMessageAxios(error),
      loading: "Actualizando...",
    });
  };

  React.useEffect(() => {
    if (!customer) return;

    view.patch({
      formData: {
        nombre: customer.nombre || "",
        apellidos: customer.apellidos || "",
        telefono: customer.telefono || "",
        direccion: customer.direccion || "",
        dpi: customer.dpi || "",
        observaciones: customer.observaciones || "",
        contactoReferenciaNombre: customer.contactoReferenciaNombre || "",
        contactoReferenciaTelefono: customer.contactoReferenciaTelefono || "",
        coordenadas: customer.coordenadas
          ? customer.coordenadas.join(", ")
          : "",
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
      },
      fechaInstalacion: customer.fechaInstalacion
        ? new Date(customer.fechaInstalacion)
        : null,
      depaSelected: customer.departamento?.id ?? null,
      muniSelected: customer.municipio?.id ?? null,
      sectorSelected: customer.sector?.id ?? null,
      serviceSelected: customer.servicios?.map((service) => service.id) ?? [],
      serviceWifiSelected: customer.servicioWifi?.id ?? null,
      zonasFacturacionSelected: customer.zonaFacturacion?.id ?? null,
      mkSelected: customer.mikrotik?.id ?? null,
      formDataContrato: customer.contrato
        ? {
            clienteId: customer.id,
            idContrato: customer.contrato.idContrato || "",
            fechaFirma: customer.contrato.fechaFirma
              ? new Date(customer.contrato.fechaFirma)
              : new Date(),
            archivoContrato: customer.contrato.archivoContrato || "",
            observaciones: customer.contrato.observaciones || "",
          }
        : INITIAL_CONTRATO_FORM_DATA,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  return (
    <PageTransitionCrm
      titleHeader="Edición del cliente"
      subtitle="Configuración de facturación, notificaciones, credenciales y red."
      variant="fade-pure"
    >
      <AppStack gap="md">
        <CustomerEditTabs
          activeTab={view.state.activeTab}
          onChange={(tab) => handleTabChange(tab)}
        />

        <section
          id={`customer-edit-panel-${view.state.activeTab}`}
          role="tabpanel"
          aria-labelledby={`customer-edit-tab-${view.state.activeTab}`}
          className="min-w-0"
        >
          {view.state.activeTab === "general" ? (
            <CustomerEditFormCard
              isInstalation={isInstalation}
              setOpenAuth={authorizationDialog.open}
              setOpenUpdNet={updateNetworkDialog.open}
              mkSelected={view.state.mkSelected}
              handleSelectMk={handleSelectMk}
              optionsMikrotiks={optionsMikrotiks}
              mikrotiks={secureMikroTiks}
              handleEnviarRecordatorioChange={handleEnviarRecordatorioChange}
              formData={formData}
              formDataContrato={formDataContrato}
              fechaInstalacion={view.state.fechaInstalacion}
              depaSelected={view.state.depaSelected}
              muniSelected={view.state.muniSelected}
              sectorSelected={view.state.sectorSelected}
              serviceSelected={view.state.serviceSelected}
              serviceWifiSelected={view.state.serviceWifiSelected}
              zonasFacturacionSelected={view.state.zonasFacturacionSelected}
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
              onChangeFechaInstalacion={(date) =>
                view.setField("fechaInstalacion", date)
              }
              onSelectEstadoCliente={handleSelectEstadoCliente}
              onClickDelete={deleteDialog.open}
              onClickOpenConfirm={updateDialog.open}
              handleChangeDataContrato={handleChangeDataContrato}
              setFormDataContrato={setFormDataContrato}
            />
          ) : (
            <ImagesCustomer
              clienteId={id}
              empresaId={1}
              imagenesCliente={secureImages}
            />
          )}
        </section>
      </AppStack>

      <AppConfirmDialog
        open={updateDialog.isOpen}
        onOpenChange={updateDialog.setOpen}
        preset="warning"
        tone="warning"
        size="sm"
        title="Confirmación de actualización"
        description="¿Estás seguro de que deseas actualizar este cliente con los datos proporcionados?"
        confirmText="Sí, actualizar cliente"
        cancelText="Cancelar"
        loadingText="Actualizando cliente..."
        isLoading={updateCustomer.isPending}
        preventClose={updateCustomer.isPending}
        closeOnConfirm={false}
        footerAlign="between"
        onConfirm={handleSubmit}
      ></AppConfirmDialog>

      <AppConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setOpen}
        preset="warning"
        tone="danger"
        size="sm"
        title="Confirmación de eliminación"
        description="Los datos relacionados a este cliente podrían perderse."
        confirmText="Sí, eliminar cliente"
        cancelText="Cancelar"
        loadingText="Eliminando cliente..."
        isLoading={deleteCustomer.isPending}
        preventClose={deleteCustomer.isPending}
        closeOnConfirm={false}
        footerAlign="between"
        onConfirm={handleDeleteCustomer}
      >
        <AppInline align="start" gap="sm">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--app-radius-full)] bg-[hsl(var(--app-danger,var(--destructive))/0.14)] text-[hsl(var(--app-danger,var(--destructive)))]">
            <Trash2 size={16} />
          </span>

          <p className="text-xs leading-5 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Esta acción puede afectar facturación, servicios, imágenes y datos
            asociados al cliente.
          </p>
        </AppInline>
      </AppConfirmDialog>

      <PasswordActionDialog
        open={updateNetworkDialog.isOpen}
        onOpenChange={updateNetworkDialog.setOpen}
        title="Actualización de configuración de red"
        description="Los cambios propuestos modificarán la red del usuario."
        password={view.state.password}
        isLoading={updateNetworkConfig.isPending}
        confirmText="Confirmar"
        loadingText="Actualizando..."
        onPasswordChange={(value) => view.setField("password", value)}
        onConfirm={onSubmitUpdateConfigNetwork}
      />

      <PasswordActionDialog
        open={authorizationDialog.isOpen}
        onOpenChange={authorizationDialog.setOpen}
        title="Autorización"
        description={`Se procederá a autorizar la IP ${formData?.ip ?? "N/A"}.`}
        password={view.state.password}
        isLoading={authorize.isPending}
        confirmText="Confirmar"
        loadingText="Autorizando..."
        onPasswordChange={(value) => view.setField("password", value)}
        onConfirm={onSubmitAuthorization}
      />
    </PageTransitionCrm>
  );
}

export default EditCustomers;
