export const instalacionesQkeys = {
  all: ["instalaciones"],
  specific: (id: number) => [...instalacionesQkeys.all, id],
};
