import * as React from "react";
import { History, MapPinned, RadioTower } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppTabs, type AppTabItem } from "@/components/app/primitives/app-tabs";

import { useTabChangeWithUrl } from "@/Crm/Utils/Components/handleTabChangeWithParamURL";
import { useTrackingRealtimeQuerySync } from "@/Crm/CrmHooks/hooks/use-real-time-location/use-tracking";

import { TrackingRealtimePanel } from "./components/tracking-realtime-panel";
import { TrackingHistoryPanel } from "./components/tracking-history-panel";

type TrackingTab = "mapa" | "jornadas";

function normalizeTrackingTab(value: string | null): TrackingTab {
  return value === "jornadas" ? "jornadas" : "mapa";
}

export default function TrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = normalizeTrackingTab(searchParams.get("tab"));
  const [activeTab, setActiveTab] = React.useState<TrackingTab>(urlTab);

  useTrackingRealtimeQuerySync();

  React.useEffect(() => {
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [activeTab, urlTab]);

  const handleTabChange = useTabChangeWithUrl({
    activeTab,
    setActiveTab: (value) => setActiveTab(normalizeTrackingTab(value)),
    searchParams,
    setSearchParams,
  });

  const tabs = React.useMemo<Array<AppTabItem<TrackingTab>>>(
    () => [
      {
        value: "mapa",
        label: "Mapa en vivo",
        icon: <MapPinned size={15} aria-hidden="true" />,
        content: <TrackingRealtimePanel />,
      },
      {
        value: "jornadas",
        label: "Jornadas",
        icon: <History size={15} aria-hidden="true" />,
        content: <TrackingHistoryPanel />,
      },
    ],
    [],
  );

  return (
    <PageTransitionCrm titleHeader="Seguimiento" variant="fade-pure">
      <AppContainer size="xl" paddingX="sm" paddingY="md">
        <AppStack gap="md">
          <AppInline align="start" gap="sm" wrap={false} fullWidth>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <RadioTower className="size-4" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-base font-semibold tracking-tight">
                Seguimiento de técnicos
              </h1>
            </div>
          </AppInline>

          <AppTabs<TrackingTab>
            tabs={tabs}
            value={activeTab}
            onValueChange={handleTabChange}
            variant="compact"
            size="sm"
            contentSpacing="sm"
            fullWidth
            listClassName="w-full"
          />
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
