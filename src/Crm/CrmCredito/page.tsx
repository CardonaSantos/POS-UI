import { CreditoForm } from "./form/credito-form";
import { creditoFormSchema, CreditoFormValues } from "./form/schema.zod";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetCustomerToSelect } from "@/Crm/CrmHooks/hooks/Client/useGetClient";
import { useGetUsersToSelect } from "@/Crm/CrmHooks/hooks/useUsuarios/use-usuers";
import { useCreateCredito } from "../CrmHooks/hooks/use-credito/use-credito";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FrecuenciaPago,
  InteresTipo,
} from "../features/credito/credito-interfaces";

function CrmCreditoMainPage() {
  const { data: clientes } = useGetCustomerToSelect();
  const { data: users } = useGetUsersToSelect();
  const submitCredito = useCreateCredito();
  const clientesSecure = clientes ? clientes : [];
  const usersSecure = users ? users : [];

  const form = useForm<CreditoFormValues>({
    resolver: zodResolver(creditoFormSchema),
    defaultValues: {
      clienteId: undefined,
      creadoPorId: undefined,
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

  const clienteOptions = clientesSecure.map((c) => ({
    value: c.id,
    label: c.nombre,
  }));

  const usuarioOptions = usersSecure.map((u) => ({
    value: u.id,
    label: u.nombre,
  }));

  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <div className="">
        <CreditoForm
          onSubmit={handleSubmit}
          clientes={clienteOptions}
          usuarios={usuarioOptions}
          form={form}
        />
      </div>
    </PageTransitionCrm>
  );
}

export default CrmCreditoMainPage;
