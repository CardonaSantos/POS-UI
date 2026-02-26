import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea"; // <-- Importamos Textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, BellRing, Smartphone } from "lucide-react";
import { RolUsuario } from "../interfacesProfile";

export interface ProfileFormData {
  nombre: string;
  correo: string;
  telefono: string;
  contrasena: string;
  rol: RolUsuario;
  activo: boolean;
  bio: string; // <-- Nuevo
  notificarWhatsApp: boolean; // <-- Nuevo
  notificarPush: boolean; // <-- Nuevo
  notificarSonido: boolean; // <-- Nuevo
}

interface ProfileBasicInfoProps {
  formData: ProfileFormData;
  onChange: (
    field: keyof ProfileFormData,
    value: string | boolean | RolUsuario,
  ) => void;
}

export function ProfileBasicInfo({
  formData,
  onChange,
}: ProfileBasicInfoProps) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      {/* DATOS PERSONALES (2 Columnas en escritorio) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nombre" className="text-sm font-medium">
            Nombre Completo
          </label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => onChange("nombre", e.target.value)}
            required
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="correo" className="text-sm font-medium">
            Correo Electrónico
          </label>
          <Input
            id="correo"
            type="email"
            value={formData.correo}
            onChange={(e) => onChange("correo", e.target.value)}
            required
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefono" className="text-sm font-medium">
            Teléfono
          </label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => onChange("telefono", e.target.value)}
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contrasena" className="text-sm font-medium">
            Contraseña
          </label>
          <Input
            id="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={(e) => onChange("contrasena", e.target.value)}
            placeholder="Dejar en blanco para no cambiar"
            className="h-9"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rol" className="text-sm font-medium">
            Rol Asignado
          </label>
          <Select
            disabled
            value={formData.rol}
            onValueChange={(v) => onChange("rol", v as RolUsuario)}
          >
            <SelectTrigger className="h-9 bg-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RolUsuario.TECNICO}>Técnico</SelectItem>
              <SelectItem value={RolUsuario.OFICINA}>Oficina</SelectItem>
              <SelectItem value={RolUsuario.ADMIN}>Administrador</SelectItem>
              <SelectItem value={RolUsuario.COBRADOR}>Cobrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado de la cuenta (Switch compacto) */}
        <div className="flex items-center justify-between p-2 mt-[22px] h-9 border rounded-md bg-slate-50">
          <span className="text-sm font-medium text-slate-700">
            Estado activo
          </span>
          <Switch
            disabled
            checked={formData.activo}
            onCheckedChange={(val) => onChange("activo", val)}
          />
        </div>
      </div>

      {/* BIOGRAFÍA (Ocupa todo el ancho) */}
      <div className="flex flex-col gap-1.5 border-t pt-4 mt-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Biografía / Notas del perfil
        </label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="Escribe algo sobre ti..."
          className="min-h-[80px] resize-none text-sm"
        />
      </div>

      {/* PREFERENCIAS DE NOTIFICACIÓN (Grid compacto de 3 columnas) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-800">
          Preferencias de Notificación
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-2.5 border rounded-md bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium">WhatsApp</span>
            </div>
            <Switch
              checked={formData.notificarWhatsApp}
              onCheckedChange={(val) => onChange("notificarWhatsApp", val)}
            />
          </div>

          <div className="flex items-center justify-between p-2.5 border rounded-md bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium">Push (Navegador)</span>
            </div>
            <Switch
              checked={formData.notificarPush}
              onCheckedChange={(val) => onChange("notificarPush", val)}
            />
          </div>

          <div className="flex items-center justify-between p-2.5 border rounded-md bg-white shadow-sm">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium">Sonidos</span>
            </div>
            <Switch
              checked={formData.notificarSonido}
              onCheckedChange={(val) => onChange("notificarSonido", val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
