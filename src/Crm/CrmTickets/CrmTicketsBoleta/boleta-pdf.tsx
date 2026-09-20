import type { BoletaSoporteDto } from "@/Crm/features/boleta-ticket/boleta-ticket";

import { formateDate } from "@/Crm/Utils/FormateDate";

import { forwardRef } from "react";

import logoNova from "@/assets/logoNovaSinFondo.png";

interface Props {
  boleta: BoletaSoporteDto;
}

const getPrioridadColor = (prioridad: string) => {
  switch (prioridad) {
    case "URGENTE":
    case "ALTA":
      return "text-red-600";

    case "MEDIA":
      return "text-amber-600";

    case "BAJA":
      return "text-green-600";

    default:
      return "text-gray-600";
  }
};

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "NUEVO":
    case "ABIERTA":
      return "text-blue-600";

    case "EN_PROCESO":
    case "PENDIENTE_REVISION":
      return "text-amber-600";

    case "CERRADA":
      return "text-green-600";

    default:
      return "text-gray-600";
  }
};

const PrintableBoleta = forwardRef<HTMLDivElement, Props>(
  function PrintableBoleta({ boleta }, ref) {
    const firmaCliente = boleta.firmaCliente;

    const firmaTecnico = boleta.firmaTecnico;

    return (
      <div
        ref={ref}
        className="mx-auto bg-white font-sans text-[12px] leading-snug text-black"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "14mm 16mm",
        }}
      >
        {/* ============================= */}
        {/* ENCABEZADO */}
        {/* ============================= */}

        <div className="mb-5 flex items-start justify-between border-b border-gray-300 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center">
              <img
                src={logoNova}
                alt="Logo Nova Sistemas"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1 className="mb-1 text-xl font-bold">
                {boleta.empresa?.nombre ?? "Empresa"}
              </h1>

              <p className="text-gray-600">
                {boleta.empresa?.direccion ?? "Dirección no disponible"}
              </p>

              <p className="text-gray-600">
                Tel: {boleta.empresa?.telefono ?? "N/A"}
              </p>

              <p className="text-gray-600">
                PBX: {boleta.empresa?.pbx ?? "N/A"}
              </p>

              <p className="text-gray-600">{boleta.empresa?.correo ?? "N/A"}</p>
            </div>
          </div>

          <div className="max-w-[75mm] text-right">
            <h2 className="text-base font-bold uppercase">
              Boleta de soporte técnico
            </h2>

            <p className="mt-2 text-gray-600">
              Ticket{" "}
              <span className="font-bold text-black">#{boleta.ticketId}</span>
            </p>

            <p className="text-gray-600">
              Emisión:{" "}
              <span className="font-medium text-black">
                {formateDate(boleta.fechaGeneracionBoleta)}
              </span>
            </p>
          </div>
        </div>

        {/* ============================= */}
        {/* CLIENTE */}
        {/* ============================= */}

        <section className="mb-4">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold uppercase">
            Información del cliente
          </h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded border border-gray-200 bg-gray-50 p-3">
            <p>
              <span className="text-gray-500">Nombre:</span>{" "}
              <span className="font-semibold">
                {boleta.cliente?.nombreCompleto ?? "Sin cliente asignado"}
              </span>
            </p>

            <p>
              <span className="text-gray-500">Teléfono:</span>{" "}
              <span className="font-semibold">
                {boleta.cliente?.telefono ?? "N/A"}
              </span>
            </p>

            <p className="col-span-2">
              <span className="text-gray-500">Dirección:</span>{" "}
              <span className="font-semibold">
                {boleta.cliente?.direccion ?? "N/A"}
              </span>
            </p>
          </div>
        </section>

        {/* ============================= */}
        {/* TICKET */}
        {/* ============================= */}

        <section className="mb-4">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold uppercase">
            Detalles del ticket
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border border-gray-200 bg-gray-50 p-3">
              <p className="mb-1">
                <span className="text-gray-500">Título:</span>{" "}
                <span className="font-semibold">{boleta.titulo}</span>
              </p>

              <p className="mb-1">
                <span className="text-gray-500">Estado:</span>{" "}
                <span
                  className={`font-semibold ${getEstadoColor(boleta.estado)}`}
                >
                  {boleta.estado}
                </span>
              </p>

              <p>
                <span className="text-gray-500">Prioridad:</span>{" "}
                <span
                  className={`font-semibold ${getPrioridadColor(
                    boleta.prioridad,
                  )}`}
                >
                  {boleta.prioridad}
                </span>
              </p>
            </div>

            <div className="rounded border border-gray-200 bg-gray-50 p-3">
              <p className="mb-1">
                <span className="text-gray-500">Fecha:</span>{" "}
                <span className="font-semibold">
                  {formateDate(boleta.fechaApertura)}
                </span>
              </p>

              <p>
                <span className="text-gray-500">Técnico:</span>{" "}
                <span className="font-semibold">
                  {boleta.tecnico?.nombre ?? "No asignado"}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ============================= */}
        {/* DESCRIPCIÓN */}
        {/* ============================= */}

        <section className="mb-4">
          <h2 className="mb-2 border-b border-gray-300 pb-1 text-sm font-bold uppercase">
            Descripción del problema
          </h2>

          <div className="min-h-[60px] rounded border border-gray-200 bg-gray-50 p-3">
            <p className="whitespace-pre-line text-gray-700">
              {boleta.descripcion || "No se proporcionó una descripción."}
            </p>
          </div>
        </section>

        {/* ============================= */}
        {/* CONFORMIDAD */}
        {/* ============================= */}

        {/* ============================= */}
        {/* FIRMAS */}
        {/* ============================= */}

        <section className="mt-6">
          <div className="grid grid-cols-2 gap-10">
            {/* CLIENTE */}

            <FirmaBoleta
              titulo="Firma del Cliente"
              url={firmaCliente?.url}
              nombre={
                firmaCliente?.nombreFirmante ??
                boleta.cliente?.nombreCompleto ??
                "Cliente"
              }
              fecha={firmaCliente?.firmadoEn ?? null}
            />

            {/* TÉCNICO */}

            <FirmaBoleta
              titulo="Firma del Técnico"
              url={firmaTecnico?.url}
              nombre={
                firmaTecnico?.nombreFirmante ??
                boleta.tecnico?.nombre ??
                "Técnico"
              }
              fecha={firmaTecnico?.firmadoEn ?? null}
            />
          </div>
        </section>

        {/* ============================= */}
        {/* PIE */}
        {/* ============================= */}

        <footer className="mt-10 border-t border-gray-300 pt-3 text-center text-[10px] text-gray-500">
          <p>
            Documento oficial de soporte técnico de{" "}
            {boleta.empresa?.nombre ?? "la empresa"}.
          </p>

          <p>Para consultas: {boleta.empresa?.telefono ?? "N/A"}</p>

          <p className="mt-1">
            Generado el {formateDate(boleta.fechaGeneracionBoleta)}
          </p>
        </footer>
      </div>
    );
  },
);

interface FirmaBoletaProps {
  titulo: string;

  url?: string | null;

  nombre: string;

  fecha: string | null;
}

function FirmaBoleta({ titulo, url, nombre, fecha }: FirmaBoletaProps) {
  return (
    <div className="text-center">
      {/*
       * Reservamos siempre la misma altura,
       * exista o no firma.
       */}
      <div className="flex h-[34mm] items-end justify-center px-4 pb-1">
        {url ? (
          <img
            src={url}
            alt={titulo}
            className="max-h-[30mm] max-w-full object-contain"
          />
        ) : (
          <p className="pb-3 text-xs italic text-gray-400">
            Sin firma registrada
          </p>
        )}
      </div>

      <div className="mx-auto border-t border-gray-500 pt-2">
        <p className="font-bold">{titulo}</p>

        <p className="mt-0.5 text-[11px] text-gray-700">{nombre}</p>

        {fecha && (
          <p className="mt-0.5 text-[10px] text-gray-500">
            Firmado: {formateDate(fecha)}
          </p>
        )}
      </div>
    </div>
  );
}

PrintableBoleta.displayName = "PrintableBoleta";

export default PrintableBoleta;
