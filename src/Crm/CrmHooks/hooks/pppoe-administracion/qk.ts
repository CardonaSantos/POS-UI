export const pppoeAdministracionQkeys = {
  all: ["pppoe-administracion"] as const,

  homologaciones: () =>
    [...pppoeAdministracionQkeys.all, "homologaciones"] as const,
};
