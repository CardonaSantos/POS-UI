import type { RealTimeLocationRaw } from "@/Crm/features/real-time-location/real-time-location";
import { RolUsuario } from "@/Crm/features/users/users-rol";
import type { TecnicoTrackingRealtimeView } from "@/Crm/features/real-time-location/tracking.interfaces";

function toRolUsuario(value: string): RolUsuario {
  const values = Object.values(RolUsuario) as string[];

  if (values.includes(value)) {
    return value as RolUsuario;
  }

  return RolUsuario.TECNICO;
}

/**
 * Adaptador temporal para reutilizar el mapa actual del dashboard sin tocarlo.
 * Los técnicos con sesión ACTIVA pero sin primer punto GPS todavía no se envían
 * al mapa; siguen contándose en el resumen del panel.
 */
export function toDashboardMapLocations(
  rows: TecnicoTrackingRealtimeView[],
): RealTimeLocationRaw[] {
  return rows.flatMap((row) => {
    if (!row.ubicacion) return [];

    return [
      {
        usuarioId: row.tecnico.id,
        latitud: row.ubicacion.latitud,
        longitud: row.ubicacion.longitud,
        precision: row.ubicacion.precision ?? 0,
        bateria: row.ubicacion.bateria ?? undefined,
        velocidad: row.ubicacion.velocidad ?? undefined,
        actualizadoEn: new Date(row.ubicacion.recibidoEn),
        usuario: {
          nombre: row.tecnico.nombre,
          rol: toRolUsuario(row.tecnico.rol),
          telefono: row.tecnico.telefono ?? "",
          avatarUrl: row.tecnico.avatarUrl ?? undefined,
        },
        ticketsEnProceso: row.actividad.ticketsEnProceso.map((ticket) => ({
          id: ticket.id,
          titulo: ticket.titulo ?? `Ticket #${ticket.id}`,
        })),
      },
    ];
  });
}
