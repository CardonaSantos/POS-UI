import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetTicketsAsignados } from "../CrmHooks/hooks/dashboard/useDashboard";
import { useStoreCrm } from "../ZustandCrm/ZustandCrmContext";
import { ClipboardList, Loader2, AlertTriangle } from "lucide-react";
import { TicketAsignadoCard } from "./_components/tec-ticket/TicketAsignadoCard";

function TecDashboard() {
  const tecId: number = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const { data: tks = [], isLoading, isError } = useGetTicketsAsignados(tecId);

  const tickets = Array.isArray(tks) ? tks : [];

  return (
    <PageTransitionCrm titleHeader="Técnico Dashboard" variant="fade-pure">
      <div className="flex flex-col gap-3 h-full">
        {/* Resumen superior */}
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tickets asignados</p>
              <p className="text-base font-semibold">
                {tickets.length} en total
              </p>
            </div>
          </div>
        </header>

        {/* Estados de carga / error / vacío */}
        {isLoading && (
          <div className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Cargando tickets...
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-1 items-center justify-center py-10 text-sm text-rose-500 gap-2">
            <AlertTriangle className="w-4 h-4" />
            Ocurrió un error al cargar tus tickets.
          </div>
        )}

        {!isLoading && !isError && tickets.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground text-center">
            No tienes tickets asignados por ahora.
          </div>
        )}

        {/* Lista de tickets */}
        <section className="flex-1 space-y-3 pb-2">
          {tickets.map((ticket) => (
            <TicketAsignadoCard key={ticket.id} ticket={ticket} />
          ))}
        </section>
      </div>
    </PageTransitionCrm>
  );
}

export default TecDashboard;
