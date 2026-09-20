// import { memo } from "react";

// import type { PppoeAdminActionRequest } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.interfaces";

// import { ActivarPppoeDialog } from "./activar-pppoe-dialog";
// import { AutorizarOperacionDialog } from "./autorizar-operacion-dialog";
// import { ReactivarPppoeDialog } from "./reactivar-pppoe-dialog";
// import { ReintentarPrealtaDialog } from "./reintentar-prealta-dialog";
// import { SuspenderPppoeDialog } from "./suspender-pppoe-dialog";

// type Props = {
//   request: PppoeAdminActionRequest | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onCompleted: () => void;
//   onDataChanged: () => void;
// };

// export const PppoeAdminActionHost = memo(function PppoeAdminActionHost({
//   request,
//   open,
//   onOpenChange,
//   onCompleted,
//   onDataChanged,
// }: Props) {
//   if (!request || !open) return null;

//   switch (request.action) {
//     case "reintentarPrealta":
//       return (
//         <ReintentarPrealtaDialog
//           instalacionId={request.instalacionId}
//           accesoInternetId={request.accesoInternetId}
//           servicioInternetId={request.servicioInternetId}
//           open={open}
//           onOpenChange={onOpenChange}
//           onCompleted={onCompleted}
//         />
//       );

//     case "activarInicial":
//       return (
//         <ActivarPppoeDialog
//           instalacionId={request.instalacionId}
//           open={open}
//           onOpenChange={onOpenChange}
//           onCompleted={onCompleted}
//         />
//       );
//     // case "revelarCredenciales":
//     //   return (
//     //     <CredencialesPppoeDialog
//     //       instalacionId={request.instalacionId}
//     //       open={open}
//     //       onOpenChange={onOpenChange}
//     //       onDataChanged={onDataChanged}
//     //     />
//     //   );

//     case "suspender":
//       return (
//         <SuspenderPppoeDialog
//           cuentaPppoeId={request.cuentaPppoeId}
//           open={open}
//           onOpenChange={onOpenChange}
//           onCompleted={onCompleted}
//         />
//       );

//     case "reactivar":
//       return (
//         <ReactivarPppoeDialog
//           cuentaPppoeId={request.cuentaPppoeId}
//           open={open}
//           onOpenChange={onOpenChange}
//           onCompleted={onCompleted}
//         />
//       );

//     case "autorizarOperacion":
//       return (
//         <AutorizarOperacionDialog
//           operacionId={request.operacionId}
//           empresaId={request.empresaId}
//           open={open}
//           onOpenChange={onOpenChange}
//           onCompleted={onCompleted}
//         />
//       );

//     default:
//       return null;
//   }
// });
