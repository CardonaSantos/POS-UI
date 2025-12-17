"use client"

import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface MessageImageProps {
  mediaUrl: string
  body: string | null
  isOutbound: boolean
}

export function MessageImage({ mediaUrl, body, isOutbound }: MessageImageProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden max-w-[280px] border", isOutbound ? "ml-auto" : "")}>
      <div className="relative group">
        <img
          src={mediaUrl || "/placeholder.svg"}
          alt={body || "Imagen"}
          className="w-full h-auto max-h-[320px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button size="sm" variant="secondary" className="gap-2" onClick={() => window.open(mediaUrl, "_blank")}>
            <ImageIcon className="h-4 w-4" />
            <span className="text-xs">Ver</span>
          </Button>
        </div>
      </div>
      {body && body !== "[Imagen]" && (
        <div
          className={cn(
            "px-3 py-2 text-sm",
            isOutbound ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
          )}
        >
          <p className="text-xs">{body}</p>
        </div>
      )}
    </div>
  )
}
