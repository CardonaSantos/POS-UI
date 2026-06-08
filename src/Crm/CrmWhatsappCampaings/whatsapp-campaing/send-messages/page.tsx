"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Send,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  MetaWhatsappTemplate,
  WhatsappTemplateCategory,
  CampaignSendMode,
  PhoneFilter,
  CampaignPayload,
  WhatsappTemplateFilters,
} from "@/Types/whatsapp-campaing/types";
import { getBodyPreview } from "@/Types/whatsapp-campaing/types";
import { useWhatsappTemplates } from "@/hooks/use-whatsapp-template/use-whatsapp-template";
import { useSendWhatsappCampaign } from "@/hooks/use-whatsapp-template/send-whatsapp-message-campaing";
import { SelectedWhatsappTemplatePreview } from "./components/SelectedWhatsappTemplatePreview";
import { toast } from "sonner";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import { useGetCustomersCampaingWhatsapp } from "@/Crm/CrmHooks/hooks/Client/useGetClient";
import {
  CustomersCampaingQuery,
  NormalizedCampaignCustomer,
} from "@/Crm/features/cliente-interfaces/cliente-types";
import { useGetSectores } from "@/Crm/CrmHooks/hooks/Sectores/useGetSectores";
import { useGetMunicipios } from "@/Crm/CrmHooks/hooks/Municipios/useGetMunicipios";
import { useGetDepartamentos } from "@/Crm/CrmHooks/hooks/Departamentos/useGetDepartamentos";
import { CampaignCustomerFilters } from "./components/campaign-customer-filters";
import { CampaignCustomerPicker } from "./components/campaign-customer-picker";
import { useGetZonasFacturacion } from "@/Crm/CrmHooks/hooks/use-zonas-facturacion/use-zonas-facturacion";

function cleanCustomerQuery(
  query: CustomersCampaingQuery,
): CustomersCampaingQuery {
  return {
    zonaF: query.zonaF || undefined,
    sector: query.sector || undefined,
    municipio: query.municipio || undefined,
    departamento: query.departamento || undefined,
    nombre: query.nombre?.trim() || undefined,
    numeroFact:
      query.numeroFact !== undefined && query.numeroFact !== null
        ? query.numeroFact
        : undefined,
    estado: query.estado || undefined,
    estadoCobranza: query.estadoCobranza || undefined,
  };
}

function hasCustomerQueryActive(query: CustomersCampaingQuery): boolean {
  const clean = cleanCustomerQuery(query);

  return Object.values(clean).some(
    (value) => value !== undefined && value !== null && value !== "",
  );
}

function isValidPhone(phone?: string | null): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-().+]/g, "");
  return /^\d{8}$/.test(cleaned);
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-().+]/g, "");
}

function getTemplateCostByCategory(category: WhatsappTemplateCategory): number {
  const costs: Record<WhatsappTemplateCategory, number> = {
    MARKETING:
      parseFloat(import.meta.env.VITE_WHATSAPP_COST_MARKETING ?? "") || 0,
    UTILITY: parseFloat(import.meta.env.VITE_WHATSAPP_COST_UTILITY ?? "") || 0,
    AUTHENTICATION:
      parseFloat(import.meta.env.VITE_WHATSAPP_COST_AUTHENTICATION ?? "") || 0,
  };
  return isNaN(costs[category]) ? 0 : costs[category];
}

function getCategoryLabel(category: WhatsappTemplateCategory): string {
  return (
    { MARKETING: "Marketing", UTILITY: "Utilidad", AUTHENTICATION: "Auth" }[
      category
    ] ?? category
  );
}

function getStatusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "APPROVED") return "default";
  if (status === "PENDING") return "secondary";
  if (status === "REJECTED") return "destructive";
  return "outline";
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    APPROVED: "Aprobada",
    PENDING: "Pendiente",
    REJECTED: "Rechazada",
    PAUSED: "Pausada",
    DISABLED: "Deshabilitada",
    IN_APPEAL: "En apelación",
    PENDING_DELETION: "Por eliminar",
  };
  return map[status] ?? status;
}

