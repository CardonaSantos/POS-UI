export const mikroTikQkeys = {
  all: ["mikrotiks"] as const,
  specific: (mikroTikId: number) => ["mikrotiks", mikroTikId] as const,
};
