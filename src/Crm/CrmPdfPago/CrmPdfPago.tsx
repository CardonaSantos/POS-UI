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

import type { FacturaInternet } from "./PdfPagoInterface";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formattMonedaGT } from "@/utils/formattMonedaGt";
import { formateDateWithMinutes } from "../Utils/FormateDate";

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export default function CrmPdfPago() {
  const { factudaId } = useParams<{ factudaId: string }>();
  const [factura, setFactura] = useState<FacturaInternet | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) =>
    dayjs(dateString).format("DD/MM/YYYY");

  // Fetch invoice data
  useEffect(() => {
    const fetchFactura = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${VITE_CRM_API_URL}/facturacion/factura-to-pdf/${factudaId}`
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

  // Generate PDF when data is ready
  useEffect(() => {
    if (!factura || !invoiceRef.current) return;
    const generarPDF = async () => {
      try {
        if (!invoiceRef.current) {
          throw new Error("Invoice reference is null");
        }
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
        // toast.error("Error al generar PDF");
      }
    };
    generarPDF();
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [factura]);

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
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const esDispositivoMovil = () =>
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
      navigator.userAgent
    );

  return (
    <div className="p-6">
      <div
        ref={invoiceRef}
        className={`${
          pdfUrl ? "hidden" : "block"
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
            <p className="text-xs font-medium text-gray-700">#{factura.id}</p>
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
            <p className="font-medium">{factura.estadoFacturaInternet}</p>
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
                  <th className="py-1.5 px-4 text-left font-semibold">Monto</th>
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
                    <th className="py-1.5 px-3 border-b text-left">Nombre</th>
                    <th className="py-1.5 px-3 border-b text-left">
                      Fecha Emisión
                    </th>
                    <th className="py-1.5 px-3 border-b text-left">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {factura.servicios &&
                    factura.servicios.map((serv, idx, arr) => (
                      <tr
                        key={serv.facturaId || idx}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
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

      {/* PDF Preview */}
      {pdfUrl && !esDispositivoMovil() && (
        <div className="mt-6">
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh] border rounded shadow-md"
            title="Vista previa del PDF"
          />
        </div>
      )}

      {pdfUrl && esDispositivoMovil() && (
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
  );
}
