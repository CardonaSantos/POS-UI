import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { customerQkeys } from "./Qk";
import { CustomerDataResponse } from "@/Crm/features/customer-response-data/customer-response-data.interface";
import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import {
  CustomerCampaignWhatsapp,
  CustomersCampaingQuery,
  EstadoCliente,
} from "@/Crm/features/cliente-interfaces/cliente-types";

interface Cliente {
  id: number;
  nombre: string;
}

export interface PayloadCreateCustomer {
  userId: number;
  nombre: string;
  apellidos: string;
  ip: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  estado: EstadoCliente;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: Date | null;
  municipioId: number | null;
  departamentoId: number | null;
  sectorId: number | null;
  empresaId: number;
  coordenadas: string[];
  servicesIds: number[];
  servicioWifiId: number | null;
  zonaFacturacionId: number | null;
  idContrato: string;
  fechaFirma: Date | null;
  archivoContrato: string;
  observacionesContrato: string;
  mkSelected: number | null;
  activateOnMk: boolean | undefined;
}

export function useGetCustomer(customerId: number) {
  return useCrmQuery<CustomerDataResponse>(
    customerQkeys.specificCustomer(customerId),
    `internet-customer/get-customer-to-edit/${customerId}`,
    undefined,
    {
      staleTime: 0,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

export function useGetCustomerToSelect() {
  return useCrmQuery<Array<Cliente>>(
    customerQkeys.all,
    `internet-customer/get-customers-to-ticket`,
    undefined,
    {
      staleTime: 0,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

/**
 * CONSEGUIR LOS CLIENTES CRM PARA VISTA DE CAMAPAING WHATSAPP
 * @param query
 * @returns
 */
export function useGetCustomersCampaingWhatsapp(query: CustomersCampaingQuery) {
  return crm.useQueryApi<Array<CustomerCampaignWhatsapp>>(
    customerQkeys.filter(query),
    crm_endpoints.customer.get_customers_campaing_whatsapp,
    {
      params: query,
    },
  );
}

export function useCreateCustomer() {
  return crm.useMutationApi<void, PayloadCreateCustomer>(
    "post",
    crm_endpoints.customer.create,
  );
}
