import {
  FileSpreadsheet,
  ReceiptText,
  TicketCheck,
  UsersRound,
} from "lucide-react";

import { AppTabs, type AppTabItem } from "@/components/app/primitives/app-tabs";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { ReporteClientesPanel } from "../components/reporte-clientes-panel";
import { ReporteTicketsPanel } from "../components/reporte-tickets-panel";
import { ReporteFacturacionPanel } from "../components/reporte-facturacion-panel";

// TABS

const REPORT_TABS: AppTabItem[] = [
  {
    value: "clientes",
    label: "Clientes",
    icon: <UsersRound size={15} aria-hidden="true" />,
    content: <ReporteClientesPanel />,
  },

  {
    value: "tickets",
    label: "Tickets",
    icon: <TicketCheck size={15} aria-hidden="true" />,
    content: <ReporteTicketsPanel />,
  },

  {
    value: "facturacion",
    label: "Facturación",
    icon: <ReceiptText size={15} aria-hidden="true" />,
    content: <ReporteFacturacionPanel />,
  },
];

// PAGE

export function ReportesPage() {
  return (
    <PageTransitionCrm titleHeader="Reportes" variant="fade-pure">
      <AppContainer size="xl" paddingX="sm" paddingY="md">
        <AppStack gap="md">
          <AppInline align="start" gap="sm" wrap={false} fullWidth>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileSpreadsheet className="size-4" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <AppInline align="center" gap="xs" wrap>
                <h1 className="text-base font-semibold tracking-tight">
                  Generación de reportes
                </h1>

                <AppBadge tone="info" appearance="soft" size="xs">
                  Excel
                </AppBadge>
              </AppInline>

              <p className="mt-0.5 text-sm text-muted-foreground">
                Selecciona un reporte, aplica los filtros necesarios y genera el
                archivo.
              </p>
            </div>
          </AppInline>

          <AppTabs
            defaultValue="clientes"
            tabs={REPORT_TABS}
            variant="compact"
            size="sm"
            contentSpacing="sm"
            fullWidth
          />
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
