import { MessageText } from "./message-text";
import { MessageImage } from "./message-image";
import { MessageDocument } from "./message-document";
import { MessageAudio } from "./message-audio";
import { Check, CheckCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  WazStatus,
  WhatsappMessage,
} from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";
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

interface MessageItemProps {
  message: WhatsappMessage;
}

// SENT = "SENT",
// DELIVERED = "DELIVERED",
// READ = "READ",
// FAILED = "FAILED",

export function MessageItem({ message }: MessageItemProps) {
  const isOutbound = message.direction === "OUTBOUND";

  const renderStatusIcon = () => {
    if (!isOutbound) return null;

    switch (message.status) {
      case WazStatus.SENT:
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case WazStatus.DELIVERED:
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case WazStatus.READ:
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case WazStatus.FAILED:
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case "TEXT":
        return message.body ? (
          <MessageText body={message.body} isOutbound={isOutbound} />
        ) : null;

      case "IMAGE":
        return message.mediaUrl ? (
          <MessageImage
            mediaUrl={message.mediaUrl}
            body={message.body}
            isOutbound={isOutbound}
          />
        ) : null;

      case "DOCUMENT":
        return message.mediaUrl ? (
          <MessageDocument
            mediaUrl={message.mediaUrl}
            body={message.body}
            mediaMimeType={message.mediaMimeType}
            isOutbound={isOutbound}
          />
        ) : null;

      case "AUDIO":
        return message.mediaUrl ? (
          <MessageAudio mediaUrl={message.mediaUrl} isOutbound={isOutbound} />
        ) : null;

      default:
        return (
          <div
            className={cn(
              "rounded-lg px-3 py-2 text-xs max-w-[85%] italic",
              isOutbound
                ? "bg-primary/20 text-primary ml-auto"
                : "bg-muted text-muted-foreground"
            )}
          >
            Mensaje de tipo {message.type}
          </div>
        );
    }
  };

  const formatTime = () => {
    const timestampNormalizado = Number(message.timestamp);

    const fechaLegible = dayjs
      .unix(timestampNormalizado)
      .format("DD/MM/YYYY h:mm A");

    return fechaLegible;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 mb-3",
        isOutbound ? "items-end" : "items-start"
      )}
    >
      {renderMessageContent()}
      <div className="flex items-center gap-1 px-1">
        <span className="text-[10px] text-muted-foreground">
          {formatTime()}
        </span>
        {renderStatusIcon()}
      </div>
    </div>
  );
}
