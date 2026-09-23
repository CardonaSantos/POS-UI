import type { Route } from "./crm-route-types";

import {
  botMensajeriaRoute,
  campaniasWhatsappRoute,
  clientesRoute,
  creditosRoute,
  dashboardRoute,
  desinstalacionesAuthRoute,
  desinstalacionesRoute,
  facturacionZonaRoute,
  instalacionesRoute,
  // opticoRoute,
  perfilRoute,
  plantillasContratosRoute,
  pppoeRoute,
  registrosEliminadosRoute,
  reportsRoute,
  rutasCobroRoute,
  sectoresRoute,
  serviciosRoute,
  soporteRoute,
} from "./crm-route-items";

export const routesCrm_CoordinadorOperaciones: Route[] = [
  dashboardRoute,

  clientesRoute,

  instalacionesRoute,

  pppoeRoute,

  soporteRoute,

  desinstalacionesRoute,

  desinstalacionesAuthRoute,

  serviciosRoute,

  facturacionZonaRoute,

  sectoresRoute,

  botMensajeriaRoute,
  campaniasWhatsappRoute,
  plantillasContratosRoute,

  rutasCobroRoute,

  // opticoRoute,

  creditosRoute,

  registrosEliminadosRoute,

  reportsRoute,

  perfilRoute,
];
