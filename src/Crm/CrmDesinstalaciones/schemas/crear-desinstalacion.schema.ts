import {
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";
import { z } from "zod";

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

/**
 * AppFormSingleSelect<number> devuelve:
 *
 * number | null
 *
 * Por eso el schema conserva null como valor válido de entrada
 * para RHF y usa refine para expresar la obligatoriedad real.
 */
const requiredNullableId = (message: string) =>
  z
    .number()
    .int()
    .positive()
    .nullable()
    .refine((value) => value !== null, {
      message,
    });

const optionalNullableId = z.number().int().positive().nullable();

/**
 * ============================================================
 * SCHEMA
 * ============================================================
 */

export const crearDesinstalacionSchema = z
  .object({
    /**
     * Cliente seleccionado desde el catálogo general.
     */
    clienteId: requiredNullableId("Seleccione un cliente."),

    /**
     * Acceso existente obtenido mediante el contexto
     * de creación del cliente.
     *
     * El frontend NO envía servicioInternetId.
     * El backend lo deriva desde este acceso.
     */
    accesoInternetId: requiredNullableId(
      "Seleccione el servicio que desea desinstalar.",
    ),

    /**
     * Ticket relacionado del mismo cliente.
     *
     * Es opcional.
     */
    ticketId: optionalNullableId,

    /**
     * Datos administrativos de la desinstalación.
     */
    tipo: z.nativeEnum(TipoDesinstalacionCliente, {
      message: "Seleccione un tipo de desinstalación.",
    }),

    motivo: z.nativeEnum(MotivoDesinstalacionCliente, {
      message: "Seleccione un motivo de desinstalación.",
    }),

    /**
     * Usaremos un input datetime-local.
     *
     * RHF conserva el string de UI.
     * El mapper será responsable de producir el ISO
     * que espera NestJS.
     */
    fechaProgramada: z
      .string()
      .trim()
      .min(1, "Seleccione la fecha y hora programadas.")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "La fecha programada no es válida.",
      }),

    /**
     * AppFormSwitch / AppFormCheckbox entregan boolean.
     */
    requiereRetiroEquipo: z.boolean(),

    /**
     * UI cómoda para técnicos.
     *
     * No usamos directamente tecnicos[] del DTO dentro
     * del formulario.
     */
    tecnicoIds: z.array(z.number().int().positive()),

    tecnicoResponsableId: optionalNullableId,

    /**
     * AppFormTextarea entrega siempre string.
     *
     * El mapper convertirá "" en undefined/null según
     * el contrato CREATE.
     */
    observaciones: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    /**
     * Si existe responsable, obligatoriamente debe
     * pertenecer a los técnicos seleccionados.
     */
    if (
      values.tecnicoResponsableId !== null &&
      !values.tecnicoIds.includes(values.tecnicoResponsableId)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,

        path: ["tecnicoResponsableId"],

        message:
          "El técnico responsable debe formar parte de los técnicos asignados.",
      });
    }
  });

/**
 * ============================================================
 * FORM VALUES
 * ============================================================
 *
 * El tipo nace exclusivamente del schema.
 *
 * No duplicamos una interface manual.
 */
export type CrearDesinstalacionFormValues = z.infer<
  typeof crearDesinstalacionSchema
>;

/**
 * ============================================================
 * DEFAULT VALUES
 * ============================================================
 *
 * Deben coincidir con los valores reales entregados por
 * nuestros wrappers AppForm*.
 */
export const CREAR_DESINSTALACION_DEFAULT_VALUES: CrearDesinstalacionFormValues =
  {
    clienteId: null,

    accesoInternetId: null,

    ticketId: null,

    tipo: TipoDesinstalacionCliente.COMPLETA,

    motivo: MotivoDesinstalacionCliente.VOLUNTARIA,

    fechaProgramada: "",

    requiereRetiroEquipo: true,

    tecnicoIds: [],

    tecnicoResponsableId: null,

    observaciones: "",
  };
