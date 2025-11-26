import { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";
import MikroTikCard from "./mikrotik-card";
import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale("es");

interface PropsMikrotiks {
  mikrotiks: MikrotikRoutersResponse[];
  handleSelectToEdit: (mk: MikrotikRoutersResponse) => void;
  isToUpdate: boolean;
  handleOpenDelete: (mk: MikrotikRoutersResponse) => void;
}

function MikroTiks({
  mikrotiks,
  handleSelectToEdit,
  isToUpdate,
  handleOpenDelete,
}: PropsMikrotiks) {
  if (!mikrotiks || mikrotiks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay routers Mikrotik registrados.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {mikrotiks
        .sort(
          (a, b) => dayjs(b.creadoEn).valueOf() - dayjs(a.creadoEn).valueOf()
        )
        .map((mk) => (
          <MikroTikCard
            handleOpenDelete={handleOpenDelete}
            isToUpdate={isToUpdate}
            handleSelectToEdit={handleSelectToEdit}
            key={mk.id}
            mk={mk}
          />
        ))}
    </div>
  );
}
export default MikroTiks;
