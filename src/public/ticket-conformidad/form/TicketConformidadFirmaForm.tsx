import { useCallback, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

import { AppForm, AppFormInput, AppFormSubmit } from "@/components/app/form";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  ticketConformidadFirmaSchema,
  type TicketConformidadFirmaFormValues,
} from "../schemas/ticket-conformidad-firma.schema";

import type { RegistrarFirmaTicketConformidadResponse } from "../types/ticket-conformidad-public.types";
import { TicketSignaturePadHandle } from "../Signature/types/ticket-signature-pad.types";
import { useRegistrarFirmaTicketConformidad } from "../hooks/tickets-conformidad/use-registrar-firma-ticket-conformidad";
import { getTicketConformidadPublicErrorMessage } from "../errors/ticket-conformidad-public-error";
// import { TicketConformidadBackButton } from "../components/TicketConformidadBackButton";
import { TicketSignaturePad } from "../Signature/components/TicketSignaturePad";

interface TicketConformidadFirmaFormProps {
  token: string;

  nombreInicial?: string | null;
  telefonoInicial?: string | null;

  onBack: () => void;

  onCompleted: (response: RegistrarFirmaTicketConformidadResponse) => void;
}

export function TicketConformidadFirmaForm({
  token,
  nombreInicial,
  telefonoInicial,
  // onBack,
  onCompleted,
}: TicketConformidadFirmaFormProps) {
  const signatureRef = useRef<TicketSignaturePadHandle | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const mutation = useRegistrarFirmaTicketConformidad(token);

  const form = useForm<TicketConformidadFirmaFormValues>({
    resolver: zodResolver(ticketConformidadFirmaSchema),

    mode: "onChange",

    defaultValues: {
      nombreFirmante: nombreInicial?.trim() ?? "",

      telefonoFirmante: telefonoInicial?.trim() ?? "",

      firmaCapturada: false,
    },
  });

  //   const busy = form.formState.isSubmitting || mutation.isPending;

  const busy = form.formState.isSubmitting || mutation.isPending;

  const handleSignatureEmptyChange = useCallback(
    (isEmpty: boolean) => {
      form.setValue("firmaCapturada", !isEmpty, {
        shouldDirty: true,
        shouldValidate: true,
      });

      if (!isEmpty) {
        form.clearErrors("firmaCapturada");
      }
    },
    [form],
  );

  const handleSubmit = async (values: TicketConformidadFirmaFormValues) => {
    setSubmitError(null);

    console.log("VALUES SUBMIT:", values);
    console.log("FORM VALUES:", form.getValues());

    const firma = await signatureRef.current?.toFile({
      fileName: "firma-cliente.png",
    });

    if (!firma) {
      form.setError(
        "firmaCapturada",
        {
          type: "manual",
          message: "La firma es obligatoria",
        },
        {
          shouldFocus: false,
        },
      );

      return;
    }

    try {
      const response = await mutation.mutateAsync({
        nombreFirmante: values.nombreFirmante.trim(),

        telefonoFirmante: values.telefonoFirmante.trim(),

        firma,
      });

      onCompleted(response);
    } catch (error) {
      console.error("Error registrando conformidad:", error);

      setSubmitError(getTicketConformidadPublicErrorMessage(error));
    }
  };

  const signatureError = form.formState.errors.firmaCapturada?.message;

  return (
    <AppCard>
      <AppForm form={form} onSubmit={handleSubmit}>
        <AppStack gap="md">
          <div className="">
            <h2 className="text-base font-semibold sm:text-lg text-center p-2">
              Confirmar conformidad
            </h2>
          </div>

          {submitError && (
            <AppAlert tone="danger" title="No se pudo registrar la firma">
              {submitError}
            </AppAlert>
          )}

          <AppGrid
            cols={{
              base: 1,
              sm: 2,
            }}
            gap="xs"
            className="px-2"
          >
            <AppFormInput<TicketConformidadFirmaFormValues>
              name="nombreFirmante"
              label="Nombre completo"
              placeholder="Nombre del firmante"
              autoComplete="name"
              size="sm"
              fieldWidth="full"
              required
            />

            <AppFormInput<TicketConformidadFirmaFormValues>
              name="telefonoFirmante"
              label="Teléfono"
              placeholder="Número de teléfono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              size="sm"
              fieldWidth="full"
              required
            />
          </AppGrid>

          <TicketSignaturePad
            ref={signatureRef}
            required
            disabled={busy}
            invalid={Boolean(signatureError)}
            error={signatureError}
            onEmptyChange={handleSignatureEmptyChange}
          />

          <AppFormSubmit<TicketConformidadFirmaFormValues>
            variant="success"
            size="lg"
            width="full"
            className="min-h-[60px] text-base"
            loadingText="Registrando conformidad..."
            leftIcon={<CheckCircle2 size={20} aria-hidden="true" />}
            disableWhenInvalid
          >
            Confirmar y enviar
          </AppFormSubmit>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Al confirmar, la respuesta quedará registrada y este enlace ya no
            podrá utilizarse nuevamente.
          </p>
        </AppStack>
      </AppForm>
    </AppCard>
  );
}
