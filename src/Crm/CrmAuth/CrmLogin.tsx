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
import { AtSign, Lock, Eye, EyeOff } from "lucide-react"; // Importamos los iconos de ojo
import { toast } from "sonner";
import { useLogin } from "../CrmHooks/hooks/use-auth/useAuth";

export default function CrmLogin() {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useLogin(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanData = {
      correo: formData.correo.toLowerCase().trim(),
      contrasena: formData.contrasena,
    };

    mutate(cleanData, {
      onSuccess: (data: any) => {
        console.log("Login exitoso:", data);
        toast.success("Inicio de sesión exitoso");

        if (data?.access_token) {
          localStorage.setItem("tokenAuthCRM", data.access_token);
          window.location.href = "/crm";
        }
      },
      onError: (error: any) => {
        console.error("Error en login:", error);
        const mensaje =
          error.response?.data?.message || "Credenciales incorrectas";
        toast.error(mensaje);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Acceso al CRM
          </CardTitle>
          <CardDescription className="text-center">
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  autoComplete="email"
                />
              </div>
            </div>

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
                  autoComplete="current-password"
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Verificando..." : "Iniciar sesión"}
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
