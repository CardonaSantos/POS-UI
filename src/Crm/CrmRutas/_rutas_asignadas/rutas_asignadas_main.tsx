"use client";

import DesvanecerHaciaArriba from "@/Crm/Motion/DashboardAnimations";
import { PageHeader } from "@/Crm/Utils/Components/PageHeader";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { motion } from "framer-motion";
import { FindRutasAsignadasResult } from "./rutas-asignadas.type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  RotateCw,
  MoreHorizontal,
  Play,
  User,
  CircleUserRound,
  Map,
  Clock,
} from "lucide-react";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formattShortFecha } from "@/utils/formattFechas";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/** Variants para items (entrada sutil). */

import type { Variants, Transition, MotionProps } from "framer-motion";
import { Link } from "react-router-dom";
import { CRM } from "@/hooks/indexCalls";

// Define el transition con tipo explícito (evita el "string" ensanchado)
const SPRING: Transition = {
  type: "spring",
  bounce: 0.2,
  duration: 0.35,
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: SPRING },
};

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, when: "beforeChildren" },
  },
};

// Si usas el objeto DesvanecerHaciaArriba para spreadear en motion.div:
export const DesvanecerHaciaArribaProps: MotionProps = {
  initial: "hidden",
  animate: "visible",
  variants: containerVariants,
};

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs sm:text-sm">
      <Icon className="h-4 w-4 shrink-0" />
      <span className="font-medium">{label}:</span>
      <span className="text-foreground/80">{value}</span>
    </div>
  );
}

