export interface TwilioMessage {
  body: string;
  numSegments: string;
  direction: MessageDirection;
  from: string;
  to: string;
  dateUpdated: string;
  price: string | null;
  errorMessage: string | null;
  uri: string;
  accountSid: string;
  numMedia: string;
  status: MessageStatus;
  messagingServiceSid: string | null;
  sid: string;
  dateSent: string;
  dateCreated: string;
  errorCode: number | null;
  priceUnit: string;
  apiVersion: string;
  subresourceUris: {
    feedback: string;
    media: string;
  };
}

export type MessageDirection = "inbound" | "outbound-api" | "outbound";

export type MessageStatus =
  | "accepted"
  | "queued"
  | "sending"
  | "sent"
  | "failed"
  | "delivered"
  | "undelivered"
  | "receiving"
  | "received"
  | "read";

// src/types.ts (o donde prefieras)
export interface MediaAttachment {
  sid: string;
  contentType: string; // p.ej. "image/jpeg", "video/mp4", "audio/ogg", "application/pdf", …
  url: string; // URL accesible vía tu proxy: /twilio-api/messages/{msgSid}/media/{mediaSid}
}
