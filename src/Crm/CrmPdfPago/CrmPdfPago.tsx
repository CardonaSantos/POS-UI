"use client";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import logoCrm from "../../assets/logoNovaSinFondo.png";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Download, Printer, FileText, Receipt } from "lucide-react"; // Iconos nuevos
import { Button } from "@/components/ui/button";
import { formattMonedaGT } from "@/utils/formattMonedaGt";
import { formateDateWithMinutes } from "../Utils/FormateDate";
import { FacturaInternet } from "../features/cliente-interfaces/cliente-types";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { cn } from "@/lib/utils";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export default function CrmPdfPago() {
  const { factudaId } = useParams<{ factudaId: string }>();
  const [factura, setFactura] = useState<FacturaInternet | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // ESTADO NUEVO: Controla qué vista estamos viendo
  const [viewMode, setViewMode] = useState<"A4" | "THERMAL">("A4");

  // REFS: Necesitamos dos referencias separadas ahora
  const invoiceRef = useRef<HTMLDivElement>(null); // Tu ref original (A4)
  const thermalRef = useRef<HTMLDivElement>(null); // Nueva ref (Térmica)

  const formatDate = (dateString: string) =>
    dayjs(dateString).format("DD/MM/YYYY");

  // 1. Fetch de datos
  useEffect(() => {
    const fetchFactura = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${VITE_CRM_API_URL}/facturacion/factura-to-pdf/${factudaId}`,
        );
        if (response.status === 200) {
          setFactura(response.data);
        } else {
          toast.error("Error al cargar la factura");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al obtener datos de la factura");
      } finally {
        setLoading(false);
      }
    };
    fetchFactura();
  }, [factudaId]);

  // 2. Generar PDF (Lógica original, solo corre si estamos en modo A4)
  useEffect(() => {
    if (!factura || !invoiceRef.current || viewMode !== "A4") return;

    const generarPDF = async () => {
      try {
        if (!invoiceRef.current) return;

        // Esperamos un momento para asegurar que el renderizado esté listo
        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ unit: "mm", format: "a4" });
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        const blob = pdf.output("blob");
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error al generar PDF:", error);
      }
    };
    generarPDF();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [factura, viewMode]); // Añadido viewMode a dependencias

  // 3. Función de Impresión Universal (Navegador)
  const handlePrint = () => {
    window.print();
  };

  const esDispositivoMovil = () =>
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent,
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!factura) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información de la factura
        </h2>
      </div>
    );
  }

  return (
    <PageTransitionCrm titleHeader="Factura" subtitle={``} variant="fade-pure">
      {/* --- BARRA DE CONTROL (Solo visible en pantalla) --- */}
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center  p-4 rounded-lg print:hidden">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "A4" ? "default" : "outline"}
            onClick={() => {
              setViewMode("A4");
              setPdfUrl(null);
            }}
            size="sm"
          >
            <FileText className="w-4 h-4 mr-2" /> Original A4
          </Button>
          <Button
            variant={viewMode === "THERMAL" ? "default" : "outline"}
            onClick={() => {
              setViewMode("THERMAL");
              setPdfUrl(null);
            }}
            size="sm"
          >
            <Receipt className="w-4 h-4 mr-2" /> Vista Térmica
          </Button>
        </div>

        {/* Botón de imprimir manual (funciona para ambos modos) */}
        <Button onClick={handlePrint} variant="secondary" size="sm">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir (Térmico)
        </Button>
      </div>

      {/* --- ESTILOS DE IMPRESIÓN DINÁMICOS --- */}
      <style>{`
        @media print {
          @page { margin: 0; size: ${viewMode === "THERMAL" ? "80mm auto" : "auto"}; }
          body { visibility: hidden; }
          .printable-content { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
          /* Ocultar el que no sea el modo actual al imprimir */
          .mode-hidden { display: none !important; }
        }
      `}</style>

      {/* =================================================================================
          VISTA 1: ORIGINAL A4 (Tu código exacto)
         ================================================================================= */}
      <div
        className={cn(
          "printable-content",
          viewMode === "THERMAL" && "hidden mode-hidden",
        )}
      >
        <div className="">
          <div
            ref={invoiceRef}
            // Aquí mantengo tu lógica original, pero añado 'viewMode' para ocultarlo visualmente en pantalla si estamos en térmico
            className={`${
              pdfUrl && viewMode === "A4" ? "hidden" : "block"
            } mx-auto shadow-lg rounded-lg bg-white text-black`}
            style={{ width: "210mm", minHeight: "297mm", padding: "32px 48px" }}
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-300 p-5 rounded-t-lg">
              <div className="flex items-center">
                <div className="w-28 h-28  border-gray-200  overflow-hidden mr-4">
                  <img
                    src={logoCrm || "/placeholder.svg"}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">
                    {factura.empresa.nombre}
                  </h1>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-700">
                  #{factura.id}
                </p>
                <p className="text-xs font-medium text-gray-700">
                  Periodo #{factura?.periodo ?? "N/A"}
                </p>
              </div>
            </div>

            {/* Empresa & Estado */}
            <div className="flex justify-between mt-5 text-xs text-gray-600">
              <div>
                <p>{factura.empresa.direccion}</p>
                <p>
                  Tel: {factura.empresa.telefono} | PBX: {factura.empresa.pbx}
                </p>
                <p>{factura.empresa.correo}</p>
                <p>{factura.empresa.sitioWeb}</p>
              </div>
              <div>
                <p className="font-medium">{factura.estado}</p>
              </div>
            </div>

            {/* Cliente Info */}
            <div className="mb-5 p-4 rounded-md border-gray-200 mt-6 text-xs">
              <h2 className="font-medium text-gray-700 mb-2">
                Información del Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p>
                    <span className="font-medium">Nombre:</span>{" "}
                    {factura.cliente.nombre} {factura.cliente.apellidos}
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles de Servicio */}
            <div className="mb-5 mt-4 text-xs">
              <h2 className="font-medium text-gray-700 mb-2 border-b border-gray-200 pb-1">
                Detalles del Servicio
              </h2>
              <p className="bg-gray-50 p-3 rounded-md mb-3">
                {factura.detalleFactura}
              </p>
            </div>

            {/* Pagos Realizados */}
            <div className="mb-5 text-xs">
              <h2 className="font-medium text-gray-700 mb-2 pb-1">
                Pagos Realizados
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full  rounded-md  text-[0.85rem]">
                  <thead className="">
                    <tr>
                      <th className="py-1.5 px-4 text-left font-semibold">
                        Método
                      </th>
                      <th className="py-1.5 px-4 text-left font-semibold">
                        Monto
                      </th>
                      <th className="py-1.5 px-4  text-left font-semibold">
                        Fecha pagada
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {factura.pagos.map((pago, idx, arr) => (
                      <tr
                        key={pago.id}
                        className={idx % 2 === 0 ? "" : ""} // alterna ligeramente
                      >
                        <td
                          className={`
                  py-1.5 px-4 
                  ${idx !== arr.length - 1 ? "" : ""}
                `}
                        >
                          <span className="font-medium">{pago.metodoPago}</span>
                        </td>

                        <td
                          className={`
                  py-1.5 px-4 
                  ${idx !== arr.length - 1 ? "" : ""}
                `}
                        >
                          {formattMonedaGT(pago.montoPagado)}
                        </td>

                        <td
                          className={`
                  py-1.5 px-4 
                  ${idx !== arr.length - 1 ? "" : ""}
                `}
                        >
                          {formateDateWithMinutes(pago.fechaPago)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Servicios Adicionales */}
            {factura.servicios?.length > 0 && (
              <div className="mb-5 text-xs">
                <h2 className="font-medium text-gray-700 mb-2">
                  Servicios Adicionales
                </h2>
                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="py-1.5 px-3 border-b text-left">
                          Nombre
                        </th>
                        <th className="py-1.5 px-3 border-b text-left">
                          Fecha Emisión
                        </th>
                        <th className="py-1.5 px-3 border-b text-left">
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {factura.servicios &&
                        factura.servicios.map((serv, idx, arr) => (
                          <tr
                            key={serv.facturaId || idx}
                            className={
                              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td
                              className={`py-1.5 px-3 ${
                                idx !== arr.length - 1 ? "border-b" : ""
                              }`}
                            >
                              {serv.nombre}
                            </td>
                            <td
                              className={`py-1.5 px-3 ${
                                idx !== arr.length - 1 ? "border-b" : ""
                              }`}
                            >
                              {formatDate(serv.fecha)}
                            </td>
                            <td
                              className={`py-1.5 px-3 ${
                                idx !== arr.length - 1 ? "border-b" : ""
                              }`}
                            >
                              {formattMonedaGT(serv.monto)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pie de página */}
            <div className="mt-6 pt-2 border-t border-gray-200 text-center text-gray-500 text-xs">
              <p>
                Este documento es un comprobante de pago oficial de{" "}
                <span className="font-medium">{factura.empresa.nombre}</span>.
              </p>
              <p>
                Para cualquier consulta, comuníquese al teléfono{" "}
                <span className="font-medium">{factura.empresa.telefono}</span>.
              </p>
              <p className="mt-2 text-[10px]">
                Registro generado el{" "}
                {new Date().toLocaleDateString("es-GT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* PDF Preview (TU LOGICA ORIGINAL - Solo se muestra en A4) */}
          {pdfUrl && !esDispositivoMovil() && viewMode === "A4" && (
            <div className="mt-6">
              <iframe
                src={pdfUrl}
                className="w-full h-[80vh] border rounded shadow-md"
                title="Vista previa del PDF"
              />
            </div>
          )}

          {pdfUrl && esDispositivoMovil() && viewMode === "A4" && (
            <div className="mt-6 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  className="bg-green-600 font-semibold text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700"
                  asChild
                >
                  <a
                    href={pdfUrl}
                    download={`comprobante-${factura.id}.pdf`}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Descargar comprobante PDF
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================================
          VISTA 2: NUEVA VISTA TÉRMICA (Solo visible si viewMode === "THERMAL")
         ================================================================================= */}

      <div
        className={cn(
          "printable-content flex justify-center py-4 bg-gray-100",
          viewMode === "A4" && "hidden mode-hidden",
        )}
      >
        <div
          ref={thermalRef}
          className=" text-black shadow-md p-2"
          style={{
            width: "80mm",
            minHeight: "100mm",
            fontFamily: "monospace",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {/* Header Térmico Centrado */}
          <div className="flex flex-col items-center text-center border-b border-dashed border-black pb-2 mb-2 font-bold">
            <h2 className="font-bold text-sm uppercase">
              {factura.empresa.nombre}
            </h2>
            <p className="text-[12px]">{factura.empresa.telefono}</p>
            <p className="text-[12px]">{factura.empresa.direccion}</p>
          </div>

          {/* Datos Factura */}
          <div className="text-[12px] mb-2 pb-2 border-b border-dashed border-black font-bold justify-start ">
            <div className="flex ">
              <span>Recibo No:</span>
              <span className="font-bold">#{factura.id}</span>
            </div>
            <div className="flex ">
              <span>Periodo:</span>
              <span>{factura?.periodo ?? "N/A"}</span>
            </div>
            <div className="flex ">
              <span>Fecha:</span>
              <span>{formattFechaWithMinutes(dayjs().toDate())}</span>
            </div>
          </div>

          {/* Cliente */}
          <div className="mb-2 pb-2 border-b border-dashed border-black font-bold">
            <p className="font-bold text-[12px] mb-1">CLIENTE:</p>
            <p className="text-[12px] uppercase">
              {factura.cliente.nombre} {factura.cliente.apellidos}
            </p>
          </div>

          {/* Concepto */}
          <div className="mb-2 pb-2 border-b border-dashed border-black font-bold">
            <p className="font-bold text-[12px] mb-1">CONCEPTO:</p>
            <p className="text-[12px] leading-tight">
              {factura.detalleFactura}
            </p>
          </div>

          {/* Pagos */}
          <div className="mb-4 font-bold">
            <p className="font-bold text-[12px] mb-1 text-center border-b border-dashed border-black pb-1">
              - DETALLE PAGOS -
            </p>
            <table className="w-full text-[12px] mt-1">
              <tbody>
                {factura.pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td className="py-1 text-left">{pago.metodoPago}</td>
                    <td className="py-1 text-right font-bold">
                      {formattMonedaGT(pago.montoPagado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="text-right border-t-2 border-dashed border-black pt-2 mb-4">
            <span className="text-[14px] font-black">
              TOTAL:{" "}
              {formattMonedaGT(
                factura.pagos.reduce(
                  (acc, curr) => acc + parseFloat(curr.montoPagado.toString()),
                  0,
                ),
              )}
            </span>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] mt-4 font-bold">
            <p>*** GRACIAS POR SU PAGO ***</p>
          </div>
        </div>
      </div>
    </PageTransitionCrm>
  );
}
