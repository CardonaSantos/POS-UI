import { useMemo, useState } from "react";

import {
  GalleryMediaRecord,
  INITIAL_MEDIA_FILTERS,
  MediaFilterState,
  WazMediaRecord,
  isGalleryMediaType,
} from "@/Crm/features/bot-server/galery/galery-types-response.types";

import { ComprobantesMediaHeader } from "./components/comprobantes_media_header";
import { ComprobantesMediaGallery } from "./components/comprobantes_media_gallery";
import { useComprobantesMedia } from "@/Crm/CrmHooks/hooks/bot-server/use-galery/use-galery";
import { useGetClientes } from "@/Crm/CrmHooks/hooks/bot-server/use-whatsapp-server/useWhatsappServer";
import { OptionSelected } from "@/Crm/features/OptionSelected/OptionSelected";
import { ClienteWhatsappServerListItem } from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

function isGallerySupportedMedia(
  item: WazMediaRecord,
): item is GalleryMediaRecord {
  return isGalleryMediaType(item.type);
}

function buildClienteLabel(cliente: ClienteWhatsappServerListItem) {
  const nombre = cliente.contacto.nombre?.trim();
  const telefono = cliente.contacto.telefono?.trim();

  if (nombre && telefono) return `${nombre} · ${telefono}`;
  if (nombre) return nombre;
  if (telefono) return `Cliente ${telefono}`;

  return `Cliente #${cliente.id}`;
}

export default function ComprobantesMediaPage() {
  const [filters, setFilters] = useState<MediaFilterState>(
    INITIAL_MEDIA_FILTERS,
  );

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useComprobantesMedia(filters);

  const clientesQuery = useGetClientes({
    take: 2000,
  });

  const clientes = clientesQuery.data?.data ?? [];

  const clienteOptions: OptionSelected[] = useMemo(() => {
    return clientes.map((cliente) => ({
      value: cliente.id,
      label: buildClienteLabel(cliente),
    }));
  }, [clientes]);

  const clienteSelected: OptionSelected | null = useMemo(() => {
    if (!filters.clienteId) return null;

    return (
      clienteOptions.find(
        (option) => String(option.value) === String(filters.clienteId),
      ) ?? null
    );
  }, [clienteOptions, filters.clienteId]);

  const galleryItems = useMemo(() => {
    return data.filter(isGallerySupportedMedia);
  }, [data]);

  const handleChangeFilter = <K extends keyof MediaFilterState>(
    key: K,
    value: MediaFilterState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_MEDIA_FILTERS);
  };

  const handleRefresh = () => {
    void refetch();
  };

  const handleSelectCliente = (option: OptionSelected | null) => {
    setFilters((prev) => ({
      ...prev,
      clienteId: option?.value ? String(option.value) : "",
    }));
  };

  return (
    <PageTransitionCrm
      titleHeader="Galería de Media - Mensajería"
      variant="fade-pure"
    >
      <main className="min-h-dvh bg-muted/30">
        <ComprobantesMediaHeader
          clienteOptions={clienteOptions}
          clienteSelected={clienteSelected}
          isLoadingClientes={clientesQuery.isLoading}
          onSelectCliente={handleSelectCliente}
          filters={filters}
          total={galleryItems.length}
          isFetching={isFetching}
          onChangeFilter={handleChangeFilter}
          onResetFilters={handleResetFilters}
          onRefresh={handleRefresh}
        />

        <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-4">
          <ComprobantesMediaGallery
            items={galleryItems}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </main>
    </PageTransitionCrm>
  );
}
