import {
  Home,
  Users,
  Building,
  Ticket,
  FileText,
  CreditCard,
  UserPlus,
  Waypoints,
  Cpu,
  Wifi,
  Tags,
  MonitorSmartphone,
  MapIcon,
  MapPinned,
  MapPin,
  MessagesSquare,
  User,
  LucideIcon,
  Target,
  ClipboardCheck,
  Sheet,
} from "lucide-react";

export interface Route {
  icon: LucideIcon;
  label: string;
  href?: string;
  submenu?: Route[];
}
export const routesCrm_SuperAdmin = [
  { icon: Home, label: "Inicio", href: "/crm" },

  {
    icon: Users,
    label: "Clientes",
    submenu: [
      {
        icon: Users,
        label: "Listado de Clientes",
        href: "/crm-clientes",
      },
      {
        icon: UserPlus,
        label: "Nuevo Cliente",
        href: "/crm/crear-cliente-crm",
      },
    ],
  },

  { icon: CreditCard, label: "Facturación", href: "/crm/facturacion" },

  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
      { icon: Target, label: "Metas de Soporte", href: "/crm/metas-soporte" },

      {
        icon: Tags,
        label: "Categorías de Soporte",
        href: "/crm/tags",
      },
    ],
  },
  // SERVICIOS Y GESTIÓN DE SERVICIOS
  {
    icon: Waypoints,
    label: "Servicios",
    submenu: [
      {
        icon: Cpu,
        label: "Gestión de Servicios",
        href: "/crm-servicios",
      },
      {
        icon: Wifi,
        label: "Servicios de Internet",
        href: "/crm-servicios-internet",
      },
    ],
  },

  {
    icon: MapPinned,
    label: "Facturación por Zona",
    href: "/crm-facturacion-zona",
  },
  {
    icon: MapPin,
    label: "Sectores",
    href: "/crm-sectores",
  },

  {
    icon: MessagesSquare,
    label: "Mensajes Automaticos",
    href: "/crm-mensajes-automaticos",
  },

  {
    icon: FileText,
    label: "Plantillas contratos",
    href: "/crm-contrato-plantilla",
  },

  {
    icon: MapIcon,
    label: "Rutas Cobro",
    submenu: [
      {
        icon: MapPin,
        label: "Rutas",
        href: "/crm/ruta",
      },

      {
        icon: MapPin,
        label: "Mis rutas",
        href: "/crm/rutas-asignadas",
      },
    ],
  },
  { icon: Building, label: "Empresa", href: "/crm/empresa" },

  { icon: User, label: "Perfil", href: "/crm/perfil" },

  { icon: Users, label: "Usuarios", href: "/crm/usuarios" },
];

export const routesCrm_Admin = [
  { icon: Home, label: "Dashboard", href: "/crm" },

  {
    icon: Users,
    label: "Clientes",
    submenu: [
      {
        icon: Users,
        label: "Listado de Clientes",
        href: "/crm-clientes",
      },
      {
        icon: UserPlus,
        label: "Nuevo Cliente",
        href: "/crm/crear-cliente-crm",
      },
    ],
  },

  { icon: CreditCard, label: "Facturación", href: "/crm/facturacion" },

  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
      { icon: Target, label: "Metas de Soporte", href: "/crm/metas-soporte" },

      {
        icon: Tags,
        label: "Categorías de Soporte",
        href: "/crm/tags",
      },
    ],
  },
  // SERVICIOS Y GESTIÓN DE SERVICIOS
  {
    icon: Waypoints,
    label: "Servicios",
    submenu: [
      {
        icon: Cpu,
        label: "Gestión de Servicios",
        href: "/crm-servicios",
      },
      {
        icon: Wifi,
        label: "Servicios de Internet",
        href: "/crm-servicios-internet",
      },
    ],
  },

  {
    icon: MapPinned,
    label: "Facturación por Zona",
    href: "/crm-facturacion-zona",
  },
  {
    icon: MapPin,
    label: "Sectores",
    href: "/crm-sectores",
  },

  {
    icon: MessagesSquare,
    label: "Mensajes Automaticos",
    href: "/crm-mensajes-automaticos",
  },

  {
    icon: FileText,
    label: "Plantillas contratos",
    href: "/crm-contrato-plantilla",
  },

  {
    icon: MapIcon,
    label: "Rutas Cobro",
    submenu: [
      {
        icon: MapPin,
        label: "Rutas",
        href: "/crm/ruta",
      },

      {
        icon: ClipboardCheck,
        label: "Mis rutas",
        href: "/crm/rutas-asignadas",
      },
    ],
  },

  {
    icon: MapIcon,
    label: "Registros eliminados",
    submenu: [
      {
        icon: MapPin,
        label: "Facturas eliminadas (demo)",
        href: "/crm/facturas-eliminadas",
      },
    ],
  },
  { icon: Sheet, label: "Reports", href: "/crm/reports" },

  { icon: User, label: "Perfil", href: "/crm/perfil" },
  { icon: Users, label: "Usuarios", href: "/crm/usuarios" },
];

