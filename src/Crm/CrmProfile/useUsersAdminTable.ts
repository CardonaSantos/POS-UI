import { useMemo, useState } from "react";

import type { UsersProfile } from "./interfacesProfile";
import type {
  UserRoleFilter,
  UserSortDirection,
  UserSortField,
  UserStatusFilter,
} from "./ProfileConfig.types";
import { getRolUsuarioLabel } from "./users-rol";

const DEFAULT_PAGE_SIZE = 10;

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("es");
}

function compareText(a: unknown, b: unknown): number {
  return String(a ?? "").localeCompare(String(b ?? ""), "es", {
    sensitivity: "base",
    numeric: true,
  });
}

export function useUsersAdminTable(users: UsersProfile[]) {
  const [search, setSearchState] = useState("");
  const [role, setRoleState] = useState<UserRoleFilter>("ALL");
  const [status, setStatusState] = useState<UserStatusFilter>("ALL");
  const [sortField, setSortField] = useState<UserSortField>("creadoEn");
  const [sortDirection, setSortDirection] = useState<UserSortDirection>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(DEFAULT_PAGE_SIZE);

  const setSearch = (value: string) => {
    setSearchState(value);
    setPage(1);
  };

  const setRole = (value: UserRoleFilter) => {
    setRoleState(value);
    setPage(1);
  };

  const setStatus = (value: UserStatusFilter) => {
    setStatusState(value);
    setPage(1);
  };

  const setPageSize = (value: number) => {
    setPageSizeState(value);
    setPage(1);
  };

  const toggleSort = (field: UserSortField) => {
    setPage(1);

    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection(field === "creadoEn" ? "desc" : "asc");
  };

  const clearFilters = () => {
    setSearchState("");
    setRoleState("ALL");
    setStatusState("ALL");
    setPage(1);
  };

  const filteredAndSorted = useMemo(() => {
    const needle = normalize(search);

    const filtered = users.filter((user) => {
      const matchesSearch =
        !needle ||
        normalize(user.nombre).includes(needle) ||
        normalize(user.correo).includes(needle) ||
        normalize(user.telefono).includes(needle) ||
        normalize(user.id).includes(needle) ||
        normalize(getRolUsuarioLabel(user.rol)).includes(needle);

      const matchesRole = role === "ALL" || user.rol === role;
      const matchesStatus =
        status === "ALL" ||
        (status === "ACTIVE" && user.activo) ||
        (status === "INACTIVE" && !user.activo);

      return matchesSearch && matchesRole && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      let result = 0;

      switch (sortField) {
        case "nombre":
          result = compareText(a.nombre, b.nombre);
          break;
        case "correo":
          result = compareText(a.correo, b.correo);
          break;
        case "rol":
          result = compareText(
            getRolUsuarioLabel(a.rol),
            getRolUsuarioLabel(b.rol),
          );
          break;
        case "activo":
          result = Number(a.activo) - Number(b.activo);
          break;
        case "creadoEn":
          result =
            new Date(a.creadoEn).getTime() - new Date(b.creadoEn).getTime();
          break;
      }

      return sortDirection === "asc" ? result : -result;
    });
  }, [users, search, role, status, sortField, sortDirection]);

  const total = filteredAndSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const rows = useMemo(
    () => filteredAndSorted.slice(startIndex, endIndex),
    [filteredAndSorted, startIndex, endIndex],
  );

  const stats = useMemo(() => {
    const active = users.filter((user) => user.activo).length;

    return {
      total: users.length,
      active,
      inactive: users.length - active,
    };
  }, [users]);

  return {
    search,
    role,
    status,
    sortField,
    sortDirection,
    page: currentPage,
    pageSize,
    total,
    totalPages,
    startIndex,
    endIndex,
    rows,
    stats,
    hasActiveFilters:
      Boolean(search.trim()) || role !== "ALL" || status !== "ALL",
    setSearch,
    setRole,
    setStatus,
    setPage,
    setPageSize,
    toggleSort,
    clearFilters,
  };
}
