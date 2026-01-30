import { CreditoFormValues } from "@/Crm/CrmCredito/form/schema.zod";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { creditoQkeys } from "./Qk";
import { GetCreditosQueryDto } from "@/Crm/CrmHooks/hooks/use-credito/query";
import {
  CreditoResponse,
  GetCreditosResponse,
  VerifyCustomerResponseUI,
} from "@/Crm/features/credito/credito-interfaces";

export interface CreateCuotaPagoDto {
  cuotaId: string;
  userId: string;
  monto: string;
  creditoId: string;

  fechaPago: string;
  metodoPago: string;
  referencia: string;
  observacion: string;
}

export interface DeletePagoDto {
  pagoCuotaId: number;
  userId: number;
}

export interface verifyCustomerDto {
  id: number;
}

/**
 * CREAR UN CREDITO
 * @returns
 */
export function useCreateCredito() {
  const query = useQueryClient();
  return useCrmMutation<void, CreditoFormValues>("post", `credito`, undefined, {
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: creditoQkeys.all,
      });
    },
  });
}

/**
 * GET DE TODOS LOS CREDITOS CON PAGINACION
 * @param params
 * @returns
 */
export function useGetCreditos(params?: GetCreditosQueryDto) {
  return useCrmQuery<GetCreditosResponse, GetCreditosQueryDto>(
    creditoQkeys.all,
    "credito/find-many",
    {
      params,
    },
    {
      enabled: !!params,
      staleTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
}

/**
 * FETECHEAR UN CREDITO
 * @param creditoId
 * @returns
 */
export function useGetCredito(creditoId?: number) {
  return useCrmQuery<CreditoResponse>(
    creditoId ? creditoQkeys.specific(creditoId) : creditoQkeys.all,
    `credito/${creditoId}`,
    undefined,
    {
      enabled: !!creditoId,
    },
  );
}

/**
 * Enviar un pago de cuota
 * @returns
 */
export function useCreatePagoCuota() {
  const query = useQueryClient();
  return useCrmMutation<void, CreateCuotaPagoDto>(
    "post",
    `cuotas-pago/create-pago`,
    undefined,
    {
      onSuccess: () => {
        query.invalidateQueries({
          queryKey: creditoQkeys.all,
        });
      },
    },
  );
}

/**
 * ELIMINAR UN PAYMENT
 * @returns
 */
export function useDeletePayment() {
  const query = useQueryClient();
  return useCrmMutation<void, DeletePagoDto>(
    "post",
    `cuotas-pago/delete-pago`,
    undefined,
    {
      onSuccess: () => {
        query.invalidateQueries({
          queryKey: creditoQkeys.all,
        });
      },
    },
  );
}

/**
 * Verificar la disponibilidad del cliente
 * @returns
 */
export function useVerifyCustomer(clienteId?: number) {
  return useCrmQuery<VerifyCustomerResponseUI>(
    ["verify-customer", clienteId],
    `verify-customer/${clienteId}`,
    undefined,
    {
      enabled: !!clienteId,
      staleTime: 0,
    },
  );
}
