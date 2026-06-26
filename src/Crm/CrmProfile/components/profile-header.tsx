import React from "react";
import { Camera, ImageIcon, UserRound } from "lucide-react";

interface ProfileHeaderImagesProps {
  portadaPreview: string | null;
  avatarPreview: string | null;
  onImageSelected: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "portada",
  ) => void;
}

export function ProfileHeaderImages({
  portadaPreview,
  avatarPreview,
  onImageSelected,
}: ProfileHeaderImagesProps) {
  return (
    <div className="min-w-0">
      <div
        className={[
          "relative h-36 w-full overflow-hidden rounded-[var(--app-radius-md)] border",
          "border-[hsl(var(--app-border,var(--border)))]",
          "bg-[hsl(var(--app-muted,var(--muted))/0.45)]",
        ].join(" ")}
      >
        {portadaPreview ? (
          <img
            src={portadaPreview}
            alt="Portada"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            <ImageIcon className="h-5 w-5" />
            <span className="text-xs">Sin portada</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />

        <label
          className={[
            "absolute bottom-2 right-2 inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-[var(--app-radius-sm)] px-2",
            "bg-black/60 text-[11px] font-medium text-white",
            "transition hover:bg-black/75",
          ].join(" ")}
        >
          <Camera className="h-3.5 w-3.5" />
          Cambiar portada
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => onImageSelected(event, "portada")}
          />
        </label>
      </div>

      <div className="flex justify-center -mt-11">
        <div className="relative">
          <div
            className={[
              "flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[3px]",
              "border-[hsl(var(--app-card-bg,var(--card)))]",
              "bg-[hsl(var(--app-muted,var(--muted))/0.65)]",
              "ring-1 ring-[hsl(var(--app-border,var(--border)))]",
            ].join(" ")}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                <UserRound className="h-5 w-5" />
                <span className="text-[10px]">Sin foto</span>
              </div>
            )}
          </div>

          <label
            className={[
              "absolute bottom-0 right-0 inline-flex h-6 cursor-pointer items-center gap-1 rounded-[var(--app-radius-full)] px-2",
              "bg-[hsl(var(--app-primary,var(--primary)))]",
              "text-[10px] font-semibold text-[hsl(var(--app-primary-foreground,var(--primary-foreground)))]",
              "transition hover:bg-[hsl(var(--app-primary-hover,var(--primary)))]",
            ].join(" ")}
          >
            <Camera className="h-3 w-3" />
            Editar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => onImageSelected(event, "avatar")}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
