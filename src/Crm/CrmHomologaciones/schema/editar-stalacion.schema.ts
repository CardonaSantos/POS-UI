import { TipoInstalacionCliente } from "@/Crm/features/instalaciones/enums";
import z from "zod";

export const EDITAR_INSTALACION_DEFAULT_VALUES: EditarInstalacionFormValues = {
  tipo: TipoInstalacionCliente.NUEVA,

  asesorId: null,

  ticketId: null,

  descripcion: "",

  motivo: "",

  observaciones: "",

  fechaProgramada: null,

  direccionInstalacion: "",

  referenciaUbicacion: "",

  coordenadas: "",

  tecnicoIds: [],

  tecnicoResponsableId: null,

  costos: {
    costoInstalacion: "0",
    costoMateriales: "0",
    costoManoObra: "0",
    costoOtros: "0",
    montoCobradoCliente: "0",
    notas: "",
  },
};

const optionalMoneyText = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === "") {
        return true;
      }

      const parsed = Number(value);

      return Number.isFinite(parsed) && parsed >= 0;
    },
    {
      message: "Ingrese un monto válido mayor o igual a 0",
    },
  );

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

const coordenadasSchema = z
  .string()
  .trim()
  .max(100, "Máximo 100 caracteres")
  .refine(
    (value) => {
      if (value === "") {
        return true;
      }

      const parts = value.split(",").map((part) => part.trim());

      if (parts.length !== 2) {
        return false;
      }

      const latitud = Number(parts[0]);
      const longitud = Number(parts[1]);

      if (!Number.isFinite(latitud) || !Number.isFinite(longitud)) {
        return false;
      }

      if (latitud < -90 || latitud > 90) {
        return false;
      }

      if (longitud < -180 || longitud > 180) {
        return false;
      }

      return true;
    },
    {
      message: 'Use el formato "latitud, longitud". Ejemplo: 15.668, -91.735',
    },
  );

export const editarInstalacionSchema = z
  .object({
    tipo: z.nativeEnum(TipoInstalacionCliente),

    asesorId: z.number().int().positive().nullable(),

    ticketId: z.number().int().positive().nullable(),

    descripcion: z
      .string()
      .trim()
      .min(1, "Ingrese una descripción de la instalación")
      .max(500, "Máximo 500 caracteres"),

    motivo: optionalText(1000, "Máximo 1000 caracteres"),

    observaciones: optionalText(2000, "Máximo 2000 caracteres"),

    fechaProgramada: z.string().nullable(),

    direccionInstalacion: optionalText(500, "Máximo 500 caracteres"),

    referenciaUbicacion: optionalText(500, "Máximo 500 caracteres"),

    coordenadas: coordenadasSchema,

    tecnicoIds: z
      .array(z.number().int().positive())
      .max(20, "Puede asignar un máximo de 20 técnicos")
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "No puede repetir técnicos",
      }),

    tecnicoResponsableId: z.number().int().positive().nullable(),

    costos: z.object({
      costoInstalacion: optionalMoneyText,

      costoMateriales: optionalMoneyText,

      costoManoObra: optionalMoneyText,

      costoOtros: optionalMoneyText,

      montoCobradoCliente: optionalMoneyText,

      notas: optionalText(2000, "Máximo 2000 caracteres"),
    }),
  })
  .superRefine((values, ctx) => {
    if (
      values.tecnicoResponsableId !== null &&
      !values.tecnicoIds.includes(values.tecnicoResponsableId)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["tecnicoResponsableId"],
        message:
          "El técnico responsable debe formar parte de los técnicos asignados",
      });
    }

    /*
     * En edición, si dejamos técnicos asignados,
     * exigimos responsable.
     */
    if (values.tecnicoIds.length > 0 && values.tecnicoResponsableId === null) {
      ctx.addIssue({
        code: "custom",
        path: ["tecnicoResponsableId"],
        message: "Seleccione al técnico responsable",
      });
    }
  });

export type EditarInstalacionFormValues = z.infer<
  typeof editarInstalacionSchema
>;
