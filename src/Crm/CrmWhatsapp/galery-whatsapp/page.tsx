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

function isGallerySupportedMedia(
  item: WazMediaRecord,
): item is GalleryMediaRecord {
  return isGalleryMediaType(item.type);
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

  return (
    <main className="min-h-dvh bg-muted/30">
      <ComprobantesMediaHeader
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
  );
}
