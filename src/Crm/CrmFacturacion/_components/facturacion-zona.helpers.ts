import type {
  FacturacionZona,
  NuevaFacturacionZona,
} from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

export type ZonaFormState = NuevaFacturacionZona & {
  id?: number;
};

export function createDefaultZona(empresaId: number): ZonaFormState {
  return {
    nombre: "",
    empresaId,
    diaGeneracionFactura: 10,
    enviarRecordatorioGeneracion: false,
    diaPago: 20,
    enviarAvisoPago: false,
    diaRecordatorio: 5,
    enviarRecordatorio1: false,
    diaSegundoRecordatorio: 15,
    enviarRecordatorio2: false,
    horaRecordatorio: "08:00:00",
    enviarRecordatorio: true,
    diaCorte: 25,
    suspenderTrasFacturas: 2,
    creadoEn: "",
    actualizadoEn: "",
    email: false,
    whatsapp: true,
    sms: false,
    llamada: false,
    telegram: false,
  };
}

export function zonaToForm(zona: FacturacionZona): ZonaFormState {
  return {
    ...createDefaultZona(zona.empresaId),
    ...zona,
    id: zona.id,
    nombre: zona.nombre ?? "",
    diaCorte: zona.diaCorte ?? 25,
    suspenderTrasFacturas: zona.suspenderTrasFacturas ?? 2,
    diaGeneracionFactura: zona.diaGeneracionFactura ?? 10,
    diaPago: zona.diaPago ?? 20,
    diaRecordatorio: zona.diaRecordatorio ?? 5,
    diaSegundoRecordatorio: zona.diaSegundoRecordatorio ?? 15,
  };
}

export function buildZonaPayload(form: ZonaFormState): NuevaFacturacionZona {
  return {
    ...form,
    nombre: form.nombre.trim(),
    empresaId: Number(form.empresaId),
    diaGeneracionFactura: Number(form.diaGeneracionFactura || 0),
    diaPago: Number(form.diaPago || 0),
    diaRecordatorio: Number(form.diaRecordatorio || 0),
    diaSegundoRecordatorio: Number(form.diaSegundoRecordatorio || 0),
    diaCorte: form.diaCorte ? Number(form.diaCorte) : null,
    suspenderTrasFacturas: form.suspenderTrasFacturas
      ? Number(form.suspenderTrasFacturas)
      : null,
  };
}

export function validateZonaForm(form: ZonaFormState) {
  if (!form.nombre.trim()) return "Ingrese el nombre de la zona.";

  if (!form.diaGeneracionFactura) {
    return "Ingrese el día de generación de factura.";
  }

  if (!form.diaPago) return "Ingrese el día de pago.";
  if (!form.diaRecordatorio) return "Ingrese el primer recordatorio.";
  if (!form.diaSegundoRecordatorio) return "Ingrese el segundo recordatorio.";

  return null;
}

export function filterZonas(zonas: FacturacionZona[], search: string) {
  const term = search.trim().toLowerCase();

  if (!term) return zonas;

  return zonas.filter((zona) => zona.nombre.toLowerCase().includes(term));
}

export function getZonaStats(zonas: FacturacionZona[]) {
  return {
    totalZonas: zonas.length,
    totalClientes: zonas.reduce(
      (acc, zona) => acc + (zona.clientesCount ?? 0),
      0,
    ),
    totalFacturas: zonas.reduce(
      (acc, zona) => acc + (zona.facturasCount ?? 0),
      0,
    ),
  };
}