export const routesCrm_Oficina = [
  { icon: Home, label: "Dashboard", href: "/crm" },

  {
    icon: Users,
    label: "Clientes",
    submenu: [
      {
        icon: Users,
        label: "Listado de Clientes",
        href: "/crm-clientes",
      },
      {
        icon: UserPlus,
        label: "Nuevo Cliente",
        href: "/crm/crear-cliente-crm",
      },
    ],
  },

  { icon: CreditCard, label: "Facturación", href: "/crm/facturacion" },

  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
      { icon: Target, label: "Metas de Soporte", href: "/crm/metas-soporte" },

      {
        icon: Tags,
        label: "Categorías de Soporte",
        href: "/crm/tags",
      },
    ],
  },
  // SERVICIOS Y GESTIÓN DE SERVICIOS
  {
    icon: Waypoints,
    label: "Servicios",
    submenu: [
      {
        icon: Cpu,
        label: "Gestión de Servicios",
        href: "/crm-servicios",
      },
      {
        icon: Wifi,
        label: "Servicios de Internet",
        href: "/crm-servicios-internet",
      },
    ],
  },

  {
    icon: MapPinned,
    label: "Facturación por Zona",
    href: "/crm-facturacion-zona",
  },
  {
    icon: MapPin,
    label: "Sectores",
    href: "/crm-sectores",
  },

  {
    icon: FileText,
    label: "Plantillas contratos",
    href: "/crm-contrato-plantilla",
  },

  {
    icon: MapIcon,
    label: "Rutas Cobro",
    submenu: [
      {
        icon: MapPin,
        label: "Rutas Manage",
        href: "/crm/ruta",
      },
    ],
  },

  { icon: Sheet, label: "Reports", href: "/crm/reports" },

  { icon: User, label: "Perfil", href: "/crm/perfil" },
];

export const routesCrm_Tecnico = [
  { icon: Home, label: "Dashboard", href: "/crm" },
  { icon: CreditCard, label: "Facturación", href: "/crm/facturacion" },
  {
    icon: MonitorSmartphone,
    label: "Soporte",
    submenu: [
      { icon: Ticket, label: "Tickets de Soporte", href: "/crm/tickets" },
    ],
  },
  { icon: User, label: "Perfil", href: "/crm/perfil" },
];

//rutas para otro rol del
export const routesCrm_Otro = [
  { icon: Home, label: "Inicio", href: "/crm" },

  {
    icon: Users,
    label: "Clientes",
    submenu: [
      {
        icon: Users,
        label: "Listado de Clientes",
        href: "/crm-clientes",
      },
      {
        icon: UserPlus,
        label: "Nuevo Cliente",
        href: "/crm/crear-cliente-crm",
      },
    ],
  },
];

// --- CRM -------------------------------------------------
export const CRM_ROUTES: Record<string, Route[]> = {
  ADMIN: routesCrm_Admin,
  TECNICO: routesCrm_Tecnico,
  OFICINA: routesCrm_Oficina,
  SUPER_ADMIN: routesCrm_Tecnico,
  DEFAULT: routesCrm_Otro,
};
