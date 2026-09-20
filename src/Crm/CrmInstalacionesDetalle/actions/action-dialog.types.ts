export type InstalacionActionDialogProps = {
  instalacionId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void | Promise<void>;
};
