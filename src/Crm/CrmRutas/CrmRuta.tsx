"use client";
import { MapPin, Plus } from "lucide-react";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useAppStateHandlers } from "@/components/app/handlers";
import { RutasCobroList } from "./RutasCobroList";
import { RutasCobroCreate } from "./RutasCobroCreate";

type RutasCobroTab = "rutas" | "crear";

const TABS: Array<{
  value: RutasCobroTab;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "rutas",
    label: "Rutas existentes",
    description: "Consulta y administra rutas registradas",
    icon: <MapPin size={13} />,
  },
  {
    value: "crear",
    label: "Crear ruta",
    description: "Registra una nueva ruta de cobro",
    icon: <Plus size={13} />,
  },
];

function RutasCobroTabs({
  activeTab,
  onChange,
}: {
  activeTab: RutasCobroTab;
  onChange: (tab: RutasCobroTab) => void;
}) {
  return (
    <AppCard variant="outline" size="xs" className="p-1">
      <div
        role="tablist"
        aria-label="Secciones de rutas de cobro"
        className="grid grid-cols-1 gap-1 sm:grid-cols-2"
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${tab.value}`}
              id={`tab-${tab.value}`}
              onClick={() => onChange(tab.value)}
              className={[
                "flex min-w-0 items-center gap-2 rounded-[var(--app-radius-md)] px-3 py-2 text-left transition-colors",
                active
                  ? "bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]"
                  : "text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] hover:bg-[hsl(var(--app-muted,var(--muted)))/0.45]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--app-radius-md)]",
                  active
                    ? "bg-[hsl(var(--app-primary)/0.16)] text-[hsl(var(--app-primary))]"
                    : "bg-[hsl(var(--app-muted,var(--muted)))] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]",
                ].join(" ")}
              >
                {tab.icon}
              </span>

              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold leading-4">
                  {tab.label}
                </span>
                <span className="block truncate text-[10px] leading-3 opacity-80">
                  {tab.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </AppCard>
  );
}

export default function RutasCobroPage() {
  const state = useAppStateHandlers<{ activeTab: RutasCobroTab }>({
    activeTab: "rutas",
  });

  return (
    <PageTransitionCrm
      titleHeader="Rutas de cobro"
      subtitle="Administra rutas existentes o crea una nueva ruta"
      variant="fade-pure"
    >
      <AppStack gap="md">
        <AppInline align="center" justify="between" gap="sm" wrap>
          <RutasCobroTabs
            activeTab={state.state.activeTab}
            onChange={(tab) => state.setField("activeTab", tab)}
          />

          {state.state.activeTab === "rutas" ? (
            <AppButton
              type="button"
              variant="primary"
              size="xs"
              width="auto"
              leftIcon={<Plus size={13} />}
              onClick={() => state.setField("activeTab", "crear")}
            >
              Crear ruta
            </AppButton>
          ) : (
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<MapPin size={13} />}
              onClick={() => state.setField("activeTab", "rutas")}
            >
              Ver rutas
            </AppButton>
          )}
        </AppInline>

        <section
          id={`panel-${state.state.activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${state.state.activeTab}`}
          className="min-w-0"
        >
          {state.state.activeTab === "rutas" ? (
            <RutasCobroList />
          ) : (
            <RutasCobroCreate />
          )}
        </section>
      </AppStack>
    </PageTransitionCrm>
  );
}
