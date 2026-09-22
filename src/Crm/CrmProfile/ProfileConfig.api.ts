import axios from "axios";

import type { UserProfile, UsersProfile } from "./interfacesProfile";
import type { UpdateOneUserPayload } from "./ProfileConfig.types";

const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export const getUserProfile = async (id: number): Promise<UserProfile> => {
  const { data } = await axios.get<UserProfile>(
    `${VITE_CRM_API_URL}/user/user-profile-info/${id}`,
  );

  return data;
};

export const updateUserProfile = async (
  id: number,
  userData: Partial<UserProfile> | FormData,
): Promise<UserProfile> => {
  const { data } = await axios.put<UserProfile>(
    `${VITE_CRM_API_URL}/user/user-profile/${id}`,
    userData,
  );

  return data;
};

export const getProfiles = async (): Promise<UsersProfile[]> => {
  const { data } = await axios.get<UsersProfile[]>(
    `${VITE_CRM_API_URL}/user/get-user-profile-config`,
  );

  return data;
};

export const deactivateUserProfile = async (id: number): Promise<void> => {
  await axios.patch(`${VITE_CRM_API_URL}/user/user-profile/${id}/deactivate`);
};

export const updateOneUserProfile = async (
  id: number,
  userData: UpdateOneUserPayload,
): Promise<UserProfile> => {
  const { data } = await axios.put<UserProfile>(
    `${VITE_CRM_API_URL}/user/update-user-profile/${id}`,
    userData,
  );

  return data;
};

export const deleteUserProfile = deactivateUserProfile;
