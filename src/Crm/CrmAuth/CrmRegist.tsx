"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AtSign, Lock, User, Eye, EyeOff } from "lucide-react"; // Añadimos Eye/EyeOff
import { toast } from "sonner";
import { RolUsuario } from "@/Crm/CrmProfile/interfacesProfile"; // Asegúrate de importar el Enum correcto
import { useRegister } from "../CrmHooks/hooks/use-auth/useAuth";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

export default function CrmRegist() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: RolUsuario.TECNICO,
    empresaId: 1,
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useRegister(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRolChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rol: value as RolUsuario }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanData = {
      ...formData,
      nombre: formData.nombre.trim(),
      correo: formData.correo.toLowerCase().trim(),
    };

    mutate(cleanData, {
      onSuccess: (response: any) => {
        console.log("Registro exitoso:", response);
        toast.success("Usuario Registrado Correctamente");

        if (response?.access_token) {
          localStorage.setItem("tokenAuthCRM", response.access_token);
          window.location.href = "/crm";
        } else {
          window.location.href = "/auth/login";
        }
      },
      onError: (error: any) => {
        toast.error(getApiErrorMessageAxios(error));
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Registro CRM
          </CardTitle>
          <CardDescription className="text-center">
            Cree una nueva cuenta para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NOMBRE */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre completo"
                  className="pl-10"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* CORREO */}
            <div className="space-y-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="pl-10"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* CONTRASEÑA CON TOGGLE */}
            <div className="space-y-2">
              <Label htmlFor="contrasena">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contrasena"
                  name="contrasena"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ROL */}
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select value={formData.rol} onValueChange={handleRolChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={RolUsuario.TECNICO}>Técnico</SelectItem>
                  <SelectItem value={RolUsuario.OFICINA}>Oficina</SelectItem>
                  <SelectItem value={RolUsuario.ADMIN}>
                    Administrador
                  </SelectItem>
                  <SelectItem value={RolUsuario.SUPER_ADMIN}>
                    Super Administrador
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* BOTÓN SUBMIT */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrar Usuario"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Sistema de gestión CRM © {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
