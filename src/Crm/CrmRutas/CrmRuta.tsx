"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus } from "lucide-react";
import { RutasCobroList } from "./RutasCobroList";
import { RutasCobroCreate } from "./RutasCobroCreate";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
export default function RutasCobroPage() {
  const [activeTab, setActiveTab] = useState<string>("rutas");

  return (
    <PageTransitionCrm
      titleHeader="Rutas de cobro"
      subtitle=""
      variant="fade-pure"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="grid w-full grid-cols-2 md:w-auto h-8 p-0.5 rounded-lg">
          <TabsTrigger
            value="rutas"
            className="flex items-center gap-1 px-2 py-1 text-xs leading-none data-[state=active]:shadow-none"
          >
            <MapPin className="h-3 w-3" />
            <span>Rutas Existentes</span>
          </TabsTrigger>

          <TabsTrigger
            value="crear"
            className="flex items-center gap-1 px-2 py-1 text-xs leading-none data-[state=active]:shadow-none"
          >
            <Plus className="h-3 w-3" />
            <span>Crear Ruta</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rutas">
          <RutasCobroList />
        </TabsContent>

        <TabsContent value="crear">
          <RutasCobroCreate />
        </TabsContent>
      </Tabs>
    </PageTransitionCrm>
  );
}
