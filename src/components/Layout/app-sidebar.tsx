import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { useStore } from "../Context/ContextSucursal";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useMemo } from "react";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { ChevronDown } from "lucide-react";
import { selectRoutes } from "./Helpers";

export function AppSidebar() {
  const location = useLocation();
  const isCrmLocation = location.pathname.startsWith("/crm");

  const rolUserPOS = useStore((s) => s.userRol) ?? ""; // estado POS
  const rolUserCRM = useStoreCrm((s) => s.rol) ?? ""; // estado CRM

  const displayedRoutes = useMemo(() => {
    return selectRoutes(isCrmLocation, rolUserCRM, rolUserPOS);
  }, [isCrmLocation, rolUserCRM, rolUserPOS]);

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <div className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Secciones</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {displayedRoutes.map((item) => {
                  if (item.submenu) {
                    return (
                      <SidebarMenuItem key={item.label}>
                        <Collapsible defaultOpen className="group/collapsible">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span>{item.label}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.submenu.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.label}>
                                  <SidebarMenuSubButton className="py-5">
                                    <Link
                                      to={subItem.href ?? "/"}
                                      className="flex items-center gap-2"
                                    >
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <subItem.icon className="h-4 w-4 shrink-0" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{subItem.label}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span>{subItem.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      </SidebarMenuItem>
                    );
                  } else {
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.href ?? "/"}
                            className="flex items-center gap-2"
                          >
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <item.icon className="h-4 w-4 shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{item.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
