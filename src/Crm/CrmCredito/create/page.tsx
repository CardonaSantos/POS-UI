import { CreditoForm } from "../form/credito-form";
import { creditoFormSchema, CreditoFormValues } from "../form/schema.zod";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetCustomerToSelect } from "@/Crm/CrmHooks/hooks/Client/useGetClient";
import { useGetUsersToSelect } from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";
import {
  useCreateCredito,
  useVerifyCustomer,
} from "../../CrmHooks/hooks/use-credito/use-credito";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FrecuenciaPago,
  InteresTipo,
  VerifyCustomerResponseUI,
} from "../../features/credito/credito-interfaces";
import { CustomerCreditScore } from "../main/components/customer-credit-score";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { AdvancedDialogCRM } from "@/Crm/_Utils/components/AdvancedDialogCrm/AdvancedDialogCRM";
import { useState } from "react";

export const initialVerifyCustomerResponse: VerifyCustomerResponseUI = {
  historial: [],
  resumen: {
    puntualidadPct: 0,
    promedioAtraso: 0,
    medianaAtraso: 0,
    rachaActual: 0,
    score: 0,
    clasificacion: "NO_APROBABLE",
  },
};

function CrmCreditoMainPage() {
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const { data: clientes } = useGetCustomerToSelect();
  const { data: users } = useGetUsersToSelect();
  const submitCredito = useCreateCredito();

  const clientesSecure = clientes ? clientes : [];
  const usersSecure = users ? users : [];

  const [] = useState<boolean>(false);

  const form = useForm<CreditoFormValues>({
    resolver: zodResolver(creditoFormSchema),
    defaultValues: {
      clienteId: undefined,
      creadoPorId: userId,
      montoCapital: "",
      interesPorcentaje: "",
      interesMoraPorcentaje: "",
      tipoGeneracionCuotas: "AUTOMATICA",
      interesTipo: InteresTipo.FIJO,
      frecuencia: FrecuenciaPago.MENSUAL,
      intervaloDias: 30,
      plazoCuotas: 12,
      fechaInicio: new Date(),
      engancheMonto: "",
      engancheFecha: undefined,
      origenCredito: undefined,
      observaciones: "",
      cuotasCustom: [],
    },
  });

  const clienteId = form.watch("clienteId");
  const { data, refetch } = useVerifyCustomer(clienteId);

  const handleSubmit = (data: CreditoFormValues) => {
    try {
      toast.promise(submitCredito.mutateAsync(data), {
        success: () => {
          form.reset();
          return "Crédito registrado";
        },
        loading: "Registrando crédito...",
        error: (error) => getApiErrorMessageAxios(error),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitVerifyCustomer = async () => {
    const payload = {
      id: form.getValues().clienteId,
    };

    if (!payload.id) {
      toast.warning("Debe seleccionar un cliente primero");
      return;
    }

    try {
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const clienteOptions = clientesSecure.map((c) => ({
    value: c.id,
    label: c.nombre,
  }));

  const usuarioOptions = usersSecure.map((u) => ({
    value: u.id,
    label: u.nombre,
  }));
  const isVerifyDisabled = !form.watch("clienteId");

  const secureSummaryCustomerVerified = data
    ? data
    : initialVerifyCustomerResponse;

  console.log(form.getValues());

  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <div className="">
        <CreditoForm
          isButtonAvaliable={isVerifyDisabled}
          handleSubmitVerifyCustomer={handleSubmitVerifyCustomer}
          onSubmit={handleSubmit}
          clientes={clienteOptions}
          usuarios={usuarioOptions}
          form={form}
        />
      </div>
      <div className="mt-4">
        <CustomerCreditScore data={secureSummaryCustomerVerified} />
      </div>

      {/* <AdvancedDialogCRM
        title="Creacion de credito"
        description="registro de credito"
        open
      
      /> */}
    </PageTransitionCrm>
  );
}

export default CrmCreditoMainPage;
