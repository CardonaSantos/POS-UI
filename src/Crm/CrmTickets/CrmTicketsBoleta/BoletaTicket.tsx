"use client";

import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import logoNova from "@/assets/logoNovaSinFondo.png";
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale("es");

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export interface BoletaSoporteDto {
  ticketId: number;
  titulo: string;
  descripcion: string;
  estado: "NUEVO" | "ABIERTA" | "EN_PROCESO" | "CERRADA";
  prioridad: "BAJA" | "MEDIA" | "ALTA";
  fechaApertura: string; // ISO date string
  fechaCierre: string | null;
  fechaGeneracionBoleta: string; // fecha de impresión o emisión

  cliente: {
    id: number;
    nombreCompleto: string;
    telefono: string;
    direccion: string;
  };

  tecnico: {
    id: number;
    nombre: string;
  } | null;

  empresa: {
    id: number;
    nombre: string;
    direccion: string;
    correo: string;
    telefono: string;
    pbx: string;
  };
}

function BoletaTicket() {
  const { ticketId } = useParams();
  const [boleta, setBoleta] = useState<BoletaSoporteDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const boletaRef = useRef<HTMLDivElement>(null);

  const getInfoBoleta = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${VITE_CRM_API_URL}/tickets-soporte/get-ticket-boleta/${ticketId}`
      );

      if (response.status === 200) {
        setBoleta(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener datos del ticket");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

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
        return "text-blue-600";
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

  // Fetch boleta data
  useEffect(() => {
    getInfoBoleta();
  }, [ticketId]);

  // Generar PDF cuando los datos están listos
  useEffect(() => {
    if (!boleta || !boletaRef.current) return;

    const generarPDF = async () => {
      try {
        if (!boletaRef.current) {
          throw new Error("Boleta reference is null");
        }
        const canvas = await html2canvas(boletaRef.current, {
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
  }, [boleta]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!boleta) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">
          No se pudo cargar la información del ticket
        </h2>
        <button
          onClick={getInfoBoleta}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div
        ref={boletaRef}
        className={`${
          pdfUrl ? "hidden" : "block"
        } mx-auto shadow-lg rounded-lg bg-white text-black`}
        style={{ width: "210mm", minHeight: "297mm", padding: "32px 48px" }}
      >
        {/* Encabezado con logo */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
          <div className="flex items-center">
            {/* Espacio para el logo */}
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
              <p className="text-gray-600">{boleta.empresa.direccion}</p>
              <p className="text-gray-600">Tel: {boleta.empresa.telefono}</p>
              <p className="text-gray-600">PBX: {boleta.empresa.pbx}</p>
              <p className="text-gray-600">Email: {boleta.empresa.correo}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-black px-4 py-2 rounded-md inline-block mb-2">
              <h2 className="font-semibold">BOLETA DE SOPORTE TÉCNICO</h2>
            </div>
            <p className="text-gray-600">
              No. Ticket:{" "}
              <span className="font-semibold">{boleta.ticketId}</span>
            </p>
            <p className="text-gray-600">
              Fecha de emisión:{" "}
              <span className="font-semibold">
                {formatDate(boleta.fechaGeneracionBoleta)}
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
                  {boleta.cliente?.nombreCompleto || "Cliente no especificado"}
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
                Título: <span className="font-semibold">{boleta.titulo}</span>
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
                    boleta.prioridad
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
                  {formatDate(boleta.fechaApertura)}
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
              {boleta.descripcion}
            </p>
          </div>
        </div>

        {/* Observaciones */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2 border-b border-gray-200 pb-1">
            Observaciones
          </h2>
          <div className="bg-gray-50 p-4 rounded-md min-h-[80px]">
            {/* Espacio para observaciones */}
          </div>
        </div>

        {/* Firmas */}
        <div className="grid grid-cols-2 gap-8 mt-12 mb-6">
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2 mx-auto w-64">
              <p className="font-semibold">Firma del Cliente</p>
              <p className="text-sm text-gray-600">
                {boleta.cliente?.nombreCompleto}
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
            Para cualquier consulta, comuníquese al teléfono (502){" "}
            {boleta.empresa.telefono}
          </p>
          <p className="mt-2">
            Generado el {formatDate(boleta.fechaGeneracionBoleta)}
          </p>
        </div>
      </div>

      {/* PDF Preview */}
      {pdfUrl && (
        <div className="mt-6">
          <iframe
            src={pdfUrl}
            className="w-full h-[80vh] border rounded shadow-md"
            title="Vista previa del PDF"
          />
        </div>
      )}
    </div>
  );
}

export default BoletaTicket;
