"use client";

import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "../Context/ContextSucursal";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { selectRoutes } from "./_components/Helpers";
import {
  appSidebarContentVariants,
  appSidebarGroupTriggerVariants,
  appSidebarItemVariants,
  appSidebarMobileHeaderVariants,
  appSidebarNavVariants,
  appSidebarRootVariants,
  appSidebarSectionLabelVariants,
  appSidebarSubListInnerVariants,
  appSidebarSubListVariants,
  appSidebarTooltipVariants,
} from "../app/theme/app-sidebar.variants";
import { Route } from "./_components/RoutesCrm";
import {
  AppSidebarMobileCloseButton,
  AppSidebarMobileOverlay,
  useAppSidebar,
} from "../app/primitives/app-sidebar-shell";

function normalizeHref(href?: string) {
  if (!href) return "/";
  if (href.startsWith("/")) return href;

  return `/${href}`;
}

function getPathWithoutQuery(href?: string) {
  return normalizeHref(href).split("?")[0];
}

function isRouteActive(pathname: string, href?: string) {
  const path = getPathWithoutQuery(href);

  if (path === "/crm") {
    return pathname === "/crm";
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

function hasActiveChild(pathname: string, item: Route) {
  if (item.href && isRouteActive(pathname, item.href)) return true;

  return Boolean(
    item.submenu?.some((subItem) => isRouteActive(pathname, subItem.href)),
  );
}

function SidebarTooltip({
  label,
  children,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled) return <>{children}</>;

  return (
    <span className="group/tooltip relative block">
      {children}
      <span className={appSidebarTooltipVariants()}>{label}</span>
    </span>
  );
}

function RouteIcon({
  icon: Icon,
  size = "root",
}: {
  icon: Route["icon"];
  size?: "root" | "sub";
}) {
  return (
    <Icon
      className={cn("shrink-0", size === "root" ? "h-4 w-4" : "h-3.5 w-3.5")}
    />
  );
}

function SidebarLabel({
  children,
  collapsed,
  className,
}: {
  children: React.ReactNode;
  collapsed: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-out",
        collapsed
          ? "max-w-0 translate-x-1 opacity-0"
          : "max-w-[180px] translate-x-0 opacity-100",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SidebarItem({
  item,
  active,
  collapsed,
  onNavigate,
  level = "root",
}: {
  item: Route;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
  level?: "root" | "sub";
}) {
  const href = normalizeHref(item.href);

  const content = (
    <Link
      to={href}
      onClick={onNavigate}
      className={cn(
        appSidebarItemVariants({
          active,
          collapsed,
          level,
        }),
        "overflow-hidden",
      )}
      title={collapsed ? item.label : undefined}
    >
      <RouteIcon icon={item.icon} size={level} />

      <SidebarLabel collapsed={collapsed} className="truncate">
        {item.label}
      </SidebarLabel>
    </Link>
  );

  return (
    <SidebarTooltip label={item.label} disabled={!collapsed}>
      {content}
    </SidebarTooltip>
  );
}

function SidebarGroupItem({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: Route;
  pathname: string;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const active = hasActiveChild(pathname, item);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    if (active) {
      setOpen(true);
    }
  }, [active]);

  if (collapsed) {
    return (
      <div className="space-y-1">
        <SidebarTooltip label={item.label}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
              appSidebarGroupTriggerVariants({
                active,
                collapsed: false,
              }),
              "overflow-hidden",
            )}
            title={item.label}
          >
            <RouteIcon icon={item.icon} />
          </button>
        </SidebarTooltip>

        {open ? (
          <div className="space-y-1">
            {item.submenu?.map((subItem) => (
              <SidebarItem
                key={subItem.label}
                item={subItem}
                active={isRouteActive(pathname, subItem.href)}
                collapsed
                level="sub"
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          appSidebarGroupTriggerVariants({
            active,
            collapsed: false,
          }),
          "overflow-hidden",
        )}
      >
        <SidebarLabel
          collapsed={collapsed}
          className="flex-1 truncate text-left"
        >
          {item.label}
        </SidebarLabel>

        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 transition-[transform,opacity] duration-200",
            collapsed ? "opacity-0" : "opacity-100",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className={appSidebarSubListVariants()}>
          <div className={appSidebarSubListInnerVariants()}>
            {item.submenu?.map((subItem) => (
              <SidebarItem
                key={subItem.label}
                item={subItem}
                active={isRouteActive(pathname, subItem.href)}
                collapsed={false}
                level="sub"
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const sidebar = useAppSidebar();

  const collapsed = sidebar.effectiveCollapsed;

  const isCrmLocation = location.pathname.startsWith("/crm");

  const rolUserPOS = useStore((state) => state.userRol) ?? "";
  const rolUserCRM = useStoreCrm((state) => state.rol) ?? "";

  const displayedRoutes = React.useMemo(() => {
    return selectRoutes(isCrmLocation, rolUserCRM, rolUserPOS);
  }, [isCrmLocation, rolUserCRM, rolUserPOS]);

  const handleNavigate = React.useCallback(() => {
    sidebar.closeMobile();
  }, [sidebar]);

  return (
    <>
      <AppSidebarMobileOverlay />

      <aside
        className={cn(
          appSidebarRootVariants({
            collapsed,
            mobileOpen: sidebar.mobileOpen,
          }),
        )}
      >
        <div className={appSidebarMobileHeaderVariants()}>
          <span className="text-xs font-semibold text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Menú
          </span>

          <AppSidebarMobileCloseButton />
        </div>

        <div className={appSidebarContentVariants()}>
          {!collapsed ? (
            <p className={appSidebarSectionLabelVariants()}>Secciones</p>
          ) : (
            <div className="mb-2 h-4" />
          )}

          <nav className={appSidebarNavVariants()}>
            {displayedRoutes.map((item) => {
              const active = hasActiveChild(location.pathname, item);

              if (item.submenu?.length) {
                return (
                  <SidebarGroupItem
                    key={item.label}
                    item={item}
                    pathname={location.pathname}
                    collapsed={collapsed}
                    onNavigate={handleNavigate}
                  />
                );
              }

              return (
                <SidebarItem
                  key={item.label}
                  item={item}
                  active={active}
                  collapsed={collapsed}
                  onNavigate={handleNavigate}
                />
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
