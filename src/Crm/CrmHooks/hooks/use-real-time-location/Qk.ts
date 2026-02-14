export const realTimeQkeys = {
  all: ["real-time-location"] as const,
  specific: (id: number) => ["real-time-location", id] as const,
};
