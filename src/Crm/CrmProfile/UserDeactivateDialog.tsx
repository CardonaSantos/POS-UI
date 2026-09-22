import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { UsersProfile } from "./interfacesProfile";

interface UserDeactivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UsersProfile | null;
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

export function UserDeactivateDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  isPending = false,
}: UserDeactivateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Desactivar usuario</DialogTitle>

          <DialogDescription>
            {user
              ? `Se desactivará el acceso de ${user.nombre}. Su información e historial se conservarán.`
              : "Se desactivará el acceso del usuario."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={isPending || !user}
            onClick={() => void onConfirm()}
          >
            {isPending ? "Desactivando..." : "Desactivar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
