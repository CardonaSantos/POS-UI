import { Link } from "react-router-dom";

export function CrmForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Acceso restringido
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          No tienes permiso para acceder a esta sección
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Tu cuenta no tiene habilitada esta funcionalidad.
        </p>

        <Link
          to="/crm"
          className="mt-5 inline-block text-sm font-medium underline underline-offset-4"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
