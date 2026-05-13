"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MessageImageProps {
  mediaUrl: string;
  body: string | null;
  isOutbound: boolean;
}

export function MessageImage({
  mediaUrl,
  body,
  isOutbound,
}: MessageImageProps) {
  const [open, setOpen] = useState<boolean>(false);

  const toggleOpen = () => setOpen(!open);

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden max-w-[280px] border",
        isOutbound ? "ml-auto" : "",
      )}
    >
      <div className="relative group">
        <img
          src={mediaUrl || "/placeholder.svg"}
          alt={body || "Imagen"}
          className="w-full h-auto max-h-[320px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-2 text-xs flex items-center gap-1"
            onClick={toggleOpen}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Ver
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-2 text-xs flex items-center gap-1"
            onClick={() => window.open(mediaUrl, "_blank")}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Abrir
          </Button>
        </div>
      </div>
      {body && body !== "[Imagen]" && (
        <div
          className={cn(
            "px-3 py-2 text-sm",
            isOutbound
              ? "bg-teal-600 text-white dark:bg-[#0ea577] ml-auto"
              : "bg-muted text-foreground",
          )}
        >
          <p className="text-xs">{body}</p>
        </div>
      )}

      <div className="">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="p-0 bg-black border-none max-w-[95vw] max-h-[95vh] flex items-center justify-center">
            <img
              src={mediaUrl || "/placeholder.svg"}
              alt={body || "Imagen"}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
