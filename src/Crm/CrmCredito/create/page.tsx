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
import { useState } from "react";
import { toDecimal } from "@/Crm/_Utils/toDecimal";

import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const clienteIdFromUrl = searchParams.get("clienteId");

  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const { data: clientes } = useGetCustomerToSelect();
  const { data: users } = useGetUsersToSelect();
  const submitCredito = useCreateCredito();

  const [openConfirSubmit, setOpenConfirSubmit] = useState<boolean>(false);

  const clientesSecure = clientes ? clientes : [];
  const usersSecure = users ? users : [];

  const form = useForm<CreditoFormValues>({
    resolver: zodResolver(creditoFormSchema),
    defaultValues: {
      clienteId: clienteIdFromUrl ? parseInt(clienteIdFromUrl) : 0,
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

  const handleOpenSubmit = () => setOpenConfirSubmit(!openConfirSubmit);

  const clienteIdForm = form.watch("clienteId");

  useEffect(() => {
    if (clienteIdFromUrl) {
      const idNumerico = Number(clienteIdFromUrl);
      if (form.getValues("clienteId") !== idNumerico) {
        form.setValue("clienteId", idNumerico);
      }
    }
  }, [clienteIdFromUrl, form]);

  const { data, refetch } = useVerifyCustomer(clienteIdForm);

  const handleSubmit = (data: CreditoFormValues) => {
    try {
      const camposAValidar = [
        {
          nombre: "Interés Mora",
          valor: data.interesMoraPorcentaje,
          key: "interesMoraPorcentaje",
        },
        {
          nombre: "Interés Mensual",
          valor: data.interesPorcentaje,
          key: "interesPorcentaje",
        },
        {
          nombre: "Monto Capital",
          valor: data.montoCapital,
          key: "montoCapital",
        },
        { nombre: "Enganche", valor: data.engancheMonto, key: "engancheMonto" },
      ];

      for (const campo of camposAValidar) {
        const valor = toDecimal(campo.valor);

        if (valor < 0) {
          form.setError(campo.key as any, {
            message: `El campo ${campo.nombre} no puede ser negativo`,
          });
          return;
        }

        if (campo.key === "montoCapital" && valor <= 0) {
          form.setError("montoCapital", {
            message: "El capital no puede ser negativo",
          });
          return;
        }
      }

      toast.promise(submitCredito.mutateAsync(data), {
        success: () => {
          form.reset();
          return "Crédito registrado";
        },
        loading: "Registrando crédito...",
        error: (error) => getApiErrorMessageAxios(error),
      });

      form.reset({
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
      });
      setOpenConfirSubmit(false);
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

  const handleClienteChange = (nuevoId: number | undefined) => {
    const idSeguro = nuevoId ?? 0;
    form.setValue("clienteId", idSeguro, { shouldValidate: true });

    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (nuevoId) {
        newParams.set("clienteId", String(nuevoId));
      } else {
        newParams.delete("clienteId");
      }

      return newParams;
    });
  };

  useEffect(() => {
    if (clienteIdForm) {
      handleSubmitVerifyCustomer();
    }
  }, [clienteIdForm]);

  console.log(form.getValues());

  return (
    <PageTransitionCrm
      titleHeader="Créditos - Registro"
      subtitle={`Créditos registrados 10`}
      variant="fade-pure"
    >
      <div className="">
        <CreditoForm
          handleClienteChange={handleClienteChange}
          submitCreditoIsPending={submitCredito.isPending}
          setOpenConfirSubmit={setOpenConfirSubmit}
          openConfirSubmit={openConfirSubmit}
          handleOpenSubmit={handleOpenSubmit}
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
    </PageTransitionCrm>
  );
}

export default CrmCreditoMainPage;
