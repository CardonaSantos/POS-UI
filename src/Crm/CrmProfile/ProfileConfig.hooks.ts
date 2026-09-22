import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deactivateUserProfile,
  getProfiles,
  getUserProfile,
  updateOneUserProfile,
  updateUserProfile,
} from "./ProfileConfig.api";
import type { UserProfile } from "./interfacesProfile";
import type { UpdateOneUserPayload } from "./ProfileConfig.types";

export const profileConfigKeys = {
  all: ["crm", "users"] as const,
  list: () => [...profileConfigKeys.all, "profile-config"] as const,
  detail: (id: number) => [...profileConfigKeys.all, "detail", id] as const,
};

export function useProfilesQuery() {
  return useQuery({
    queryKey: profileConfigKeys.list(),
    queryFn: getProfiles,
    staleTime: 30_000,
  });
}

export function useUserProfileQuery(id: number | null) {
  return useQuery({
    queryKey: profileConfigKeys.detail(id ?? 0),
    queryFn: () => getUserProfile(id as number),
    enabled: id !== null && id > 0,
    staleTime: 30_000,
  });
}

export function useUpdateOneUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateOneUserPayload;
    }) => updateOneUserProfile(id, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: profileConfigKeys.list() }),
        queryClient.invalidateQueries({
          queryKey: profileConfigKeys.detail(variables.id),
        }),
      ]);
    },
  });
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<UserProfile> | FormData;
    }) => updateUserProfile(id, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: profileConfigKeys.list() }),
        queryClient.invalidateQueries({
          queryKey: profileConfigKeys.detail(variables.id),
        }),
      ]);
    },
  });
}

export function useDeactivateUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deactivateUserProfile(id),

    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: profileConfigKeys.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: profileConfigKeys.detail(id),
        }),
      ]);
    },
  });
}
