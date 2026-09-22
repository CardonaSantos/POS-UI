# Refactor administrador de usuarios

Este paquete mantiene los endpoints actuales del backend y mejora la pantalla de configuración de usuarios sin requerir cambios de API.

## Archivos

1. `users-rol.ts`
   - Reemplaza el enum actual de roles.
   - Incluye labels y opciones reutilizables.

2. `ProfileConfig.api.ts`
   - Mantiene las firmas de los endpoints actuales.
   - `DELETE /user/user-profile/:id` se trata como desactivación porque el backend usa `activo = false`.
   - No fuerza manualmente `multipart/form-data`; Axios administra el boundary de `FormData`.

3. `ProfileConfig.types.ts`
   - Payload administrativo explícito.
   - Tipos de filtros y ordenamiento.

4. `ProfileConfig.hooks.ts`
   - Query de usuarios con TanStack Query.
   - Mutations de actualización, perfil y desactivación.
   - Invalidación automática de lista y detalle.

5. `useUsersAdminTable.ts`
   - Filtro por texto, rol y estado.
   - Orden por usuario, correo, rol, estado y fecha.
   - Paginación client-side.
   - Estadísticas de activos/inactivos.

6. `UserEditDialog.tsx`
   - React Hook Form + Zod.
   - Permite nombre, correo, teléfono, rol, activo y contraseña opcional.
   - El rol se habilita solo para SUPER_ADMIN en `CrmUsers.tsx`.

7. `UserDeactivateDialog.tsx`
   - Habla de desactivar, no de eliminar físicamente.

8. `CrmUsers.tsx`
   - Vista completa con resumen, filtros, sorting, paginación, recarga y acciones.

## Instalación

- Reemplaza el archivo `users-rol.ts` donde actualmente importas `RolUsuario`.
- Coloca los demás archivos en la misma carpeta donde hoy viven `CrmUsers.tsx`, `ProfileConfig.api.ts` e `interfacesProfile.ts`.
- Reemplaza `CrmUsers.tsx` y `ProfileConfig.api.ts`.
- Puedes retirar `DialogEdit.tsx` y `DialogDelete.tsx` de esta vista después de confirmar que ninguna otra pantalla los usa.

## Importante

La lista actual `GET /user/get-user-profile-config` devuelve todos los usuarios de una sola vez. Por eso los filtros, sorting y paginación de esta versión son client-side. Para decenas o pocos cientos de usuarios es suficiente. Si luego quieres paginación real de servidor, conviene agregar `page`, `limit`, `search`, `rol`, `activo` y `sort` al endpoint en lugar de simularlo en el frontend.

La restricción visual de roles no sustituye permisos de backend. Si solo `SUPER_ADMIN` puede cambiar rol o desactivar usuarios, esa regla debe validarse también en NestJS.