function RutaCardMobile({
  ruta,
}: // onStart,
{
  ruta: FindRutasAsignadasResult["rutas"][number];
  onStart?: () => void;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="shadow-sm">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-base leading-tight flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span className="truncate">{ruta.nombreRuta}</span>
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>{formattShortFecha(ruta.creadoEn)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="col-span-2 flex items-center gap-2">
            <CircleUserRound className="h-4 w-4" />
            <span className="truncate">
              {ruta.cobrador?.nombre ?? "Sin cobrador"}{" "}
              {ruta.cobrador?.rol ? (
                <Badge variant="outline" className="ml-1 align-middle">
                  {ruta.cobrador.rol}
                </Badge>
              ) : null}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="font-medium">{ruta._count.clientes}</span>
            <span className="text-muted-foreground">clientes</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2">
                <MoreHorizontal className="h-4 w-4" />
                Acciones
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56" sideOffset={6}>
              <DropdownMenuLabel className="leading-none">
                Acciones
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2" asChild>
                <Link to={`/crm/cobros-en-ruta/${ruta.id}`}>
                  <Play className="h-4 w-4" />
                  <span>Iniciar Ruta</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled
                className="flex items-center gap-2 py-2 leading-none text-muted-foreground [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:-mt-px"
              >
                Registrar turno en ruta (próximamente…)
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled
                className="flex items-center gap-2 py-2 leading-none text-red-500 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:-mt-px"
              >
                Cerrar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function SkeletonList() {
  return (
    <div className="grid gap-3 sm:gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="shadow-sm">
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10 flex flex-col items-center text-center gap-3">
        <Map className="h-8 w-8" />
        <h3 className="text-lg font-semibold">Sin rutas asignadas</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Aún no tienes rutas asignadas. Cuando te asignen una, aparecerá aquí.
        </p>
        <Button onClick={onRefresh} className="mt-2">
          Refrescar
        </Button>
      </CardContent>
    </Card>
  );
}

function RutasTableDesktop({
  rutas,
}: // onStart,

{
  rutas: FindRutasAsignadasResult["rutas"];
  onStart?: (id: number) => void;
}) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[140px]">Fecha</TableHead>
            <TableHead className="min-w-[220px]">Ruta</TableHead>
            <TableHead className="min-w-[200px]">Cobrador</TableHead>
            <TableHead className="min-w-[140px]">Total clientes</TableHead>
            <TableHead className="text-right min-w-[120px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rutas.map((ruta) => (
            <motion.tr
              key={ruta.id}
              className="group"
              initial="hidden"
              animate="visible"
              variants={itemVariants}
            >
              <TableCell className="font-medium align-middle whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  {formattShortFecha(ruta.creadoEn)}
                </div>
              </TableCell>

              <TableCell className="font-medium align-middle">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 shrink-0" />
                  <span className="truncate">{ruta.nombreRuta}</span>
                </div>
              </TableCell>

              <TableCell className="align-middle">
                <div className="flex items-center gap-2">
                  <CircleUserRound className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {ruta.cobrador?.nombre ?? "Sin cobrador"}
                  </span>
                  {ruta.cobrador?.rol ? (
                    <Badge variant="outline" className="ml-1">
                      {ruta.cobrador.rol}
                    </Badge>
                  ) : null}
                </div>
              </TableCell>

              <TableCell className="align-middle">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">{ruta._count.clientes}</span>
                </div>
              </TableCell>

              <TableCell className="text-right align-middle">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Acciones">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex gap-2" asChild>
                      <Link to={`/crm/cobros-en-ruta/${ruta.id}`}>
                        <Play className="w-4 h-4" />
                        Iniciar ruta
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled>
                      Registrar turno en ruta (próximamente…)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" disabled>
                      Cerrar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RutasAsignadasMain() {
  const userID = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const { useApiQuery: useCrmQuery } = CRM;
  const {
    data: rutas = {
      rutas: [],
      totales: { totalClientes: 0, totalRutas: 0 },
    },
    isFetching,
    refetch: fetchRutas,
    error: rutasError,
    isError,
  } = useCrmQuery<FindRutasAsignadasResult>(
    ["rutas-asignadas", userID],
    "ruta-cobro/rutas-cobros-asignadas",
    { params: { id: userID } },
    {
      initialData: { rutas: [], totales: { totalClientes: 0, totalRutas: 0 } },
      retry: 1,
    }
  );

  const hasData = (rutas?.rutas?.length ?? 0) > 0;

  if (isError) {
    return (
      <Alert variant="destructive" className="mx-auto container mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error al cargar rutas</AlertTitle>
        <AlertDescription>
          {getApiErrorMessageAxios(rutasError)}
        </AlertDescription>
      </Alert>
    );
  }

  // Primer render sin datos: esqueletos bonitos
  if (!hasData && isFetching) {
    return (
      <motion.div
        className="container mx-auto px-3 sm:px-6 py-4"
        {...DesvanecerHaciaArriba}
      >
        <PageHeader
          sticky={false}
          title="Rutas de cobro asignadas"
          subtitle="Gestiona tus rutas y asignaciones"
          fallbackBackTo="/crm"
        />
        <div className="mt-3">
          <SkeletonList />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-3 sm:px-6 py-4"
      {...DesvanecerHaciaArriba}
    >
      <PageHeader
        sticky={false}
        title="Rutas de cobro asignadas"
        subtitle="Gestiona tus rutas y asignaciones"
        fallbackBackTo="/crm"
      />

      {/* Barra de acciones + KPIs (mobile-first) */}
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => fetchRutas()}
            variant="default"
            size="sm"
            aria-busy={isFetching}
            className="gap-2"
          >
            Refrescar
            <RotateCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatPill icon={Map} label="Rutas" value={rutas.totales.totalRutas} />
          <StatPill
            icon={User}
            label="Clientes"
            value={rutas.totales.totalClientes}
          />
        </div>
      </div>

      {/* Lista en móvil (cards) */}
      {hasData ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="mt-4 grid gap-3 md:hidden"
        >
          {rutas.rutas.map((ruta) => (
            <RutaCardMobile
              key={ruta.id}
              ruta={ruta}
              onStart={() => {
                /* TODO: navegación */
              }}
            />
          ))}
        </motion.div>
      ) : (
        !isFetching && (
          <div className="mt-4 md:hidden">
            <EmptyState onRefresh={() => fetchRutas()} />
          </div>
        )
      )}

      {/* Tabla en desktop */}
      {hasData ? (
        <div className="mt-4">
          <RutasTableDesktop
            rutas={rutas.rutas}
            onStart={() => {
              /* TODO: acción */
            }}
          />
        </div>
      ) : (
        !isFetching && (
          <div className="mt-4 hidden md:block">
            <EmptyState onRefresh={() => fetchRutas()} />
          </div>
        )
      )}
    </motion.div>
  );
}

export default RutasAsignadasMain;
