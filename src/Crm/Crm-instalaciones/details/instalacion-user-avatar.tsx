import * as Avatar from "@radix-ui/react-avatar";

import type { ClienteInstalacionUsuarioResumen } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { getInitials } from "./instalacion-utils.utils";

type InstalacionUserAvatarProps = {
  user: ClienteInstalacionUsuarioResumen | null;
  size?: "sm" | "md" | "lg";
};

const avatarSizeClasses = {
  sm: "size-8 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-12 text-sm",
} as const;

export function InstalacionUserAvatar({
  user,
  size = "md",
}: InstalacionUserAvatarProps) {
  const name = user?.nombre ?? "Usuario no disponible";

  return (
    <Avatar.Root
      className={[
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "border border-[hsl(var(--app-border))]",
        "bg-[hsl(var(--app-muted))]",
        "text-[hsl(var(--app-muted-foreground))]",
        avatarSizeClasses[size],
      ].join(" ")}
      title={name}
    >
      {user?.avatarUrl ? (
        <Avatar.Image
          src={user.avatarUrl}
          alt=""
          className="size-full object-cover"
        />
      ) : null}

      <Avatar.Fallback
        delayMs={200}
        className="flex size-full items-center justify-center font-semibold"
      >
        {getInitials(user?.nombre)}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
