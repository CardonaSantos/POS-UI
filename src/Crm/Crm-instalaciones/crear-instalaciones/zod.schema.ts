import {
  EstadoInstalacionCliente,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";
import { z } from "zod";

const optionalText = (max: number, message: string) =>
  z.string().trim().max(max, message).optional().or(z.literal(""));

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

export const crearInstalacionSchema = z
  .object({
    clienteId: z
      .number()
      .int()
      .positive()
      .nullable()
      .refine((value) => value !== null, {
        message: "Seleccione un cliente",
      }),

    servicioInternetId: z.number().int().positive().nullable(),

    ticketId: z.number().int().positive().nullable(),

    asesorId: z.number().int().positive().nullable(),

    tipo: z.nativeEnum(TipoInstalacionCliente),

    estado: z.nativeEnum(EstadoInstalacionCliente),

    descripcion: z
      .string()
      .trim()
      .min(1, "Ingrese una descripción de la instalación")
      .max(500, "Máximo 500 caracteres"),

    motivo: optionalText(1000, "Máximo 1000 caracteres"),

    observaciones: optionalText(2000, "Máximo 2000 caracteres"),

    fechaProgramada: z.string().nullable(),

    fechaInicio: z.string().nullable(),

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
      saldoPendiente: optionalMoneyText,

      notas: optionalText(1000, "Máximo 1000 caracteres"),
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

    if (
      values.fechaProgramada &&
      values.fechaInicio &&
      values.fechaInicio < values.fechaProgramada
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["fechaInicio"],
        message:
          "La fecha de inicio no puede ser anterior a la fecha programada",
      });
    }
  });

export type CrearInstalacionFormValues = z.infer<typeof crearInstalacionSchema>;

export const CREAR_INSTALACION_DEFAULT_VALUES: CrearInstalacionFormValues = {
  clienteId: null,

  asesorId: null,

  servicioInternetId: null,
  ticketId: null,

  tipo: TipoInstalacionCliente.NUEVA,

  estado: EstadoInstalacionCliente.PROGRAMADA,

  descripcion: "",
  motivo: "",
  observaciones: "",

  fechaProgramada: null,
  fechaInicio: null,

  direccionInstalacion: "",
  referenciaUbicacion: "",

  coordenadas: "",

  tecnicoIds: [],
  tecnicoResponsableId: null,

  costos: {
    costoInstalacion: "",
    costoMateriales: "",
    costoManoObra: "",
    costoOtros: "",
    montoCobradoCliente: "",
    saldoPendiente: "",
    notas: "",
  },
};
