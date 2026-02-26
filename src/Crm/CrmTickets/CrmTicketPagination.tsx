import { ArrowLeft, ArrowRight } from "lucide-react";
import { MetaPropsResponse } from "../features/meta-server-response/meta-responses";
import { Button } from "@/components/ui/button";

interface Props {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  meta: MetaPropsResponse;
}

export default function CrmTicketPagination({
  handleNextPage,
  handlePrevPage,
  meta,
}: Props) {
  const isFirstPage = !meta?.hasPrevPage;
  const isLastPage = !meta?.hasNextPage;

  // Estilos ultra compactos y reutilizables
  const btnBase =
    "flex items-center justify-center h-8 px-2 sm:px-3 rounded-md text-sm font-medium transition-all border shadow-sm";
  const activeBtn =
    "bg-background hover:bg-muted text-foreground border-border active:scale-95";
  const disabledBtn =
    "bg-muted/50 text-muted-foreground border-border/50 cursor-not-allowed opacity-50";

  return (
    <div className="flex items-center justify-between p-2 border-t border-border bg-background">
      <Button
        size="sm"
        onClick={handlePrevPage}
        disabled={isFirstPage}
        className={`${btnBase} flex items-center justify-center transition-all ${
          isFirstPage ? disabledBtn : activeBtn
        }`}
      >
        <ArrowLeft size={18} strokeWidth={2.5} className="sm:mr-1" />
      </Button>

      <div className="text-xs sm:text-sm text-muted-foreground font-medium">
        Página <span className="text-foreground">{meta?.page || 1}</span> de{" "}
        <span className="text-foreground">{meta?.totalPages || 1}</span>
      </div>

      <Button
        size="sm"
        onClick={handleNextPage}
        disabled={isLastPage}
        className={`${btnBase} flex items-center justify-center p-2 transition-all ${
          isLastPage
            ? disabledBtn
            : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 active:scale-95"
        }`}
      >
        <ArrowRight size={18} strokeWidth={2.5} />
      </Button>
    </div>
  );
}
