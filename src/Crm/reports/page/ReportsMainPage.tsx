import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useApiQuery } from "@/hooks/genericoCall/genericoCallHook";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

type ActivosFilter = "all" | "true" | "false";

function buildFilename(
  desde?: string,
  hasta?: string,
  suffix = "clientes_internet"
) {
  const safe = (s?: string) => (s ? s.replace(/:/g, "-") : "");
  if (desde || hasta) return `${suffix}_${safe(desde)}_${safe(hasta)}.xlsx`;
  return `${suffix}_todos.xlsx`;
}

export default function ReportsMainPage() {
  // filtros (opcionales)
  const [desde, setDesde] = React.useState<string>("");
  const [hasta, setHasta] = React.useState<string>("");
  const [sectorId, setSectorId] = React.useState<string>("");
  const [servicioInternetId, setServicioInternetId] =
    React.useState<string>("");
  const [activos, setActivos] = React.useState<ActivosFilter>("all");

  // params → limpia valores vacíos
  const params = React.useMemo(() => {
    const p: Record<string, any> = {};
    if (desde) p.desde = desde;
    if (hasta) p.hasta = hasta;
    if (sectorId) p.sectorId = Number(sectorId);
    if (servicioInternetId) p.servicioInternetId = Number(servicioInternetId);
    if (activos !== "all") p.activos = activos; // "true" | "false" como string
    return p;
  }, [desde, hasta, sectorId, servicioInternetId, activos]);

  // query “perezosa” (enabled:false), descarga Excel (blob) al hacer refetch
  const { data, refetch, isFetching, isSuccess } = useApiQuery<Blob>(
    ["reporte-clientes-internet", params],
    "/reports/clientes-internet.xlsx",
    { params, responseType: "blob" as const },
    { enabled: false, retry: false, staleTime: 0 }
  );
  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = buildFilename(desde, hasta);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onDownload = async () => {
    const result = await refetch(); // v5 devuelve QueryObserverResult
    // result.data puede ser undefined si hubo error o no corrió
    if (result.data instanceof Blob) {
      downloadBlob(result.data);
    } else if (result.error) {
      console.error("Error descargando Excel", result.error);
      alert("No se pudo descargar el Excel");
    } else {
      console.warn("No hubo datos para descargar");
    }
  };
  React.useEffect(() => {
    if (isSuccess && data instanceof Blob) {
      downloadBlob(data);
    }
  }, [isSuccess, data]);

  const onClear = () => {
    setDesde("");
    setHasta("");
    setSectorId("");
    setServicioInternetId("");
    setActivos("all");
  };

  return (
    <PageTransitionCrm titleHeader="Reportes" subtitle={``} variant="fade-pure">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Clientes de Internet
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filtros (opcionales)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="desde">Desde (creado en)</Label>
              <Input
                id="desde"
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hasta">Hasta</Label>
              <Input
                id="hasta"
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>

            {/* <div className="space-y-1.5 sm:col-span-2">
              <Label>Estado</Label>
              <Select
                value={activos}
                onValueChange={(v: ActivosFilter) => setActivos(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activos</SelectItem>
                  <SelectItem value="false">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={onDownload}
              disabled={isFetching}
              className="w-full sm:w-auto"
            >
              {isFetching ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generando…
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Excel
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={onClear}
              disabled={isFetching}
              className="w-full sm:w-auto"
            >
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageTransitionCrm>
  );
}
