import axios from "axios";
import { MediaAttachment, TwilioMessage } from "../Utils/utilsMensajeria";
const VITE_CRM_API_URL = import.meta.env.VITE_CRM_API_URL;

export interface TwilioHistory {
  messages: TwilioMessage[];
  nextPageToken: string | null;
  previousPageToken: string | null;
}

export const getMessagingTwilioHistory = (
  limit: number,
  pageToken?: string
): Promise<TwilioHistory> =>
  axios
    .get<TwilioHistory>(
      `${VITE_CRM_API_URL}/twilio-api/get-messagin-historial`,
      {
        params: { limit, pageToken },
      }
    )
    .then((res) => res.data);

export const getMediaMessage = async (
  messageSID: string
): Promise<MediaAttachment[]> => {
  const res = await axios.get(
    `${VITE_CRM_API_URL}/twilio-api/messages/${messageSID}/media`
  );
  return res.data;
};