export function WhatsappMessaginCapaing() {
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const sendCampaignMutation = useSendWhatsappCampaign();

  const [customerQuery, setCustomerQuery] = useState<CustomersCampaingQuery>(
    {},
  );

  const cleanQuery = useMemo(
    () => cleanCustomerQuery(customerQuery),
    [customerQuery],
  );

  const selectedDepartamentoId = cleanQuery.departamento ?? null;

  const { data: zonasF = [] } = useGetZonasFacturacion();
  const { data: sectores = [] } = useGetSectores();
  const { data: municipios = [] } = useGetMunicipios(selectedDepartamentoId);
  const { data: departamentos = [] } = useGetDepartamentos();

  const { data: rawClients = [] } = useGetCustomersCampaingWhatsapp(cleanQuery);

  const [templateFilters, setTemplateFilters] =
    useState<WhatsappTemplateFilters>({
      name: "",
      language: "ALL",
      category: "ALL",
      status: "APPROVED",
    });

  const { data: templatesResponse, isPending: templatesLoading } =
    useWhatsappTemplates(templateFilters);

  const templates = templatesResponse?.data ?? [];

  const [selectedTemplate, setSelectedTemplate] =
    useState<MetaWhatsappTemplate | null>(null);

  const [sendMode, setSendMode] = useState<CampaignSendMode>("SELECTED");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectionTab, setSelectionTab] = useState<"select" | "table">("table");

  const [customersCacheById, setCustomersCacheById] = useState<
    Map<number, NormalizedCampaignCustomer>
  >(new Map());

  const [phoneFilter, setPhoneFilter] = useState<PhoneFilter>("valid");
  const [simulateQty, setSimulateQty] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [payloadOpen, setPayloadOpen] = useState(false);

  const sectoresFiltrados = useMemo(() => {
    if (!cleanQuery.municipio) return sectores;

    return sectores.filter(
      (sector) => sector.municipioId === cleanQuery.municipio,
    );
  }, [sectores, cleanQuery.municipio]);

  const normalizedClients = useMemo<NormalizedCampaignCustomer[]>(
    () =>
      rawClients.map((customer) => ({
        ...customer,
        fullName: customer.nombre?.trim() || "Cliente sin nombre",
        normalizedPhone: isValidPhone(customer.telefono)
          ? normalizePhone(customer.telefono)
          : (customer.telefono ?? ""),
        isValidPhone: isValidPhone(customer.telefono),
      })),
    [rawClients],
  );

  useEffect(() => {
    if (normalizedClients.length === 0) return;

    setCustomersCacheById((prev) => {
      const next = new Map(prev);

      normalizedClients.forEach((customer) => {
        next.set(customer.id, customer);
      });

      return next;
    });
  }, [normalizedClients]);

  const clientsByPhoneFilter = useMemo(() => {
    return normalizedClients.filter((customer) => {
      if (phoneFilter === "valid" && !customer.isValidPhone) return false;
      if (phoneFilter === "invalid" && customer.isValidPhone) return false;

      return true;
    });
  }, [normalizedClients, phoneFilter]);

  const validClients = useMemo(
    () => normalizedClients.filter((customer) => customer.isValidPhone),
    [normalizedClients],
  );

  const tableValidClients = useMemo(
    () => clientsByPhoneFilter.filter((customer) => customer.isValidPhone),
    [clientsByPhoneFilter],
  );

  const tableInvalidCount = useMemo(
    () =>
      clientsByPhoneFilter.filter((customer) => !customer.isValidPhone).length,
    [clientsByPhoneFilter],
  );

  const effectiveSelectedIds = useMemo<Set<number>>(() => {
    return selectedIds;
  }, [selectedIds]);

  const selectedClients = useMemo(() => {
    return Array.from(selectedIds)
      .map((id) => customersCacheById.get(id))
      .filter((customer): customer is NormalizedCampaignCustomer =>
        Boolean(customer?.isValidPhone),
      );
  }, [selectedIds, customersCacheById]);

  const allVisibleSelected = useMemo(() => {
    return (
      tableValidClients.length > 0 &&
      tableValidClients.every((customer) => selectedIds.has(customer.id))
    );
  }, [tableValidClients, selectedIds]);

  const someVisibleSelected = useMemo(() => {
    return tableValidClients.some((customer) => selectedIds.has(customer.id));
  }, [tableValidClients, selectedIds]);

  const unitCost = useMemo(
    () =>
      selectedTemplate
        ? getTemplateCostByCategory(
            selectedTemplate.category as WhatsappTemplateCategory,
          )
        : 0,
    [selectedTemplate],
  );

  const totalEstimated = useMemo(
    () => selectedClients.length * unitCost,
    [selectedClients.length, unitCost],
  );

  const simulatedTotal = useMemo(() => {
    const qty = parseInt(simulateQty, 10);
    return isNaN(qty) || qty <= 0 ? null : qty * unitCost;
  }, [simulateQty, unitCost]);

  const selectedTemplateHeader = useMemo(() => {
    return selectedTemplate?.components?.find(
      (component) => component.type?.toUpperCase() === "HEADER",
    );
  }, [selectedTemplate]);

  const selectedTemplateNeedsImage = selectedTemplateHeader?.format === "IMAGE";

  const hasHeaderImageUrl = Boolean(headerImageUrl?.trim());

  const isMissingRequiredImageUrl =
    selectedTemplateNeedsImage && !hasHeaderImageUrl;

  const hasActiveFilters =
    hasCustomerQueryActive(cleanQuery) || phoneFilter !== "valid";

  const handleCustomerQueryChange = useCallback(
    (patch: Partial<CustomersCampaingQuery>) => {
      setCustomerQuery((prev) => {
        const next: CustomersCampaingQuery = {
          ...prev,
          ...patch,
        };

        if (
          Object.prototype.hasOwnProperty.call(patch, "departamento") &&
          patch.departamento !== prev.departamento
        ) {
          next.municipio = undefined;
          next.sector = undefined;
        }

        if (
          Object.prototype.hasOwnProperty.call(patch, "municipio") &&
          patch.municipio !== prev.municipio
        ) {
          next.sector = undefined;
        }

        return next;
      });
    },
    [],
  );

  const handleCustomerNameChange = useCallback((nombre: string) => {
    setCustomerQuery((prev) => ({
      ...prev,
      nombre,
    }));
  }, []);

  const handleClearCustomerQuery = useCallback(() => {
    setCustomerQuery({});
    setPhoneFilter("valid");
  }, []);

  const handleClearSelectedCustomers = useCallback(() => {
    setSelectedIds(new Set<number>());
  }, []);

  const handleToggleId = useCallback(
    (id: number) => {
      const customer =
        customersCacheById.get(id) ??
        clientsByPhoneFilter.find((item) => item.id === id);

      if (!customer?.isValidPhone) return;

      setCustomersCacheById((prev) => {
        const next = new Map(prev);
        next.set(customer.id, customer);
        return next;
      });

      setSelectedIds((prev) => {
        const next = new Set(prev);

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      });
    },
    [clientsByPhoneFilter, customersCacheById],
  );

  const handleToggleAllVisible = useCallback(
    (checked: boolean) => {
      const validVisibleCustomers = clientsByPhoneFilter.filter(
        (customer) => customer.isValidPhone,
      );

      setCustomersCacheById((prev) => {
        const next = new Map(prev);

        validVisibleCustomers.forEach((customer) => {
          next.set(customer.id, customer);
        });

        return next;
      });

      setSelectedIds((prev) => {
        const next = new Set(prev);

        validVisibleCustomers.forEach((customer) => {
          if (checked) {
            next.add(customer.id);
          } else {
            next.delete(customer.id);
          }
        });

        return next;
      });
    },
    [clientsByPhoneFilter],
  );

  const handleSelectedIdsChange = useCallback(
    (nextVisibleSelectedIds: Set<number>) => {
      const visibleIds = new Set(
        clientsByPhoneFilter.map((customer) => customer.id),
      );

      setSelectedIds((prev) => {
        const next = new Set(prev);

        visibleIds.forEach((id) => {
          next.delete(id);
        });

        nextVisibleSelectedIds.forEach((id) => {
          next.add(id);
        });

        return next;
      });
    },
    [clientsByPhoneFilter],
  );

  const handleResetAfterSuccess = useCallback(() => {
    setSelectedTemplate(null);
    setSendMode("SELECTED");
    setSelectedIds(new Set<number>());
    setCustomersCacheById(new Map());
    setSelectionTab("select");

    setCustomerQuery({});
    setPhoneFilter("valid");

    setSimulateQty("");
    setHeaderImageUrl("");

    setConfirmOpen(false);
    setPayloadOpen(false);

    setTemplateFilters({
      name: "",
      language: "ALL",
      category: "ALL",
      status: "APPROVED",
    });
  }, []);

  const handleRemoveSelectedCustomer = useCallback((customerId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(customerId);
      return next;
    });
  }, []);

  const payload = useMemo<CampaignPayload | null>(() => {
    if (!selectedTemplate) return null;

    const cleanHeaderImageUrl = headerImageUrl.trim();

    return {
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      templateLanguage: selectedTemplate.language,
      templateCategory: selectedTemplate.category as WhatsappTemplateCategory,

      headerImageUrl: selectedTemplateNeedsImage
        ? cleanHeaderImageUrl
        : undefined,

      sendMode,
      customerIds: selectedClients.map((customer) => customer.id),

      recipients: selectedClients.map((customer) => ({
        customerId: customer.id,
        fullName: customer.fullName,
        phone: customer.normalizedPhone,
      })),

      estimatedCost: {
        currency: "USD",
        unitCost,
        totalRecipients: selectedClients.length,
        totalEstimated,
      },

      filtersSnapshot: {
        search: cleanQuery.nombre ?? "",
        purchaseFilter: "all",
        phoneFilter,
        locationFilter: "",
      },

      createdAt: new Date().toISOString(),
    };
  }, [
    selectedTemplate,
    selectedTemplateNeedsImage,
    headerImageUrl,
    sendMode,
    selectedClients,
    unitCost,
    totalEstimated,
    cleanQuery.nombre,
    phoneFilter,
  ]);

  const isReadyToSend =
    selectedTemplate !== null &&
    selectedTemplate.status === "APPROVED" &&
    selectedClients.length > 0 &&
    !isMissingRequiredImageUrl;

  const handleConfirmSend = useCallback(async () => {
    if (!payload) return;

    const totalRecipients = payload.recipients.length;

    try {
      const response = await toast.promise(
        sendCampaignMutation.mutateAsync(payload),
        {
          loading: `Enviando campaña a ${totalRecipients} cliente(s)...`,
          success: (response) => {
            const sent = response?.sent ?? 0;
            const failed = response?.failed ?? 0;

            if (failed > 0) {
              return `Campaña procesada: ${sent} enviado(s), ${failed} fallido(s)`;
            }

            return `Campaña enviada correctamente a ${sent} cliente(s)`;
          },
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      console.log("Campaña enviada", response);

      setConfirmOpen(false);
      handleResetAfterSuccess();
    } catch (error) {
      console.error("Error enviando campaña", error);
    }
  }, [payload, sendCampaignMutation, handleResetAfterSuccess]);

  return (
    <PageTransitionCrm fallbackBackTo="/" titleHeader="Envio de campañas">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3 items-start">
          <div className="space-y-3">
            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold">
                  Plantilla
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 pt-0 space-y-2">
                {templatesLoading ? (
                  <p className="text-xs text-muted-foreground">
                    Cargando plantillas...
                  </p>
                ) : (
                  <div className="grid gap-2">
                    <Select
                      value={selectedTemplate?.id ?? ""}
                      onValueChange={(id) => {
                        const tpl = templates.find((t) => t.id === id) ?? null;
                        setSelectedTemplate(tpl);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Seleccionar plantilla..." />
                      </SelectTrigger>

                      <SelectContent>
                        {templates.map((tpl) => (
                          <SelectItem
                            key={tpl.id}
                            value={tpl.id}
                            className="text-xs"
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-mono">{tpl.name}</span>
                              <Badge
                                variant={getStatusBadgeVariant(tpl.status)}
                                className="text-[10px] py-0 h-4"
                              >
                                {getStatusLabel(tpl.status)}
                              </Badge>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedTemplate && (
                      <div className="rounded-md border bg-muted/40 p-2 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-medium">
                            {selectedTemplate.name}
                          </span>

                          <Badge
                            variant={getStatusBadgeVariant(
                              selectedTemplate.status,
                            )}
                            className="text-[10px] py-0 h-4"
                          >
                            {getStatusLabel(selectedTemplate.status)}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 h-4"
                          >
                            {getCategoryLabel(
                              selectedTemplate.category as WhatsappTemplateCategory,
                            )}
                          </Badge>

                          <Badge
                            variant="outline"
                            className="text-[10px] py-0 h-4"
                          >
                            {selectedTemplate.language}
                          </Badge>
                        </div>

                        {selectedTemplate.status !== "APPROVED" && (
                          <p className="text-[11px] text-destructive flex items-center gap-1">
                            <AlertTriangle className="size-3" />
                            Solo se pueden enviar plantillas aprobadas.
                          </p>
                        )}

                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                          {getBodyPreview(selectedTemplate)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-xs font-semibold">
                  Filtros de clientes
                </CardTitle>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={handleClearCustomerQuery}
                  >
                    <X className="size-3 mr-1" />
                    Limpiar
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-3 pt-0">
                <CampaignCustomerFilters
                  query={customerQuery}
                  departamentos={departamentos}
                  municipios={municipios}
                  sectores={sectoresFiltrados}
                  phoneFilter={phoneFilter}
                  zonasF={zonasF}
                  onQueryChange={handleCustomerQueryChange}
                  onNameChange={handleCustomerNameChange}
                  onPhoneFilterChange={setPhoneFilter}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-xs font-semibold">
                  Destinatarios
                </CardTitle>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="all-valid-visible"
                    checked={
                      allVisibleSelected
                        ? true
                        : someVisibleSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(value) => {
                      handleToggleAllVisible(value === true);
                    }}
                  />

                  <Label
                    htmlFor="all-valid-visible"
                    className="text-xs cursor-pointer"
                  >
                    Seleccionar visibles válidos ({tableValidClients.length})
                  </Label>
                </div>
              </CardHeader>

              <CardContent className="p-3 pt-0 space-y-2">
                <CampaignCustomerPicker
                  customers={clientsByPhoneFilter}
                  selectedIds={selectedIds}
                  effectiveSelectedIds={effectiveSelectedIds}
                  selectionTab={selectionTab}
                  onSelectionTabChange={setSelectionTab}
                  onSelectedIdsChange={handleSelectedIdsChange}
                  onToggleId={handleToggleId}
                  onToggleAllVisible={handleToggleAllVisible}
                  tableInvalidCount={tableInvalidCount}
                  tableValidClients={tableValidClients}
                  allVisibleSelected={allVisibleSelected}
                />

                {selectedClients.length > 0 && (
                  <div className="flex items-center justify-between rounded-md border bg-muted/30 px-2 py-1">
                    <span className="text-[11px] text-muted-foreground">
                      Acumulados para enviar: {selectedClients.length}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[11px]"
                      onClick={handleClearSelectedCustomers}
                    >
                      Limpiar seleccionados
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Card>
              <CardContent className="p-3 space-y-1">
                <p className="text-xs font-semibold mb-2">Clientes</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full rounded-md px-1 py-1 text-left transition-colors hover:bg-muted/60"
                      disabled={selectedClients.length === 0}
                    >
                      <StatRow
                        icon={<Send className="size-3 text-primary" />}
                        label="Seleccionados"
                        value={selectedClients.length}
                        bold
                      />
                    </button>
                  </DialogTrigger>

                  <DialogContent className="max-w-md p-3">
                    <DialogHeader className="space-y-1">
                      <DialogTitle className="text-sm">
                        Clientes seleccionados
                      </DialogTitle>
                    </DialogHeader>

                    <div className="max-h-80 overflow-auto rounded-md border">
                      {selectedClients.length === 0 ? (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                          No hay clientes seleccionados.
                        </div>
                      ) : (
                        <div className="divide-y">
                          {selectedClients.map((customer) => (
                            <div
                              key={customer.id}
                              className="flex items-center justify-between gap-2 p-2"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium">
                                  {customer.fullName || "Cliente sin nombre"}
                                </p>

                                <p className="truncate text-[11px] text-muted-foreground">
                                  {customer.normalizedPhone || "Sin teléfono"} ·{" "}
                                  {customer.facturasPendientes} factura(s)
                                </p>
                              </div>

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 shrink-0 px-2 text-[11px]"
                                onClick={() =>
                                  handleRemoveSelectedCustomer(customer.id)
                                }
                              >
                                Quitar
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedClients.length > 0 && (
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={handleClearSelectedCustomers}
                        >
                          Limpiar todos
                        </Button>
                      </DialogFooter>
                    )}
                  </DialogContent>
                </Dialog>

                <Separator className="my-1" />

                <StatRow
                  icon={<CheckCircle2 className="size-3 text-emerald-600" />}
                  label="Válidos"
                  value={validClients.length}
                />

                <StatRow
                  icon={<XCircle className="size-3 text-destructive" />}
                  label="Excluidos"
                  value={normalizedClients.length - validClients.length}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold flex items-center gap-1">
                  <DollarSign className="size-3" />
                  Estimación de gasto
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 pt-0 space-y-1">
                <StatRow
                  label="Categoría"
                  value={
                    selectedTemplate
                      ? getCategoryLabel(
                          selectedTemplate.category as WhatsappTemplateCategory,
                        )
                      : "—"
                  }
                />

                <StatRow
                  label="Costo unitario"
                  value={
                    unitCost > 0 ? `$${unitCost.toFixed(4)}` : "No configurado"
                  }
                />

                <StatRow label="Destinatarios" value={selectedClients.length} />

                <Separator className="my-1" />

                <StatRow
                  label="Total estimado"
                  value={unitCost > 0 ? `$${totalEstimated.toFixed(4)}` : "—"}
                  bold
                />

                <div className="pt-2 space-y-1">
                  <Label className="text-[11px] text-muted-foreground">
                    Simular cantidad
                  </Label>

                  <div className="flex gap-1 items-center">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Ej. 500"
                      value={simulateQty}
                      onChange={(event) => setSimulateQty(event.target.value)}
                      className="h-7 text-xs"
                    />

                    {simulatedTotal !== null && (
                      <span className="text-xs font-mono whitespace-nowrap text-muted-foreground">
                        = ${simulatedTotal.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedTemplateNeedsImage && (
              <div className="rounded-md border bg-muted/30 p-2 space-y-1">
                <Label className="text-xs">
                  Imagen de encabezado requerida
                </Label>

                <Input
                  value={headerImageUrl}
                  onChange={(event) => setHeaderImageUrl(event.target.value)}
                  placeholder="https://..."
                  className="h-8 text-xs"
                />

                <p className="text-[11px] text-muted-foreground">
                  Esta plantilla tiene HEADER IMAGE. Debes usar una URL pública
                  accesible por Meta.
                </p>
              </div>
            )}

            <SelectedWhatsappTemplatePreview
              template={selectedTemplate}
              headerImageUrl={headerImageUrl}
            />

            <Card className={isReadyToSend ? "border-primary/40" : ""}>
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs font-semibold flex items-center gap-1">
                  <Send className="size-3" />
                  Resumen
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 pt-0 space-y-1">
                <StatRow
                  label="Plantilla"
                  value={selectedTemplate?.name ?? "—"}
                  mono
                />

                <StatRow
                  label="Categoría"
                  value={
                    selectedTemplate
                      ? getCategoryLabel(
                          selectedTemplate.category as WhatsappTemplateCategory,
                        )
                      : "—"
                  }
                />

                <StatRow label="Seleccionados" value={selectedClients.length} />

                <StatRow
                  label="Costo estimado"
                  value={unitCost > 0 ? `$${totalEstimated.toFixed(4)}` : "—"}
                />

                <Separator className="my-1" />

                <div className="flex items-center gap-1 py-1">
                  {isReadyToSend ? (
                    <CheckCircle2 className="size-3 text-emerald-600" />
                  ) : (
                    <XCircle className="size-3 text-destructive" />
                  )}

                  <span
                    className={`text-xs font-medium ${
                      isReadyToSend ? "text-emerald-700" : "text-destructive"
                    }`}
                  >
                    {isReadyToSend
                      ? "Listo para enviar"
                      : "Completa los campos requeridos"}
                  </span>
                </div>

                <Button
                  size="sm"
                  className="w-full h-8 text-xs mt-1"
                  disabled={!isReadyToSend}
                  onClick={() => setConfirmOpen(true)}
                >
                  <Send className="size-3 mr-1" />
                  Enviar campaña
                </Button>

                <button
                  className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1 hover:text-foreground transition-colors"
                  onClick={() => setPayloadOpen((value) => !value)}
                >
                  {payloadOpen ? (
                    <ChevronUp className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                  {payloadOpen ? "Ocultar" : "Ver"} payload
                </button>

                {payloadOpen && (
                  <pre className="text-[10px] bg-muted rounded p-2 overflow-auto max-h-40 leading-relaxed">
                    {payload ? JSON.stringify(payload, null, 2) : "Sin datos"}
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-sm text-center">
                Confirmar envío de campaña
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-2 py-1">
              <div className="rounded-md bg-destructive/10 border border-destructive/30 p-2 flex gap-2">
                <AlertTriangle className="size-3 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">
                  Esta acción enviará la campaña por Whatsapp a los clientes
                  seleccionados.
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <ConfirmRow
                  label="Plantilla"
                  value={selectedTemplate?.name ?? "—"}
                  mono
                />

                <ConfirmRow
                  label="Categoría"
                  value={
                    selectedTemplate
                      ? getCategoryLabel(
                          selectedTemplate.category as WhatsappTemplateCategory,
                        )
                      : "—"
                  }
                />

                <ConfirmRow
                  label="Estado"
                  value={
                    selectedTemplate
                      ? getStatusLabel(selectedTemplate.status)
                      : "—"
                  }
                />

                <ConfirmRow label="Clientes" value={selectedClients.length} />

                <ConfirmRow
                  label="Total estimado"
                  value={
                    unitCost > 0
                      ? `$${totalEstimated.toFixed(4)} USD`
                      : "No configurado"
                  }
                  bold
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setConfirmOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                className="text-xs"
                disabled={
                  !isReadyToSend ||
                  sendCampaignMutation.isPending ||
                  isMissingRequiredImageUrl
                }
                onClick={handleConfirmSend}
              >
                <Send className="size-3 mr-1" />
                {sendCampaignMutation.isPending
                  ? "Enviando..."
                  : "Confirmar envío"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransitionCrm>
  );
}

function StatRow({
  icon,
  label,
  value,
  bold,
  mono,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </span>
      <span
        className={`text-xs text-right truncate max-w-[140px] ${bold ? "font-semibold" : ""} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function ConfirmRow({
  label,
  value,
  bold,
  mono,
}: {
  label: string;
  value: string | number;
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`text-right ${bold ? "font-semibold" : ""} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
