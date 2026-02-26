import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { realTimeQkeys } from "./Qk";
import { RealTimeLocationRaw } from "@/Crm/features/real-time-location/real-time-location";

export function useGetUsersRealTime() {
  return useCrmQuery<RealTimeLocationRaw[], void>(
    realTimeQkeys.all,
    "/real-time/last-locations",
    undefined,
    undefined,
  );
}
