import { useState } from "react";
import {
  Check,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  User,
} from "lucide-react";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppTextarea } from "@/components/app/primitives/app-textarea";

export default function Testeos() {
  const [search, setSearch] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const applyGreenTheme = () => {
    document.documentElement.style.setProperty("--app-primary", "160 62% 43%");
    document.documentElement.style.setProperty(
      "--app-primary-hover",
      "160 64% 37%",
    );
    document.documentElement.style.setProperty("--app-ring", "160 62% 43%");
  };

  const applyBlueTheme = () => {
    document.documentElement.style.setProperty("--app-primary", "221 83% 53%");
    document.documentElement.style.setProperty(
      "--app-primary-hover",
      "221 83% 45%",
    );
    document.documentElement.style.setProperty("--app-ring", "221 83% 53%");
  };

  const applyPurpleTheme = () => {
    document.documentElement.style.setProperty("--app-primary", "262 83% 58%");
    document.documentElement.style.setProperty(
      "--app-primary-hover",
      "262 83% 50%",
    );
    document.documentElement.style.setProperty("--app-ring", "262 83% 58%");
  };

  const toggleLoading = () => {
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-1 border-b pb-4">
          <h1 className="text-lg font-semibold">Test App Primitives</h1>
          <p className="text-sm text-muted-foreground">
            Página de prueba para AppButton, AppInput y AppTextarea.
          </p>
        </header>

        {/* Theme runtime */}
        <section className="space-y-3 rounded-md border p-3">
          <div>
            <h2 className="text-sm font-semibold">Theme runtime</h2>
            <p className="text-xs text-muted-foreground">
              Estos botones cambian variables CSS en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <AppButton variant="primary" onClick={applyGreenTheme}>
              Verde
            </AppButton>

            <AppButton variant="primary" onClick={applyBlueTheme}>
              Azul
            </AppButton>

            <AppButton variant="primary" onClick={applyPurpleTheme}>
              Morado
            </AppButton>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-3 rounded-md border p-3">
          <div>
            <h2 className="text-sm font-semibold">AppButton</h2>
            <p className="text-xs text-muted-foreground">
              Variantes, tamaños, iconos y loading.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AppButton leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Nuevo
            </AppButton>

            <AppButton
              variant="secondary"
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              Guardar
            </AppButton>

            <AppButton variant="outline">Cancelar</AppButton>

            <AppButton variant="ghost">Ghost</AppButton>

            <AppButton variant="muted">Muted</AppButton>

            <AppButton
              variant="success"
              leftIcon={<Check className="h-3.5 w-3.5" />}
            >
              Confirmar
            </AppButton>

            <AppButton variant="warning">Advertencia</AppButton>

            <AppButton
              variant="danger"
              leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Eliminar
            </AppButton>

            <AppButton variant="link">Link button</AppButton>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AppButton size="xs">XS</AppButton>
            <AppButton size="sm">SM default</AppButton>
            <AppButton size="md">MD</AppButton>
            <AppButton size="lg">LG</AppButton>

            <AppButton size="iconXs" aria-label="Crear">
              <Plus className="h-3.5 w-3.5" />
            </AppButton>

            <AppButton size="iconSm" aria-label="Guardar">
              <Save className="h-3.5 w-3.5" />
            </AppButton>

            <AppButton size="iconMd" aria-label="Eliminar" variant="danger">
              <Trash2 className="h-3.5 w-3.5" />
            </AppButton>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AppButton
              loading={loading}
              loadingText="Guardando..."
              onClick={toggleLoading}
            >
              Probar loading
            </AppButton>

            <AppButton disabled>Deshabilitado</AppButton>

            <AppButton width="full" variant="outline">
              Botón full width
            </AppButton>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-3 rounded-md border p-3">
          <div>
            <h2 className="text-sm font-semibold">AppInput</h2>
            <p className="text-xs text-muted-foreground">
              Variantes, tamaños, iconos, clearable y estados.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <AppInput
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onClear={() => setSearch("")}
              clearable
              leftIcon={<Search />}
              placeholder="Buscar ticket..."
            />

            <AppInput
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              onClear={() => setPhone("")}
              clearable
              leftIcon={<Phone />}
              type="tel"
              placeholder="Teléfono temporal"
            />

            <AppInput leftIcon={<User />} placeholder="Nombre del cliente" />

            <AppInput
              leftIcon={<Mail />}
              type="email"
              placeholder="correo@empresa.com"
            />

            <AppInput variant="filled" placeholder="Input filled" />

            <AppInput variant="ghost" placeholder="Input ghost" />

            <AppInput variant="underline" placeholder="Input underline" />

            <AppInput invalid placeholder="Input con error" />

            <AppInput intent="success" placeholder="Input success" />

            <AppInput intent="warning" placeholder="Input warning" />

            <AppInput disabled placeholder="Input disabled" />

            <AppInput readOnly value="Solo lectura" />
          </div>

          <div className="flex flex-wrap gap-2">
            <AppInput size="xs" fieldWidth="auto" placeholder="XS" />
            <AppInput size="sm" fieldWidth="auto" placeholder="SM" />
            <AppInput size="md" fieldWidth="auto" placeholder="MD" />
            <AppInput size="lg" fieldWidth="auto" placeholder="LG" />
          </div>
        </section>

        {/* Textareas */}
        <section className="space-y-3 rounded-md border p-3">
          <div>
            <h2 className="text-sm font-semibold">AppTextarea</h2>
            <p className="text-xs text-muted-foreground">
              Multilínea, variantes, resize y estados.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <AppTextarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descripción del problema..."
            />

            <AppTextarea
              variant="filled"
              placeholder="Observaciones internas..."
            />

            <AppTextarea variant="ghost" placeholder="Textarea ghost..." />

            <AppTextarea
              variant="underline"
              placeholder="Textarea underline..."
            />

            <AppTextarea invalid placeholder="Textarea con error..." />

            <AppTextarea resizeMode="none" placeholder="Sin resize manual..." />

            <AppTextarea size="xs" placeholder="Textarea XS..." />

            <AppTextarea size="lg" placeholder="Textarea LG..." />
          </div>
        </section>

        {/* Form simulation */}
        <section className="space-y-3 rounded-md border p-3">
          <div>
            <h2 className="text-sm font-semibold">Simulación de formulario</h2>
            <p className="text-xs text-muted-foreground">
              Esto todavía no usa React Hook Form, pero prueba compatibilidad
              visual.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Título</label>
              <AppInput placeholder="Título del ticket" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Teléfono</label>
              <AppInput type="tel" placeholder="12345678" />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-medium">Descripción</label>
              <AppTextarea placeholder="Describa el problema..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <AppButton variant="outline">Cancelar</AppButton>

            <AppButton
              loading={loading}
              loadingText="Creando..."
              onClick={toggleLoading}
              leftIcon={<Save className="h-3.5 w-3.5" />}
            >
              Crear ticket
            </AppButton>
          </div>
        </section>
      </div>
    </div>
  );
}
// export default Testeos;
