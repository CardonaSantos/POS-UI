import { useMemo } from "react";

import logoNova from "@/assets/logoNovaSinFondo.png";

import {
  formatCurrency,
  parseContratoContenido,
} from "./helpers/contrato-pdf.utils";
import { ContratoInstalacionVistaResponse } from "../features/plantilla-contratos/plantilla-contratos";
import { formattShortFecha } from "@/utils/formattFechas";

interface ContratoDocumentProps {
  data: ContratoInstalacionVistaResponse;

  halfLetter?: boolean;
}

export function ContratoDocument({
  data,
  halfLetter = false,
}: ContratoDocumentProps) {
  const { empresa, instalacion, cliente, servicio, facturacion, documento } =
    data;

  const costosAplicados = [
    {
      label: "Instalación",
      value: instalacion.costoInstalacion,
    },
    {
      label: "Materiales",
      value: instalacion.costoMateriales,
    },
    {
      label: "Mano de obra",
      value: instalacion.costoManoObra,
    },
    {
      label: "Otros",
      value: instalacion.costoOtros,
    },
  ].filter((item) => item.value > 0);

  const totalCostosInstalacion = costosAplicados.reduce(
    (total, item) => total + item.value,
    0,
  );

  const mensualidad = servicio?.precio ?? 0;

  const totalInicial = mensualidad + totalCostosInstalacion;

  const tieneCostosAdicionales = costosAplicados.length > 0;

  const contenido = useMemo(
    () => parseContratoContenido(documento.contenido),
    [documento.contenido],
  );

  return (
    <article
      className={`contract-pdf ${
        halfLetter ? "contract-half-letter" : "contract-letter"
      }`}
    >
      {/* ================= HEADER ================= */}

      <header className="pdf-header contract-header">
        <div className="contract-company">
          <img
            src={logoNova}
            alt="Nova Sistemas"
            crossOrigin="anonymous"
            className="contract-logo"
          />

          <div>
            <h1>{empresa.nombre}</h1>

            {empresa.direccion && <p>{empresa.direccion}</p>}

            <p>Tel. {empresa.telefono || "N/A"}</p>

            {empresa.pbx && <p>PBX: {empresa.pbx}</p>}

            {empresa.correo && <p>{empresa.correo}</p>}
          </div>
        </div>

        <div className="contract-document-meta">
          <strong>CONTRATO DE SERVICIO</strong>

          <span>No. {documento.numero}</span>

          <span>Emitido: {formattShortFecha(documento.fechaEmision)}</span>
        </div>
      </header>

      {/* ================= CLIENTE ================= */}

      <section className="contract-section">
        <h2>Información del cliente</h2>

        <div className="contract-info-grid">
          <InfoItem label="Nombre" value={cliente.nombreCompleto} />

          <InfoItem label="Teléfono" value={cliente.telefono} />

          {cliente.dpi && <InfoItem label="DPI" value={cliente.dpi} />}

          <InfoItem
            full
            label="Dirección del servicio"
            value={cliente.direccionServicio}
          />

          {instalacion.referenciaUbicacion && (
            <InfoItem
              full
              label="Referencia"
              value={instalacion.referenciaUbicacion}
            />
          )}
        </div>
      </section>

      {/* ================= SERVICIO ================= */}

      <section className="contract-section">
        <h2>Servicio contratado</h2>

        <div className="contract-info-grid">
          <InfoItem label="Plan" value={servicio?.nombre} />

          <InfoItem label="Velocidad" value={servicio?.velocidad} />

          <InfoItem
            label="Mensualidad"
            value={servicio ? formatCurrency(servicio.precio) : null}
          />

          <InfoItem
            label="Día de pago"
            value={
              facturacion.diaPagoMensual
                ? `Día ${facturacion.diaPagoMensual} de cada mes`
                : null
            }
          />

          <InfoItem
            label="Instalación programada"
            value={formattShortFecha(instalacion.fechaProgramada)}
          />

          {tieneCostosAdicionales && (
            <InfoItem
              label="Costos de instalación"
              value={formatCurrency(totalCostosInstalacion)}
            />
          )}
        </div>

        {tieneCostosAdicionales && (
          <div className="contract-cost-summary">
            <div className="contract-cost-list">
              {costosAplicados.map((costo) => (
                <div key={costo.label} className="contract-cost-row">
                  <span>{costo.label}</span>

                  <strong>{formatCurrency(costo.value)}</strong>
                </div>
              ))}
            </div>

            <div className="contract-cost-total">
              <div>
                <span>Mensualidad</span>

                <strong>{formatCurrency(mensualidad)}</strong>
              </div>

              <div>
                <span>Costos de instalación</span>

                <strong>{formatCurrency(totalCostosInstalacion)}</strong>
              </div>

              <div className="contract-cost-grand-total">
                <span>Total inicial</span>

                <strong>{formatCurrency(totalInicial)}</strong>
              </div>
            </div>

            {instalacion.notasCostos && (
              <div className="contract-cost-notes">
                <strong>Nota sobre los costos</strong>

                <p>{instalacion.notasCostos}</p>
              </div>
            )}
          </div>
        )}

        {instalacion.observaciones && (
          <div className="contract-note">
            <strong>Observaciones</strong>

            <p>{instalacion.observaciones}</p>
          </div>
        )}
      </section>

      {/* ================= TÉRMINOS ================= */}

      <section className="contract-section contract-terms">
        <h2>Términos del contrato</h2>

        <div className="contract-terms-body">
          {contenido.length ? (
            contenido.map((block, index) => {
              if (block.type === "section") {
                return (
                  <h3 key={index} className="contract-term-section">
                    {block.text}
                  </h3>
                );
              }

              if (block.type === "subsection") {
                return (
                  <h4 key={index} className="contract-term-subsection">
                    {block.text}
                  </h4>
                );
              }

              return (
                <p key={index} className="contract-term-paragraph">
                  {block.text}
                </p>
              );
            })
          ) : (
            <p>Sin términos definidos.</p>
          )}
        </div>
      </section>

      {/* ================= FIRMAS ================= */}

      <section className="pdf-signatures contract-signatures">
        <Signature
          title="Firma del cliente"
          subtitle={cliente.nombreCompleto}
        />

        <Signature title="Firma del representante" subtitle={empresa.nombre} />
      </section>

      {/* ================= FOOTER ================= */}
    </article>
  );
}

function InfoItem({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string | number | null | undefined;
  full?: boolean;
}) {
  return (
    <div
      className={
        full ? "contract-info-item contract-info-full" : "contract-info-item"
      }
    >
      <span>{label}</span>

      <strong>{value ?? "N/A"}</strong>
    </div>
  );
}

function Signature({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="contract-signature">
      <div className="contract-signature-line" />

      <strong>{title}</strong>

      <span>{subtitle}</span>
    </div>
  );
}
