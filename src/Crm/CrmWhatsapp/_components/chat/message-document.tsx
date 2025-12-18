"use client";

import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MessageDocumentProps {
  mediaUrl: string;
  body: string | null;
  mediaMimeType: string | null;
  isOutbound: boolean;
}

export function MessageDocument({
  mediaUrl,
  body,
  mediaMimeType,
  isOutbound,
}: MessageDocumentProps) {
  const getFileName = () => {
    if (body && body.includes("[Documento:")) {
      return body.replace("[Documento: ", "").replace("]", "");
    }
    return "Documento";
  };

  const getFileExtension = () => {
    if (mediaMimeType?.includes("pdf")) return "PDF";
    if (mediaMimeType?.includes("word") || mediaMimeType?.includes("document"))
      return "DOC";
    if (mediaMimeType?.includes("excel") || mediaMimeType?.includes("sheet"))
      return "XLS";
    return "FILE";
  };
  // bg-teal-600 text-white dark:bg-[#0ea577] ml-auto
  // bg-teal-600 text-white dark:bg-[#0ea577] ml-auto
  return (
    <div
      className={cn(
        "rounded-lg border max-w-[280px]",
        isOutbound
          ? "ml-auto bg-teal-600 text-white dark:bg-[#0ea577] border-primary/20"
          : "bg-muted border-border"
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <div
          className={cn(
            "h-10 w-10 rounded flex items-center justify-center flex-shrink-0",
            isOutbound ? "bg-primary/20" : "bg-primary/10"
          )}
        >
          <FileText className="h-5 w-5 text-white dark:text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{getFileName()}</p>
          <p className="text-[10px] text-white mt-0.5">{getFileExtension()}</p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => window.open(mediaUrl, "_blank")}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
