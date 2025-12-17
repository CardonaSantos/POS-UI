"use client"

import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

interface MessageAudioProps {
  mediaUrl: string
  isOutbound: boolean
}

export function MessageAudio({ mediaUrl, isOutbound }: MessageAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div
      className={cn(
        "rounded-lg border max-w-[240px] px-3 py-2",
        isOutbound ? "ml-auto bg-primary/10 border-primary/20" : "bg-muted border-border",
      )}
    >
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary w-0" />
        </div>
        <span className="text-[10px] text-muted-foreground flex-shrink-0">0:00</span>
      </div>
      <audio ref={audioRef} src={mediaUrl} onEnded={() => setIsPlaying(false)} />
    </div>
  )
}
