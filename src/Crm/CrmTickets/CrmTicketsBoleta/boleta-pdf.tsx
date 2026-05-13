import { BoletaSoporteDto } from "@/Crm/features/boleta-ticket/boleta-ticket";
import { formateDate } from "@/Crm/Utils/FormateDate";
import { forwardRef } from "react";
import logoNova from "@/assets/logoNovaSinFondo.png";

interface Props {
  boleta: BoletaSoporteDto;
}

const pdfUrl = false;

const getPrioridadColor = (prioridad: string) => {
  switch (prioridad) {
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
      return "text-amber-600";
    case "CERRADA":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

const PrintableBoleta = forwardRef<HTMLDivElement, Props>(({ boleta }, ref) => {
  return (
    <div ref={ref} className="p-8 font-sans text-sm">
      <div className="p-6">
        <div
          ref={ref}
          className={`${
            pdfUrl ? "hidden" : "block"
          } mx-auto  rounded-lg bg-white text-black`}
          style={{ width: "210mm", minHeight: "297mm", padding: "32px 48px" }}
        >
          {/* Encabezado con logo */}
          <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-24 h-24 flex items-center justify-center rounded">
                  <img
                    src={logoNova || "/placeholder.svg"}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary mb-1">
                  {boleta.empresa?.nombre || "Empresa"}
                </h1>
                <p className="text-gray-600">
                  {boleta.empresa?.direccion || "Dirección no disponible"}
                </p>
                <p className="text-gray-600">
                  Tel: {boleta.empresa?.telefono || "N/A"}
                </p>
                <p className="text-gray-600">
                  PBX: {boleta.empresa?.pbx || "N/A"}
                </p>
                <p className="text-gray-600">
                  Email: {boleta.empresa?.correo || "N/A"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-black px-4 py-2 rounded-md inline-block mb-2">
                <h2 className="font-semibold">BOLETA DE SOPORTE TÉCNICO</h2>
              </div>
              <p className="text-gray-600">
                No. Ticket:{" "}
                <span className="font-semibold">
                  {boleta.ticketId ?? "N/A"}
                </span>
              </p>
              <p className="text-gray-600">
                Fecha de emisión:{" "}
                <span className="font-semibold">
                  {formateDate(boleta.fechaGeneracionBoleta)}
                </span>
              </p>
            </div>
          </div>

          {/* Información del cliente */}
          <div className="mb-6 bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
              Información del Cliente
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  Nombre:{" "}
                  <span className="font-semibold">
                    {boleta.cliente?.nombreCompleto || "Sin cliente asignado"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Dirección:{" "}
                  <span className="font-semibold">
                    {boleta.cliente?.direccion || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  Teléfono:{" "}
                  <span className="font-semibold">
                    {boleta.cliente?.telefono || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Detalles del ticket */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
              Detalles del Ticket
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-600">
                  Título:{" "}
                  <span className="font-semibold">
                    {boleta.titulo || "Sin título"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Estado:{" "}
                  <span
                    className={`font-semibold ${getEstadoColor(boleta.estado)}`}
                  >
                    {boleta.estado}
                  </span>
                </p>
                <p className="text-gray-600">
                  Prioridad:{" "}
                  <span
                    className={`font-semibold ${getPrioridadColor(
                      boleta.prioridad,
                    )}`}
                  >
                    {boleta.prioridad}
                  </span>
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-600">
                  Fecha de ticket:{" "}
                  <span className="font-semibold">
                    {formateDate(boleta.fechaApertura)}
                  </span>
                </p>

                <p className="text-gray-600">
                  Técnico asignado:{" "}
                  <span className="font-semibold">
                    {boleta.tecnico?.nombre || "No asignado"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-700 mb-2">
                Descripción del problema:
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {boleta.descripcion || "No se proporcionó una descripción."}
              </p>
            </div>
          </div>

          {/* Observaciones */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
              Observaciones
            </h2>
            <div className="bg-gray-50 p-4 rounded-md min-h-[80px]"></div>
          </div>

          {/* Firmas */}
          <div className="grid grid-cols-2 gap-8 mt-12 mb-6">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mx-auto w-64">
                <p className="font-semibold">Firma del Cliente</p>
                <p className="text-sm text-gray-600">
                  {boleta.cliente?.nombreCompleto || "_________________"}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mx-auto w-64">
                <p className="font-semibold">Firma del Técnico</p>
                <p className="text-sm text-gray-600">
                  {boleta.tecnico?.nombre || "Técnico no asignado"}
                </p>
              </div>
            </div>
          </div>

          {/* Pie de página */}
          <div className="mt-12 pt-4 border-t border-gray-300 text-center text-gray-500 text-sm">
            <p>
              Este documento es una boleta oficial de soporte técnico de{" "}
              {boleta.empresa?.nombre || "la empresa"}.
            </p>
            <p>
              Para cualquier consulta, comuníquese al teléfono{" "}
              {boleta.empresa?.telefono || "N/A"}
            </p>
            <p className="mt-2">
              Generado el {formateDate(boleta.fechaGeneracionBoleta)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PrintableBoleta;
